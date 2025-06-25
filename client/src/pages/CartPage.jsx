import React, { useEffect, useState } from 'react';
import { IoIosCart } from 'react-icons/io';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { getCart, removeCart, updateCart } from '../services/apiServices';
import { toast, ToastContainer } from 'react-toastify';
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import PaymentPage from './PaymentPage';

const AddToCart = () => {
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
      await fetchCarts();
    } catch (error) {
      toast.error('Failed to update quantity.');
      console.error('Quantity update error:', error);
    }
  };

  const removeCartItem = async (id) => {
    try {
      await removeCart(id);
      setCartData((prevCart) => prevCart.filter((item) => item.id !== id));
      toast.success('Item removed successfully.');
    } catch (error) {
      toast.error('Failed to remove item.');
      console.error(error);
    }7
  };

  const handleMenu = () => navigate('/menu');
  const handleGotoFood = () => navigate('/foods');

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <IoIosCart size={28} className="text-blue-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Your Cart ({cartData.length})
          </h2>
        </div>

        {cartData.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {cartData.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden border"
                >
                  <div className="flex items-center gap-4 p-4 border-b">
                    <img
                      src={`http://localhost:8003${item?.food?.image}`}
                      alt={item?.food?.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{item?.food?.name}</h3>
                      <p className="text-sm text-gray-500">Price: ₹{item?.food?.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="bg-gray-100 border p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="text-base font-medium">{item?.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="bg-gray-100 border p-2 rounded-full hover:bg-gray-200"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="flex justify-between items-center px-4 py-2 border-t">
                    <div>
                      <span className="text-xs text-gray-400 block">Total</span>
                      <p className="text-green-600 font-bold text-sm">₹{item?.total_price}</p>
                    </div>
                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-10">
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-700">Total Amount</h3>
                <p className="text-2xl font-bold text-green-600">₹{totalAmount}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGotoFood}
                className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-full text-base font-medium shadow-md transition"
              >
                <TbArrowBackUp size={20} />
                Add More Items
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="w-40 h-40 mb-6 opacity-80"
            />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Your Cart is Empty</h3>
            <p className="text-gray-500 mb-6 text-center">
              Looks like you haven't added anything yet.
            </p>
            <button
              onClick={handleMenu}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg font-medium shadow-md"
            >
              <TbArrowBackUp size={22} />
              Explore Menu
            </button>
          </div>
        )}
      </div>

      {cartData.length > 0 && (
        <div className="w-full max-w-6xl mt-8 bg-yellow-100 rounded-2xl p-6 shadow-lg">
          <PaymentPage cartData={cartData} totalAmount={totalAmount} />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddToCart;
