/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { bookTable, getTable } from '../services/apiServices';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUsers, FaClock, FaCalendarAlt } from 'react-icons/fa';

const BookingSection = () => {
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    reservation_date: '',
    reservation_time: '',
    reservation_end_time: '',
    number_of_people: '',
    table: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const data = await getTable();
        setAvailableTables(data || []);
      } catch (error) {
        toast.error(`Failed to fetch table info: ${error.message}`);
      }
    };
    fetchTable();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.table) {
      toast.error('Please select a table before submitting.');
      return;
    }
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      setLoading(true);
      const response = await bookTable(data);
      toast.success(response?.message || 'Table booked!');
      setTimeout(() => {
        navigate('/reservations');
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const InputWithIcon = ({ Icon, ...props }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
      <input
        {...props}
        className="w-full pl-10 p-3 bg-white border border-black text-black placeholder-black rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      />
    </div>
  );

  return (
    <section id='bookTable' className="relative w-full h-auto min-h-screen flex items-center justify-center px-4 py-20 text-white overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105" />
      <div className="absolute inset-0 bg-white bg-opacity-60" />
      <div className="relative w-full max-w-3xl mx-auto z-10">
        <h2 className="text-4xl font-bold mb-8 text-black text-center">Reserve a Table</h2>
        <ToastContainer />
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 grid-cols-1 md:grid-cols-2 bg-white backdrop-blur-md border border-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 p-8 rounded-xl shadow-xl"
        >
          <InputWithIcon
            Icon={FaUser}
            type="text"
            name="customer_name"
            placeholder="Your Name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            Icon={FaEnvelope}
            type="email"
            name="customer_email"
            placeholder="Your Email"
            value={formData.customer_email}
            onChange={handleChange}
            required
          />
          <div className="col-span-1 md:col-span-2">
            <select
              value={formData.table}
              onChange={handleChange}
              name="table"
              className="w-full p-3 border border-black bg-white text-black rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            >
              <option value="">Select a table</option>
              {availableTables.map((table) => (
                <option key={table.id} value={table.table_number} className='bg-gray-400'>
                  Table {table.table_number} (Seats: {table.seats})
                </option>
              ))}
            </select>
          </div>
          <InputWithIcon
            Icon={FaCalendarAlt}
            type="date"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            Icon={FaClock}
            type="time"
            name="reservation_time"
            value={formData.reservation_time}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            Icon={FaClock}
            type="time"
            name="reservation_end_time"
            value={formData.reservation_end_time}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            Icon={FaUsers}
            type="number"
            name="number_of_people"
            placeholder="Number of People"
            value={formData.number_of_people}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-3 items-center mx-auto w-1/3 md:col-span-2 border border-black bg-black hover:bg-green-500 disabled:opacity-50 text-white py-3 rounded-md font-semibold transition"
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingSection;
