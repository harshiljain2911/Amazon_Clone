import React from 'react';

const Cart = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-6 shadow-md rounded md:w-3/4">
          <h1 className="text-3xl font-bold mb-4 border-b pb-4">Shopping Cart</h1>
          <p className="text-gray-500 py-10 text-center text-lg">Your Amazon Cart is empty.</p>
        </div>
        
        <div className="bg-white p-6 shadow-md rounded md:w-1/4 h-fit sticky top-28">
           <h2 className="text-xl mb-4">
             Subtotal (0 items): <span className="font-bold whitespace-nowrap">$0.00</span>
           </h2>
           <button className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-md font-semibold shadow-md">
             Proceed to Checkout
           </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
