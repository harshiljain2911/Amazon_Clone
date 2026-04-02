import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { toggleWishlistDB } from '../slices/wishlistSlice';
import { addToCartDB } from '../slices/cartSlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white p-10 rounded-2xl shadow-sm border text-center flex flex-col items-center max-w-lg w-full">
          <Heart fill="#d1d5db" size={64} className="text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Sign in to see your Wishlist</h1>
          <p className="text-gray-500 mb-8 max-w-xs">Save the items you love and buy them whenever you're ready.</p>
          <Link to="/login" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-colors shadow-sm inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = (product) => {
    dispatch(toggleWishlistDB(product));
    toast('Removed from Wishlist', { icon: '💔' });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCartDB({ item: product, qty: 1 }));
    toast.success(`${product.name.split(' ').slice(0,3).join(' ')} added to remote cart!`);
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-2xl shadow-sm border text-center flex flex-col items-center max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <Heart size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is empty</h1>
          <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't saved any items yet. Explore our catalog.</p>
          <Link to="/" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-colors shadow-sm inline-block">
            Start Exploring
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
       <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
         <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
           <h1 className="text-3xl font-bold font-serif text-gray-900 tracking-tight flex items-center gap-3">
             <Heart className="fill-red-500 text-red-500" size={32} />
             Your Wishlist
           </h1>
           <span className="text-gray-500">{wishlistItems.length} items</span>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {wishlistItems.map((item, index) => (
             <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.05 }}
               key={item._id}
               className="flex flex-col border border-gray-100 hover:border-blue-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group relative bg-white"
             >
               <button 
                 onClick={() => handleRemove(item)}
                 className="absolute top-3 right-3 z-10 p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full shadow-sm transition-colors"
                 title="Remove from wishlist"
               >
                 <Trash2 size={16} />
               </button>

               <div className="h-48 w-full cursor-pointer flex items-center justify-center p-2 mb-4 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                 <Link to={`/product/${item._id}`}>
                   <img src={item.image} alt={item.name} className="max-w-full max-h-40 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                 </Link>
               </div>
               
               <div className="flex flex-col flex-1">
                 <Link to={`/product/${item._id}`} className="font-bold text-gray-800 leading-snug hover:text-orange-600 line-clamp-2 mb-2">
                   {item.name}
                 </Link>
                 
                 <div className="text-2xl font-black text-gray-900 mb-4 mt-auto">
                   ${item.price.toFixed(2)}
                 </div>
                 
                 <button 
                   onClick={() => handleAddToCart(item)}
                   className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-lg font-bold shadow-sm hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                 >
                   <ShoppingCart size={16} /> Move to Cart
                 </button>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
    </div>
  );
};

export default Wishlist;
