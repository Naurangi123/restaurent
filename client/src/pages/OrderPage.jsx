import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryMethod: 'home',
    time: '',
    payment: 'cash',
    notes: ''
  });

  const [cartItems] = useState([
    { id: 1, name: 'Margherita Pizza', quantity: 2, price: 199 },
    { id: 2, name: 'Paneer Wrap', quantity: 1, price: 149 }
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Order placed successfully!');
    console.log('Order Data:', { formData, cartItems });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center mt-20">Complete Your Order</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Items</h3>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between border-b py-2 text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.quantity * item.price}</span>
          </div>
        ))}
        <div className="text-right font-bold mt-2">Total: ₹{total}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block font-medium">Name</label>
          <input type="text" name="name" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input type="tel" name="phone" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Delivery Address</label>
          <textarea name="address" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block font-medium">Delivery Method</label>
          <select name="deliveryMethod" onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="home">Home Delivery</option>
            <option value="pickup">Pickup</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Preferred Delivery Time</label>
          <input type="time" name="time" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block font-medium">Payment Method</label>
          <select name="payment" onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="cash">Cash on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Additional Notes</label>
          <textarea name="notes" onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="E.g. No onions, extra spicy..." />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-800 font-semibold"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
