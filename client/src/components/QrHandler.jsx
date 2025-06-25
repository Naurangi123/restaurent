import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/authUtils';
import { fetchQRData } from '../services/apiService';

const QRHandler = () => {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);

  const handleScan = async (data) => {
    if (!data || scanned) return;

    setScanned(true);

    try {
      // You might receive plain text (like "abc123") or a full URL
      let code = data.text || data;

      // Optional: if it's a full URL, extract code
      if (code.includes('code=')) {
        const urlParams = new URL(code).searchParams;
        code = urlParams.get('code');
      }

      const qrData = await fetchQRData(code); // Calls backend

      const menuUrl = `/menu?restaurant=${qrData.restaurantId}&table=${qrData.tableId || ''}`;

      if (!getUserFromToken()) {
        navigate('/login', { state: { redirectTo: menuUrl } });
      } else {
        navigate(menuUrl);
      }
    } catch (err) {
      alert('Invalid or expired QR code.',err);
      navigate('/');
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    alert('Camera access error or scanning failed.');
  };

  return (
    <div>
      <h2>Scan QR Code</h2>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {!scanned && <p>Align the QR code with your camera</p>}
    </div>
  );
};

export default QRHandler;
