import React, { useState, useEffect } from 'react';
import { getOrders, getReciept } from '../services/apiServices';
import { toast } from 'react-toastify';

const OrderReceiptDownloader = () => {
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const data = await getOrders();
        if (Array.isArray(data) && data.length > 0) {
          // Sort by created_at descending
          const sorted = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          const latestOrder = sorted[0];
          setCurrentOrderId(latestOrder.id);
        } else {
          toast.warning('No orders found.');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch orders.');
      }
    };

    fetchLatestOrder();
  }, []);

  const downloadReceipt = async () => {
    if (!currentOrderId) {
      toast.error('No current order ID available.');
      return;
    }

    setLoading(true);
    try {
      const data = await getReciept(currentOrderId);
      const blob = new Blob([data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order_receipt_${currentOrderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download receipt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Download Latest Order Receipt
      </h3>
      <button
        onClick={downloadReceipt}
        disabled={loading || !currentOrderId}
        className={`w-full px-4 py-2 rounded text-white font-medium transition duration-200 ${
          loading || !currentOrderId
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Downloading...' : 'Download Receipt'}
      </button>
    </div>
  );
};

export default OrderReceiptDownloader;
