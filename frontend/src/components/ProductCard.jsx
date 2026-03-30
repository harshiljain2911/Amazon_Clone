import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg z-30 flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-center h-52 mb-6 overflow-hidden">
        <img src={product.image} alt={product.name} className="max-w-full h-full object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.1]" />
      </div>

      <div className="flex flex-col flex-1 pb-2">
        <h3 className="text-xl font-bold hover:text-orange-500 cursor-pointer line-clamp-2 leading-tight text-gray-900 mb-2">{product.name}</h3>
        
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex">
            {Array(5).fill().map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-blue-500 hover:text-orange-600 hover:underline cursor-pointer text-sm font-medium ml-1">{product.numReviews}</span>
        </div>

        <div className="text-3xl font-black mb-5 flex items-start text-gray-900">
           <span className="text-base font-medium mt-1 mr-0.5">$</span>
           <span>{Math.floor(product.price)}</span>
           <span className="text-base font-medium mt-1">{((product.price % 1)*100).toFixed(0).padStart(2, '0')}</span>
        </div>
        
        <div className="mt-auto">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black w-full py-3 h-12 rounded-full font-bold shadow-sm active:scale-95 transition-all text-sm border border-yellow-500">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
