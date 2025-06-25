import React from 'react';
import img from '../assets/img_1.jpg'
import img3 from '../assets/img_3.jpg'
import img4 from '../assets/img_4.jpg'
import img6 from '../assets/img_5.jpg'


const Gallery = () => {
  return (
    <div className="bg-gray-300 p-10">
      <div className="grid grid-cols-4 gap-4 relative">
        
        <div className="relative overflow-hidden rounded-lg transform transition-all duration-500 hover:scale-105 hover:z-10">
          <img
            className="w-full h-full object-cover"
            src={img4}
            alt="Restaurant Image 4"
            loading="lazy"
            decoding="async"
          />
        </div>

        
        <div className="relative overflow-hidden rounded-lg transform transition-all duration-500 hover:scale-105 hover:z-10">
          <img
            className="w-full h-full object-cover"
            src={img3}
            alt="Restaurant Image 7"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative overflow-hidden rounded-lg col-span-2 -mt-16 z-0">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            src={img6}
            alt="Restaurant Image 8"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative overflow-hidden rounded-lg transform transition-all duration-500 hover:scale-105 hover:z-10">
          <img
            className="w-full h-full object-cover"
            src={img4}
            alt="Restaurant Image 11"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg col-span-2 -mt-16 z-0">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            src={img6}
            alt="Restaurant Image 12"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative overflow-hidden rounded-lg transform transition-all duration-500 hover:scale-105 hover:z-10">
          <img
            className="w-full h-full object-cover"
            src={img}
            alt="Restaurant Image 14"
            loading="lazy"
            decoding="async"
          />
        </div>
        
      </div>
    </div>
  );
};

export default Gallery;
