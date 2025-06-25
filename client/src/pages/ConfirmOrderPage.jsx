import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg">
        <h2 className="text-3xl font-bold mb-6">Order Placed Successfully!</h2>
        <p className="text-lg mb-4">Thank you for your order. We will process it and notify you once it's ready for delivery.</p>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
