import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { getCart,updateCart } from '../services/apiServices';
import { toast,ToastContainer } from 'react-toastify';


export default function TableCart() {
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  const fetchCarts = async () => {
    try {
      const data = await getCart();
      setCartData(data);
    } catch (error) {
      toast.error('Failed to load cart items.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handlePay = () => {
    navigate('/table_order_page');
  };

  const totalAmount = cartData.reduce(
    (sum, item) => sum + item?.food?.price * item.quantity,
    0
  );

  const handleQuantityChange = async (itemId, delta) => {
    const item = cartData.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      await updateCart(itemId, { quantity: newQuantity });
      fetchCarts();
    } catch (error) {
      toast.error('Failed to update quantity.');
      console.error('Quantity update error:', error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F7F7F7] rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-[#1E2A38]">Your Premium Cart Items</h2>

      {cartData.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          {cartData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 rounded-md border-t px-4 py-4 hover:bg-gray-200 hover:scale-95 transition duration-300"
            >
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                <span className="text-[#1E2A38] font-medium">{item.name}</span>
              </div>

              <div className="w-full md:w-1/6 flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="bg-[#1E2A38] text-white px-2 py-1 rounded hover:bg-gray-800"
                >
                  <FiMinus size={20} />
                </button>
                <span className="min-w-[24px] text-center text-[#1E2A38] font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="bg-[#FFD700] text-[#1E2A38] px-2 py-1 rounded hover:bg-yellow-400"
                >
                  <FiPlus size={20} />
                </button>
              </div>

              <div className="w-full md:w-1/6 text-[#1E2A38]">
                ₹{(item.unitPrice || 0).toFixed(2)}
              </div>

              <div className="w-full md:w-1/6 font-semibold text-[#FFD700]">
                ₹{((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="flex justify-end items-center p-4 border-t bg-gray-50">
            <span className="text-xl font-bold text-[#1E2A38]">Total: ₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handlePay}
          className="bg-[#FFD700] text-[#1E2A38] font-semibold px-6 py-2 rounded shadow hover:bg-yellow-400 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
