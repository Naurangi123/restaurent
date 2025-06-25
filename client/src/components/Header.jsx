import React from 'react';
import img from '../assets/bg_img.jpg';
import { FiArrowLeft } from "react-icons/fi";


const Header = () => {
  return (
    <header 
      className="relative w-full h-[500px] md:h-[700px] bg-cover bg-center overflow-hidden" 
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-6 md:px-12">
        <h1 className="text-5xl md:text-7xl text-gray-400 font-serif font-bold leading-tight transition-transform duration-300 transform hover:scale-105">
          Welcome to Our Restaurant
        </h1>
        <p className="text-lg md:text-2xl mt-4 font-light opacity-80 transition-opacity duration-300 hover:opacity-100">
          Experience fine dining like never before
        </p>

        <button id='bookTable' className="mt-8 px-8 py-3 text-lg font-semibold text-black bg-white rounded-full shadow-lg hover:bg-yellow-500 hover:text-white transition-all duration-300">
          Book a Table
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <FiArrowLeft size={35} className="w-12 h-12 text-white animate-bounce"/>
      </div>
    </header>
  );
};

export default Header;
