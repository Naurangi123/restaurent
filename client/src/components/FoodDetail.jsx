import React from 'react';
import img4 from '../assets/img_8.jpg';

const FoodDetail = () => {
  const menuItem = {
    title: 'Pasta Carbonara',
    description:
      'A creamy pasta with bacon, eggs, and cheese. A classic Italian dish perfect for any pasta lover. Served with a side of fresh herbs for a burst of flavor.',
    ingredients: [
      'Pasta',
      'Bacon',
      'Eggs',
      'Parmesan Cheese',
      'Black Pepper',
      'Garlic',
      'Olive Oil',
    ],
    price: '$14.99',
    prepTime: '20 minutes',
    image: img4,
    dietaryInfo: 'Contains dairy and gluten. May contain traces of nuts.',
    servingSize: '2-3 servings',
    cuisineType: 'Italian',
    rating: 4.5,
  };

  return (
    <section className="py-16 px-4 bg-gray-100 text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">{menuItem.title}</h2>
        <img
          src={menuItem.image}
          alt={menuItem.title}
          className="w-full h-90 object-cover rounded-lg mb-6"
        />
        <p className="text-lg text-gray-700 mb-4">{menuItem.description}</p>

        <div className="mb-8">
          <span className="font-semibold text-yellow-500">Rating: </span>
          <span className="text-xl text-gray-700">{menuItem.rating} / 5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-2xl mb-4">Ingredients</h3>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              {menuItem.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-2xl mb-4">Details</h3>
            <p className="text-lg mt-2">
              <strong>Price:</strong> {menuItem.price}
            </p>
            <p className="text-lg mt-2">
              <strong>Preparation Time:</strong> {menuItem.prepTime}
            </p>
            <p className="text-lg mt-2">
              <strong>Serving Size:</strong> {menuItem.servingSize}
            </p>
            <p className="text-lg mt-2">
              <strong>Cuisine Type:</strong> {menuItem.cuisineType}
            </p>
            <p className="text-lg mt-2">
              <strong>Dietary Information:</strong> {menuItem.dietaryInfo}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button
            className="inline-block px-8 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600"
          >
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default FoodDetail;
