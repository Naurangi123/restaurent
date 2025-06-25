import React, { useEffect, useState } from 'react';
import { gettableQRCode } from '../services/apiServices';
import { toast } from 'react-toastify';

const QRManagementPage = () => {
  const [qrCodes, setQrCodes] = useState([]);

  const fetchTables = async () => {
    try {
      const data = await gettableQRCode();
      setQrCodes(data); 
    } catch (error) {
      console.error("Error fetching QR codes", error);
      toast.error(error.message || "Failed to load QR codes");
    }
  };

  useEffect(() => {
      fetchTables();
  }, []);

  console.log("qrcode",qrCodes)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">QR Codes for Tables</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {qrCodes.map((table) => (
          <div key={table.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              Table #{table.table_number}
            </h3>
            {table.qr_code ? (
              <img
                src={`http://localhost:8000${table.qr_code}`}
                alt={`QR Code for Table ${table.table_number}`}
                className="w-48 h-48 object-contain items-center"
              />
            ) : (
              <p>No QR code available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRManagementPage;
