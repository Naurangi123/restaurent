import React, { useEffect, useState } from "react";
import { searchFoods } from "../services/apiServices";
import { useLocation,useNavigate } from "react-router-dom";

const SearchResultsPage = () => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const navigate=useNavigate()

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("query");
  const category = queryParams.get("category");
  const is_vegetarian = queryParams.get("is_vegetarian");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await searchFoods({
          params: {
            name,
            category,
            is_vegetarian,
          },
        });
        setFoods(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (name) {
      fetchResults();
    }
  }, [name, category, is_vegetarian]);

  const addToCart = (food) => {
    setCart([...cart, food]);
  };

  const handleCart=()=>{
    navigate('/cart',{ state: { cart} })
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Search Results for "<span className="text-teal-600">{name}</span>"
        </h2>
        {foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={food.image || "https://source.unsplash.com/400x300/?food"}
                  alt={food.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{food.name}</h3>
                  <p className="text-gray-600 mt-1 capitalize">{food.category}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                      food.is_vegetarian ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {food.is_vegetarian ? "Vegetarian" : "Non-Vegetarian"}
                  </span>
                  <button
                    onClick={() => addToCart(food)}
                    className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 focus:outline-none"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg mt-6">No matching results found.</p>
        )}
      </div>
      <div className="fixed bottom-4 right-4 p-4 bg-teal-600 text-white rounded-full shadow-lg cursor-pointer">
        <span>{cart.length} items<button onClick={()=>handleCart()}></button></span>
        
      </div>
    </div>
  );
};

export default SearchResultsPage;
