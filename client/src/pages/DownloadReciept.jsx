import React from 'react';

const DownloadReceiptButton = ({ orderId }) => {
  const handleDownload = () => {
    const url = `http://127.0.0.1:8010/media/receipts/manual_order_${orderId}.pdf`;

    // Create a temporary <a> element and simulate click
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_Order_${orderId}.pdf`; 
    link.target = '_blank'; 
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        backgroundColor: '#1D4ED8',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      📥 Download Receipt
    </button>
  );
};

export default DownloadReceiptButton;
