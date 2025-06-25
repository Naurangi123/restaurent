import React from 'react';
import img from '../assets/img_3.jpg';
import myself from '../assets/myself.jpg';
import img2 from '../assets/priyesh.jpeg';
import { FaStar,FaStarHalf } from 'react-icons/fa';

const ReviewsSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
        What Our Customers Are Saying
      </h2>
      <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
        Here's what some of our happy customers have shared about their experiences. We
        value every opinion and strive to improve constantly.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-xs transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
          <img src={img} alt="User 1" className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-500 shadow-lg" />
          <p className="mt-6 text-lg font-medium text-">"The food was absolutely amazing! Highly recommend the pasta."</p>
          <div className="mt-4 text-gray-600 flex items-center justify-center">
            <span>- Rejesh Kumar</span>
            <div className="flex text-yellow-400 ml-2">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg max-w-xs transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
          <img src={myself} alt="User 2" className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-500 shadow-lg" />
          <p className="mt-6 text-lg font-medium text-gray-800">"A fantastic dining experience, the ambiance was perfect."</p>
          <div className="mt-4 text-gray-600 flex items-center justify-center">
            <span>- Naurangi Lal</span>
            <div className="flex text-yellow-400 ml-2">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg max-w-xs transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
          <img src={img2} alt="User 3" className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-500 shadow-lg" />
          <p className="mt-6 text-lg font-medium text-gray-800">"A wonderful experience, the food and service were top-notch!"</p>
          <div className="mt-4 text-gray-600 flex items-center justify-center">
            <span>- Priyesh</span>
            <div className="flex text-yellow-400 ml-2">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-xs transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
          <img src={img} alt="User 1" className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-500 shadow-lg" />
          <p className="mt-6 text-lg font-medium text-gray-800">"The food was absolutely amazing! Highly recommend the Chicken Pasta."</p>
          <div className="mt-4 text-gray-600 flex items-center justify-center">
            <span>- Abu Osama</span>
            <div className="flex text-yellow-400 ml-2">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
