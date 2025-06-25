import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Signup } from '../../services/apiServices';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import { toast, ToastContainer } from 'react-toastify';

const Register = () => {

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const res = await Signup(formData);
      if (res?.access && res?.refresh) {
        sessionStorage.setItem(ACCESS_TOKEN, res.access);
        sessionStorage.setItem(REFRESH_TOKEN, res.refresh);
        toast.success(res.response)
        setTimeout(()=>{
          navigate('/');
        })
      } else {
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <ToastContainer />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <input
            name="password2"
            type="password"
            required
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
          <p>Already have an account <Link to='/login'>Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Register;
