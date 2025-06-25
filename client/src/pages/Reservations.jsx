import React, { useEffect, useState } from 'react';
import { getReservations } from '../services/apiServices';

const MyReservations = () => {
  const [active_reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getReservations()
        setReservations(data.active_reservations);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reservations.', err);
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading your reservations...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Reservations</h2>

        {active_reservations.length === 0 ? (
          <p className="text-gray-600">You have no reservations.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active_reservations.map((res) => (
              <div
                key={res.id}
                className="bg-white border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">Table #{res.table}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Date:</strong> {res.reservation_date}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Time:</strong> {res.reservation_time} - {res.reservation_end_time}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Duration:</strong> {res.duration}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Total Amount:</strong> {res.total_amount}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>People:</strong> {res.number_of_people}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {res.customer_email}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyReservations;
