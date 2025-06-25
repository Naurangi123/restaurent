/* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// // import { getCart } from "../services/apiServices";
// import { Link } from "react-router-dom";
// import { IoMdPerson, IoIosContacts, IoMdLogIn } from "react-icons/io";
// import { FaCartArrowDown } from "react-icons/fa";
// import { GrServices } from "react-icons/gr";
// import { AiOutlineLogout, AiOutlineMenu, AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
// import { IoHome, IoRestaurantOutline, IoFastFoodSharp, IoSettings, IoChevronDown, IoChevronForward, IoSearch } from "react-icons/io5";
// import { FaRegAddressCard } from "react-icons/fa6";
// import { GiVendingMachine } from "react-icons/gi";
// import { RiMenuSearchFill, RiAdminFill } from "react-icons/ri";
// import { RxDashboard } from "react-icons/rx";
// import { ImProfile } from "react-icons/im";
// import { MdTableRestaurant } from "react-icons/md";
// import useCartCount from "../hooks/useCart";


// function Sidebar({ isAuthenticated, isSidebarOpen, toggleSidebar, handleLogout }) {

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
//   const {itemCount}=useCartCount()

//   return (
//     <div
//       className={`bg-[#ffffff] text-black fixed top-0 left-0 transition-all duration-250 ${isSidebarOpen ? "w-64 z-50" : "w-14"
//         }`}
//     >
//       <div className="flex flex-col justify-between">
//         <div>
//           <div className="flex items-center justify-between p-4 bg-white">
//             <div className="flex items-center space-x-2">
//               <IoRestaurantOutline color="black" onClick={toggleSidebar} size={35} />
//               {isSidebarOpen && <span className="text-black text-lg">Red Chillies</span>}
//             </div>
//             {isSidebarOpen ? (
//               <AiFillCaretLeft
//                 size={25}
//                 onClick={toggleSidebar}
//                 className="cursor-pointer p-2 rounded-md"
//               />
//             ) : (
//               <AiFillCaretRight
//                 size={25}
//                 onClick={toggleSidebar}
//                 className="cursor-pointer p-2 rounded-md"
//               />
//             )}
//           </div>

//           <div className="mt-6 space-y-2 px-2">
//             {isAuthenticated ? (
//               <>
//                 <div className="text-black">
//                   <div className="flex items-center justify-between p-2 border border-black rounded-md text-black hover:bg-black hover:text-white  cursor-pointer">
//                     <Link to="/" className="flex items-center space-x-3">
//                       <RiAdminFill onClick={toggleDropdown} size={25} />
//                       {isSidebarOpen && <span className="ml-4">Admin</span>}
//                     </Link>
//                     {isSidebarOpen && (
//                       <button onClick={toggleDropdown} className="ml-auto pr-2">
//                         {isDropdownOpen ? <IoChevronDown size={25}
//                           className={`transform transition-transform duration-250 ${isDropdownOpen ? 'rotate-180' : ''
//                             }`}
//                         /> : <IoChevronForward size={25} />}
//                       </button>
//                     )}
//                   </div>

//                   {isSidebarOpen && isDropdownOpen && (
//                     <div className={`ml-10 overflow-hidden transition-all duration-250 ${isSidebarOpen
//                       ? isDropdownOpen
//                         ? 'opacity-100 delay-75'
//                         : 'opacity-0 delay-75'
//                       : 'hidden'
//                       }`}>
//                       <Link to="/dashboard" className="flex items-center m-1 p-2 border border-black hover:bg-black hover:text-white  hover:p-2 rounded-md">
//                         <RxDashboard size={25} />
//                         {isSidebarOpen && <span className="ml-4">Dashboard</span>}
//                       </Link>
//                       <Link to="/settings" className="flex items-center m-1 p-2 border border-black hover:bg-black hover:text-white hover:p-2 rounded-md">
//                         <IoSettings size={25} />
//                         {isSidebarOpen && <span className="ml-4">Setting</span>}</Link>
//                       <Link to="/reservations" className="flex items-center m-1 p-2 border border-black hover:bg-black hover:text-white hover:p-2 rounded-md">
//                         <ImProfile size={25} />
//                         {isSidebarOpen && <span className="ml-4">Resevations</span>}</Link>
//                     </div>
//                   )}
//                 </div>
//                 <Link to="/" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <IoHome size={25} />
//                   {isSidebarOpen && <span className="ml-4">Home</span>}
//                 </Link>
//                 <Link to="/menu" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <RiMenuSearchFill size={25} />
//                   {isSidebarOpen && <span className="ml-4">Menu</span>}
//                 </Link>
//                 <Link to="/foods" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <IoFastFoodSharp size={25} />
//                   {isSidebarOpen && <span className="ml-4">Explore Foods</span>}
//                 </Link>
//                 <Link to="/cart" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <FaCartArrowDown size={25} />
//                   <span className="font-semibold">{itemCount}</span>
//                   {isSidebarOpen && <span className="ml-4">Cart</span>}
//                 </Link>
//                 <Link to="/users" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <IoIosContacts size={25} />
//                   {isSidebarOpen && <span className="ml-4">Users</span>}
//                 </Link>
//                 <Link to="/vendors" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <GiVendingMachine size={25} />
//                   {isSidebarOpen && <span className="ml-4">Vendors</span>}
//                 </Link>
//                 <Link to="/table_order" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <GrServices size={25} />
//                   {isSidebarOpen && <span className="ml-4">Services</span>}
//                 </Link>
//                 <Link to="/qr_code" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <MdTableRestaurant
//                     size={25} />
//                   {isSidebarOpen && <span className="ml-4">Tables</span>}
//                 </Link>
//                 <Link to="/menus" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <MdTableRestaurant
//                     size={25} />
//                   {isSidebarOpen && <span className="ml-4">Qr Order</span>}
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black ">
//                   <IoMdLogIn size={25} />
//                   {isSidebarOpen && <span className="ml-4">Login</span>}
//                 </Link>
//                 <Link to="/register" className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white  text-black">
//                   <IoMdPerson size={25} />
//                   {isSidebarOpen && <span className="ml-4">Register</span>}
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>

//         {isAuthenticated ? (
//           <div className="p-2 border-t border-gray-700 flex items-center space-x-2">
//             <IoRestaurantOutline size={25} />
//             {isSidebarOpen && (
//               <div className="flex flex-col">
//                 <span className="p-2 rounded-md text-sm">Red Chillies</span>
//                 <span className="text-xs text-gray-400">redchillies@info.com</span>
//               </div>
//             )}
//             <AiOutlineLogout
//               size={25}
//               onClick={handleLogout}
//               className="ml-auto cursor-pointer p-2 rounded-md"
//               title="Logout"
//             />
//           </div>
//         ) : (
//           <div className="p-4 border-t border border-black flex items-center space-x-3">
//             <IoRestaurantOutline size={35} />
//             {isSidebarOpen && (
//               <div className="flex flex-col">
//                 <span className="p-2 rounded-md text-sm">Red Chillies</span>
//                 <span className="text-xs text-black">redchillies@info.com</span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IoRestaurantOutline, IoFastFoodSharp, IoSettings,
  IoChevronDown, IoChevronForward, IoHome
} from "react-icons/io5";
import {
  FaCartArrowDown
} from "react-icons/fa";
import { IoIosContacts,IoMdLogIn,IoMdPerson } from "react-icons/io";
import { GrServices } from "react-icons/gr";
import {
  AiOutlineLogout, AiFillCaretLeft, AiFillCaretRight
} from "react-icons/ai";
import { GiVendingMachine } from "react-icons/gi";
import { RiMenuSearchFill, RiAdminFill } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { ImProfile } from "react-icons/im";
import { MdTableRestaurant } from "react-icons/md";
import useCartCount from "../hooks/useCart";

function Sidebar({ isAuthenticated, isSidebarOpen, toggleSidebar, handleLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const { itemCount } = useCartCount();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSidebarWidth = () => {
    if (windowWidth < 768) return isSidebarOpen ? 'w-64' : 'w-0';
    return isSidebarOpen ? 'w-64' : 'w-14';
  };

  const SidebarLink = ({ to, icon: Icon, label, extra }) => (
    <Link to={to} className="flex items-center space-x-3 p-2 border border-black rounded-md hover:bg-black hover:text-white text-black">
      <Icon size={22} />
      {extra}
      {isSidebarOpen && <span className="ml-2">{label}</span>}
    </Link>
  );

  return (
    <div
      className={`bg-white text-black fixed top-0 left-0 transition-all duration-300 z-50 
        ${getSidebarWidth()} h-screen overflow-y-auto shadow-md`}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-2">
              <IoRestaurantOutline onClick={toggleSidebar} size={30} />
              {isSidebarOpen && <span className="text-lg font-bold">Red Chillies</span>}
            </div>
            {windowWidth >= 768 && (
              isSidebarOpen ? (
                <AiFillCaretLeft size={22} onClick={toggleSidebar} className="cursor-pointer" />
              ) : (
                <AiFillCaretRight size={22} onClick={toggleSidebar} className="cursor-pointer" />
              )
            )}
          </div>

          {/* Sidebar Menu */}
          <div className="mt-4 px-2 space-y-2">
            {isAuthenticated ? (
              <>
                {/* Admin Dropdown */}
                <div>
                  <div className="flex items-center justify-between p-2 border border-black rounded-md hover:bg-black hover:text-white cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <RiAdminFill size={22} />
                      {isSidebarOpen && <span>Admin</span>}
                    </div>
                    {isSidebarOpen && (
                      <button onClick={toggleDropdown}>
                        {isDropdownOpen ? <IoChevronDown /> : <IoChevronForward />}
                      </button>
                    )}
                  </div>
                  {isSidebarOpen && isDropdownOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      <SidebarLink to="/dashboard" icon={RxDashboard} label="Dashboard" />
                      <SidebarLink to="/settings" icon={IoSettings} label="Settings" />
                      <SidebarLink to="/reservations" icon={ImProfile} label="Reservations" />
                    </div>
                  )}
                </div>

                <SidebarLink to="/" icon={IoHome} label="Home" />
                <SidebarLink to="/menu" icon={RiMenuSearchFill} label="Menu" />
                <SidebarLink to="/foods" icon={IoFastFoodSharp} label="Explore Foods" />
                <SidebarLink to="/cart" icon={FaCartArrowDown} label="Cart" extra={<span className="font-semibold">{itemCount}</span>} />
                <SidebarLink to="/users" icon={IoIosContacts} label="Users" />
                <SidebarLink to="/vendors" icon={GiVendingMachine} label="Vendors" />
                <SidebarLink to="/table_order" icon={GrServices} label="Services" />
                <SidebarLink to="/qr_code" icon={MdTableRestaurant} label="Tables" />
                <SidebarLink to="/menus" icon={MdTableRestaurant} label="QR Order" />
              </>
            ) : (
              <>
                <SidebarLink to="/login" icon={IoMdLogIn} label="Login" />
                <SidebarLink to="/register" icon={IoMdPerson} label="Register" />
              </>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t flex items-center space-x-2">
          <IoRestaurantOutline size={24} />
          {isSidebarOpen && (
            <div>
              <div className="text-sm font-semibold">Red Chillies</div>
              <div className="text-xs text-gray-500">redchillies@info.com</div>
            </div>
          )}
          {isAuthenticated && (
            <AiOutlineLogout
              onClick={handleLogout}
              size={20}
              className="ml-auto cursor-pointer"
              title="Logout"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
