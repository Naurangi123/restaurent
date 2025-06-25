import React, { useState } from 'react';
import img from '../assets/img_1.jpg'
import img1 from '../assets/img_1.jpg'

const orderItems = [
  {
    id: 1,
    name: 'Noise Cancelling Headphones',
    price: 199.99,
    quantity: 1,
    image: img,
  },
  {
    id: 2,
    name: 'Portable SSD 1TB',
    price: 109.99,
    quantity: 2,
    image: img1,
  },
];

export default function TableOrderPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = (e) => {
    e.preventDefault();
    // payment integration logic
    alert('Payment submitted successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Your Payment</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h2>
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" />
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <span className="text-lg font-semibold text-gray-700">Total:</span>
            <span className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Details</h2>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="mb-4 w-1/2">
              <label className="block text-gray-600 mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            <div className="mb-4 w-1/2">
              <label className="block text-gray-600 mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold mt-2"
          >
            Pay ₹{total.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
}
