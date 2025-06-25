import React, { useEffect, useState } from 'react';
import { getFoods, addCart, searchItems } from '../services/apiServices';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaCartArrowDown, FaHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";

const FoodPage = () => {
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const handleSearch = (query) => {
    try {
      searchItems(query).then((res) => {
        if (res.data) {
          setFilterData(res.data);
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getFoods();
        setFoods(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchFoods();
  }, []);

  const handleAddToCart = async (foodId) => {
    try {
      const result = await addCart({ food: foodId });
      if (result) {
        toast.success("Item added to cart!");
        setTimeout(() => {
          navigate('/cart');
        }, 2000);
      }
    } catch (error) {
      toast.error("Please log in first.", error);
    }
  };

  const handleShowDetails = (foodItem) => {
    setSelectedFood(foodItem);
    setShowModal(true);
  };

  return (
    <div className="relative bg-[#ffffff] min-h-screen py-24 px-4 text-black">
      <ToastContainer />
      <section className="relative z-10 max-w-7xl mx-auto text-center mb-20">
        <p className="relative flex items-center w-full">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search"
            placeholder="Search..."
            className="w-full pl-8 pr-4 py-2 rounded-md bg-gray-400 text-gray-700"
          />
          <IoSearch
            size={18}
            onClick={handleSearch}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
          />
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black drop-shadow-lg">
          Taste the Difference
        </h1>
        <p className="mt-2 text-lg text-gray-900 max-w-xl mx-auto">
          Discover handcrafted dishes made with love. Fast delivery. Fresh ingredients. Satisfaction guaranteed.
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="mt-6 px-6 py-3 bg-green-600 text-black font-bold rounded-lg shadow-lg transition-all"
        >
          Explore Menu
        </button>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods && filterData.map((menuItem) => (
            <div
              key={menuItem.id}
              className="relative bg-[#ffffff] backdrop-blur-md p-4 border border-black rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col justify-between group"
            >
              <div className="relative">
                <img
                  src={`http://localhost:8003/${menuItem.image}`}
                  alt={menuItem.name}
                  className="w-full h-48 object-cover rounded-md mb-3 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute sm:top-0 top-44 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleAddToCart(menuItem.id)}
                    className="absolute top-1 left-1 text-white bg-[#ffffff] border border-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FaCartArrowDown color='black' size={20} />
                  </button>

                  <button
                    onClick={() => handleShowDetails(menuItem)}
                    className="absolute top-1 left-14 text-white bg-[#ffffff] border border-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <BsThreeDots color='black' size={20} />
                  </button>

                  <button
                    className="absolute top-1 left-27 text-white bg-[#fffffffe] p-2 border border-black rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FaHeart color='red' size={20} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-md text-black truncate">{menuItem.name} | {menuItem.restaurants[0]?.name}</h3>

              <div className="text-yellow-400 text-sm mb-1">
                {"★".repeat(Math.round(menuItem.rating || 0)).padEnd(5, "☆")}
                <span className="text-black ml-1">({menuItem.rating ?? "0.0"})</span>
              </div>

              <p className="mb-3">
                <span className="inline-block bg-green-500 px-3 py-1 border border-black rounded-full text-sm text-white font-bold shadow">
                  ₹{menuItem.price}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedFood && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-black text-xl"
            >
              ✕
            </button>
            <img
              src={`http://localhost:8000/${selectedFood.image}`}
              alt={selectedFood.name}
              loading="lazy"
              decoding="async"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{selectedFood.name}</h2>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Restaurant:</span> {selectedFood.restaurants[0]?.name}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Description:</span> {selectedFood.description}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Ingredients:</span> {selectedFood.ingredients}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Cuisine Type:</span> {selectedFood.cuisine_type}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Price:</span> ₹{selectedFood.price}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              {"★".repeat(Math.round(selectedFood.rating || 0)).padEnd(5, "☆")} ({selectedFood.rating ?? "0.0"})
            </p>
            <button
              onClick={() => {
                handleAddToCart(selectedFood.id);
                setShowModal(false);
              }}
              className="w-full py-2 mt-2 border border-black bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodPage;
