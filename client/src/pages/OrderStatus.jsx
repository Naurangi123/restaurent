import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderPage = () => {
  const { orderId } = useParams();  // Using orderId from URL
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/order-status/${orderId}/`)
      .then(res => {
        setOrderStatus(res.data.status); 
      })
      .catch(err => {
        console.error(err);
        setOrderStatus("Error fetching status");
      });
  }, [orderId]);

  const updateStatus = (newStatus) => {
    axios.post(`http://127.0.0.1:8000/api/update-order-status/${orderId}/`, { status: newStatus })
      .then(res => {
        alert(res.data.message);
        setOrderStatus(newStatus); 
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update status.");
      });
  };

  return (
    <div>
      <h3>Order #{orderId}</h3>
      <p>Status: {orderStatus}</p>
      <button onClick={() => updateStatus('Preparing')} disabled={orderStatus === 'Preparing'}>Mark as Preparing</button>
      <button onClick={() => updateStatus('Completed')} disabled={orderStatus === 'Completed'}>Mark as Completed</button>
      <button onClick={() => updateStatus('Cancelled')} disabled={orderStatus === 'Cancelled'}>Cancel Order</button>
    </div>
  );
};

export default OrderPage;
