import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, MapPin } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Main Nav */}
      <div className="bg-amazon text-white flex flex-col md:flex-row items-center justify-between px-2 py-2 w-full gap-2 md:gap-4 h-auto md:h-16">
        
        {/* Left Section: Logo & Deliver To */}
        <div className="flex items-center w-full md:w-auto justify-between md:justify-start gap-4">
          <Link to="/" className="flex items-center border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer mt-1 relative overflow-hidden">
            <span className="text-2xl font-bold font-serif tracking-tighter text-white mr-1 relative z-10">amazon</span>
            <span className="text-xs absolute right-1 -top-1 opacity-70">.com</span>
          </Link>
          
          <div className="hidden lg:flex items-center border border-transparent hover:border-white p-1 rounded cursor-pointer mr-2">
            <MapPin size={18} className="mt-2 mr-1 opacity-90" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-300 ml-0.5">Deliver to User</span>
              <span className="text-sm font-bold leading-none">New York 10001</span>
            </div>
          </div>
        </div>
        
        {/* Middle Section: Search Bar */}
        <div className="flex-1 flex w-full relative h-[40px] rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
          <select className="bg-gray-100 text-gray-700 text-xs px-2 md:px-3 border-r border-gray-300 outline-none cursor-pointer hidden sm:block">
            <option>All</option>
            <option>Electronics</option>
            <option>Computers</option>
          </select>
          <input 
            type="text" 
            className="flex-1 h-full text-black px-4 py-2 outline-none"
            placeholder="Search Amazon"
          />
          <button className="bg-orange-400 hover:bg-orange-500 w-[50px] flex items-center justify-center text-black transition-colors focus:ring-inset focus:ring-2 focus:ring-black">
            <Search size={22} className="opacity-90"/>
          </button>
        </div>

        {/* Right Section: Account, Orders, Cart */}
        <div className="flex items-center gap-1 md:gap-3 shrink-0 whitespace-nowrap self-end md:self-auto mb-1 md:mb-0">
          <Link to="/login" className="flex flex-col border border-transparent hover:border-white py-1 px-2 rounded cursor-pointer leading-tight">
            <span className="text-xs font-normal">Hello, Sign in</span>
            <span className="text-sm font-bold flex items-center gap-1">
              Account & Lists
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 mt-1 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </span>
          </Link>
          
          <Link to="/orders" className="flex flex-col border border-transparent hover:border-white py-1 px-2 rounded cursor-pointer leading-tight">
            <span className="text-xs font-normal">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-1 border border-transparent hover:border-white px-2 py-1 rounded relative cursor-pointer pt-3">
            <div className="relative flex items-center">
              <span className="absolute -top-3 left-1/2 -ml-2 text-orange-400 font-bold text-base w-4 text-center">0</span>
              <ShoppingCart size={32} />
            </div>
            <span className="hidden sm:block text-sm font-bold mt-2">Cart</span>
          </Link>
        </div>
      </div>

      {/* Secondary Nav bar (Category Bar) */}
      <div className="bg-amazon-light text-white flex items-center pl-4 py-1.5 text-sm gap-4 overflow-x-auto whitespace-nowrap hide-scroll-bar">
        <div className="flex items-center gap-1 border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer font-bold shrink-0">
           <Menu size={20} /> All
        </div>
        <span className="border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer">Today's Deals</span>
        <span className="border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer">Customer Service</span>
        <span className="border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer">Registry</span>
        <span className="border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer">Gift Cards</span>
        <span className="border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer">Sell</span>
      </div>
    </header>
  );
};

export default Header;
