import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login as loginUser } from '../../services/apiServices';
import { ACCESS_TOKEN,REFRESH_TOKEN } from '../../constants';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      const res = await loginUser(formData);
      if (res?.access && res?.refresh) {
        sessionStorage.setItem(ACCESS_TOKEN, res.access);
        sessionStorage.setItem(REFRESH_TOKEN, res.refresh);
        toast.success('Login successful!');
        setTimeout(()=>{
          navigate('/');
        },200)
      }
    } catch (error) {
      toast.error(error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <ToastContainer/>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Username"
            />
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
          <p>Don't have an account <Link to ='/register'>Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
