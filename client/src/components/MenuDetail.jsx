
import React, { useEffect, useState } from 'react';
import { getMenuDetail, addCart } from '../services/apiServices';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosStarHalf } from "react-icons/io";
import { TbArrowBackUp } from "react-icons/tb";
import { FaCartArrowDown } from "react-icons/fa";

const MenuDetail = () => {
  const { id } = useParams();
  const [menuItem, setMenuDetail] = useState([]);
  const [foodItem, setFoodDetail] = useState([]);
  const [restaurantName, setRestaurantName] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getDetail = async (id) => {
      try {
        const data = await getMenuDetail(id);
        setMenuDetail(data);
        setFoodDetail(data.foods);
        setRestaurantName(data.restaurant);
      } catch (error) {
        toast.error("Something went wrong", error);
      }
    };
    if (id) getDetail(id);
  }, [id]);

  const handleAddToCart = async (foodId) => {
    const data = { food: foodId };
    const result = await addCart(data);
    if (result) {
      toast.success("Item added to cart!");
      navigate('/cart');
    }
  };




  const handleOrder = () => {
    toast.success("Go to order page");
    navigate('/order');
  };

  const handleBack = () => {
    navigate("/menu");
  };

  return (

    // <section className="py-12 px-6 min-h-screen bg-gradient-to-tr from-purple-100 via-blue-200 to-pink-100">
    //<section className="py-12 px-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
    //<section className="relative bg-[#0f2027] text-white overflow-hidden py-12 px-6 min-h-screen">
    // <div className="absolute top-0 left-0 w-full h-full z-0">
    // <div className="bg-gradient-radial from-[#2c5364] via-[#203a43] to-[#0f2027] w-full h-full animate-pulse opacity-60"></div>
    //</div> 
    // <section className="py-12 px-6 min-h-screen bg-gradient-to-br from-white/10 via-white/20 to-white/10 backdrop-blur-md">
    <section className="py-12 px-6 min-h-screen bg-gradient-to-br from-[#e0eafc] via-[#cfdef3] to-[#e0eafc]">
      <div className="max-w-7xl mx-auto mt-20 relative">
        <button
          onClick={handleBack}
          className="absolute -top-12 left-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
        >
          <TbArrowBackUp size={20} />
        </button>

        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600 mb-6">
          {menuItem.name}
        </h2>

        <div className="overflow-hidden rounded-xl shadow-2xl">
          <img
            src={`http://localhost:8004${menuItem.image}`}
            alt={menuItem.title}
            className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="text-xl font-medium text-gray-700 mt-6 mb-10 text-justify leading-relaxed">
          {menuItem.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {foodItem.map((item) => (
            <div
              key={item.id}
              className="aspect-square bg-[#17272d] border border-gray-200 rounded-xl shadow-2xl p-2 hover:scale-105 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm"
            >
              <div className="aspect-square overflow-hidden rounded-md mb-3">
                <img
                  src={`http://localhost:8000/media/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="space-y-1 text-gray-300 flex-1">
                <h3 className="text-sm font-bold truncate">{item.name}</h3>
                <p className="text-xs italic text-[#1c6f12] truncate">{restaurantName.name}</p>
                <p className="text-sm"><strong>₹</strong> {item.price}</p>

                <div className="flex items-center text-xs">
                  <span className={`w-3 h-3 rounded-full ${item.is_vegetarian ? 'bg-green-600' : 'bg-red-600'}`}></span>
                </div>

                <div className="flex items-center text-yellow-500 text-sm">
                  <IoIosStarHalf className="mr-1" />
                  {item.rating}
                </div>
              </div>

              <div className="mt-1 flex justify-between items-center">
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-green-500 text-white rounded-full shadow hover:bg-green-600"
                >
                  <FaCartArrowDown /> Add
                </button>
                <button
                  onClick={handleOrder}
                  className="px-4 py-2 text-xs font-semibold bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600"
                >
                  Order
                </button>
              </div>
            </div>

          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuDetail;
