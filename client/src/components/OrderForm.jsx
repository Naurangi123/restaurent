import React, { useEffect, useState } from 'react';
import { getFoods, orderFood, getTable } from '../services/apiServices';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const [order, setOrder] = useState({
    table_number: '',
    customer_name: '',
    customer_contact: '',
    food_items: [{ food_name: '', quantity: '' }],
  });

  const [foodOptions, setFoodOptions] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchFoods = async () => {
    try {
      const data = await getFoods();
      setFoodOptions(data);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to load food menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchTable = async () => {
    try {
      const data = await getTable();
      setTables(data || []);
    } catch (error) {
      toast.error(`Failed to fetch table info: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTable();
    fetchFoods();
  }, []);

  const handleFoodItemChange = (index, field, value) => {
    const updatedItems = [...order.food_items];
    updatedItems[index][field] = value;
    setOrder({ ...order, food_items: updatedItems });
  };

  const addFoodItem = () => {
    setOrder({
      ...order,
      food_items: [...order.food_items, { food_name: '', quantity: '' }],
    });
  };

  const removeFoodItem = (index) => {
    const updatedItems = order.food_items.filter((_, i) => i !== index);
    setOrder({ ...order, food_items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check for missing data
    if (!order.table_number || !order.customer_name || !order.customer_contact) {
      toast.error('Please fill in all fields');
      return;
    }

    const payload = {
      ...order,
      food_items: order.food_items.map(item => {
        const selectedFood = foodOptions.find(f => f.name === item.food_name);
        return {
          food_id: selectedFood?.id,
          quantity: Number(item.quantity),
        };
      }),
    };

    try {
      const response = await orderFood(payload);
      if (response) {
        toast.success('Order submitted successfully!');
        setOrder({
          table_number: '',
          customer_name: '',
          customer_contact: '',
          food_items: [{ food_name: '', quantity: '' }],
        });
        setTimeout(() => {
          navigate('/receipt'); // Ensure the path is correct here
        }, 2000); // Delay to allow success message to show
      } else {
        toast.error('Failed to submit order');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full p-6 bg-gray-50 rounded shadow">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4 text-center">Create Order</h2>
          <ToastContainer />

          <div className="mb-4">
            <label className="block font-medium mb-1">Table Number</label>
            <select
              value={order.table_number}
              onChange={(e) => setOrder({ ...order, table_number: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Table</option>
              {tables.map((table) => (
                <option key={table.id} value={table.table_number}>
                  Table {table.table_number}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={order.customer_name}
              onChange={(e) => setOrder({ ...order, customer_name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Customer Contact</label>
            <input
              type="text"
              value={order.customer_contact}
              onChange={(e) => setOrder({ ...order, customer_contact: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Food Items</h3>
            {order.food_items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <select
                  value={item.food_name}
                  onChange={(e) => handleFoodItemChange(index, 'food_name', e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  required
                  disabled={loading}
                >
                  <option value="">Select Food</option>
                  {foodOptions.map(option => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)}
                  className="w-24 border rounded px-3 py-2"
                  required
                />
                {order.food_items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFoodItem(index)}
                    className="text-red-600 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFoodItem}
              className="text-blue-600 font-medium text-sm mt-2"
              disabled={loading}
            >
              + Add another item
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
