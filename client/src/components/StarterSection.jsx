import React from 'react';

const StarterSection = () => {
  return (
    <section className="py-24 px-6 text-center bg-lightgreen-100 text-gray-900">
      <h2 className="text-5xl md:text-6xl font-serif font-bold text-darkblue-600 mb-12 transition-all duration-500 transform hover:scale-110 hover:text-lavender-300">
        Starters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="bg-lightgreen-200 p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:rotate-2">
          <h3 className="font-semibold text-3xl mb-4 text-darkblue-600">Bruschetta</h3>
          <p className="text-lg mb-6 text-gray-700">Crispy bread topped with tomatoes, basil, and olive oil.</p>
          <button className="bg-white text-green-600 py-2 px-6 rounded-full shadow-lg hover:text-black hover:bg-green-900 transition-all duration-300 ease-in-out">
            Order Now
          </button>
        </div>

        <div className="bg-lightgreen-200 p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:rotate-2">
          <h3 className="font-semibold text-3xl mb-4 text-darkblue-600">Calamari</h3>
          <p className="text-lg mb-6 text-gray-700">Fried squid served with a tangy dipping sauce.</p>
          <button className="bg-white text-green-600 py-2 px-6 rounded-full shadow-lg hover:text-black hover:bg-green-800 transition-all duration-300 ease-in-out">
            Order Now
          </button>
        </div>
        <div className="bg-lightgreen-200 p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:rotate-2">
          <h3 className="font-semibold text-3xl mb-4 text-darkblue-600">Stuffed Mushrooms</h3>
          <p className="text-lg mb-6 text-gray-700">Mushrooms filled with cheese and herbs, baked to perfection.</p>
          <button className="bg-white text-green-600 py-2 px-6 rounded-full shadow-lg hover:text-black hover:bg-green-800 transition-all duration-300 ease-in-out">
            Order Now
          </button>
        </div>
      </div>
      <div className="w-full mt-16 h-1 bg-darkblue-600 shadow-lg"></div>
      <div className="mt-12 text-center">
        <h3 className="text-3xl font-semibold text-lavender-300 mb-6">The Freshest Ingredients</h3>
        <p className="text-xl mb-6 text-gray-700">
          Each dish is crafted with the finest, locally sourced ingredients to deliver an unforgettable dining experience.
        </p>
        <button className="bg-green-600 text-white py-3 px-8 rounded-full shadow-xl hover:text-black hover:bg-green-800 transition-all duration-300 ease-in-out">
          Learn More About Our Ingredients
        </button>
      </div>
    </section>
  );
};

export default StarterSection;
