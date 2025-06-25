import React from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../assets/img_8.jpg'

const MainSection = () => {
  const navigate = useNavigate();

  const handleMenu = () => {
    navigate('/menu');
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 text-center text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
          Discover Our Delicious Cuisine
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Explore a variety of dishes made with the finest ingredients, crafted for an unforgettable dining experience.
        </p>
        <button
          onClick={handleMenu}
          className="px-8 py-3 text-lg font-semibold bg-white text-red-600 rounded-full shadow-2xl hover:bg-red-600 hover:text-white transform transition-all duration-300 ease-in-out hover:scale-105"
        >
          Explore the Menu
        </button>
      </div>
      <div className="mt-20 space-y-16">
        <div className="bg-white text-black p-12 rounded-lg shadow-xl">
          <h3 className="text-3xl font-semibold mb-4">Chef's Special</h3>
          <p className="text-lg mb-6">
            Indulge in our exclusive chef’s special dishes, crafted with passion and the freshest seasonal ingredients. Our chef curates a unique experience that changes with the seasons, ensuring every visit brings something new.
          </p>
          <button
            onClick={handleMenu}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transform transition-all duration-300 ease-in-out"
          >
            Discover Chef's Specials
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-12 rounded-lg shadow-xl">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h3 className="text-3xl font-semibold mb-4 text-amber-500">Our Ambiance</h3>
            <p className="text-lg mb-6 opacity-80">
              Enjoy a cozy and intimate setting that brings people together. Whether it's a romantic evening or a family celebration, our restaurant offers the perfect ambiance for every occasion.
            </p>
            <button
              onClick={handleMenu}
              className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transform transition-all duration-300 ease-in-out"
            >
              See Our Space
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <img src={img} alt="Restaurant Ambiance" className="rounded-lg shadow-lg" />
          </div>
        </div>
      
      </div>
    </section>
  );
};

export default MainSection;
