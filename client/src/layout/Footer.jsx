import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram,FaTwitter,FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-700 w-full text-white py-8 mb-0 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Red Chillies</h4>
            <p>Delicious food made with love.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul>
              <li><Link to="#home" className="hover:text-red-800">Home</Link></li>
              <li><Link to="#menu" className="hover:text-red-800">Menu</Link></li>
              <li><Link to="#about" className="hover:text-red-800">About Us</Link></li>
              <li><Link to="#reservations" className="hover:text-red-800">Reservations</Link></li>
              <li><Link to="#contact" className="hover:text-red-800">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Contact Info</h4>
            <ul>
              <li>B06 Red Chillies Sec 63., Noida, India</li>
              <li>Email: info@redchillies.com</li>
              <li>Phone: 123-4567-789</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold">Follow Us</h4>
            <div className="flex flex-wrap space-x-4">
              <Link to="#" className="text-white ">
                <FaFacebook color='blue' size={35}/>
              </Link>
              <Link to="#" className="text-white">
                <FaTwitter color='blue' size={35}/>
              </Link>
              <Link to="#" className="text-white">
                <FaInstagram className='rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]' size={35}/>
              </Link>
              <Link to="#" className="text-white">
                <FaYoutube color='red' size={35}/>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>&copy; 2025 Red Chillies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
