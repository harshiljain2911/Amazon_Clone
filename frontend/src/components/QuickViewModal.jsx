import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { closeQuickView } from '../slices/uiSlice';
import { addToCartDB } from '../slices/cartSlice';
import { toggleWishlistDB } from '../slices/wishlistSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { splitPrice } from '../utils/formatters';

const QuickViewModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { isQuickViewOpen, quickViewProduct: product } = useSelector((state) => state.ui);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = product ? wishlistItems?.some((item) => item._id === product._id) : false;

  const handleClose = () => {
    dispatch(closeQuickView());
  };

  const handleAddToCart = () => {
    if (product) {
      if (!userInfo) {
        toast.error('Sign in to add items to your cart');
        handleClose();
        return navigate('/login');
      }
      
      dispatch(addToCartDB({ item: product, qty: 1 }));
      toast.success(`${product.name.split(' ').slice(0,3).join(' ')} added to remote cart!`);
      handleClose();
    }
  };

  const handleWishlist = () => {
    if (product) {
       if (!userInfo) {
        toast.error('Sign in to manage your wishlist');
        handleClose();
        return navigate('/login');
      }

      dispatch(toggleWishlistDB(product));
      toast(isWishlisted ? 'Removed from remote Wishlist' : 'Added to remote Wishlist', { icon: isWishlisted ? '💔' : '❤️' });
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors shadow"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Image Column */}
            <div className="w-full md:w-1/2 p-8 bg-gray-50 flex items-center justify-center relative group">
              <div className="relative w-full h-64 md:h-96">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              <button 
                onClick={handleWishlist}
                className="absolute top-4 left-4 p-3 bg-white rounded-full shadow-md hover:scale-110 transition-transform active:bg-gray-100"
              >
                <Heart 
                  size={24} 
                  className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                />
              </button>
            </div>

            {/* Details Column */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 block">
                  {product.category || 'Product'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {product.name}
                </h2>
                
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex">
                    {Array(5).fill().map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-blue-500 hover:text-orange-600 hover:underline cursor-pointer text-sm font-medium">
                    {product.numReviews} ratings
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black text-gray-900 block mb-2">
                    <span className="text-2xl font-medium relative -top-2 mr-1">₹</span>
                    {splitPrice(product.price).int}
                    <span className="text-lg font-medium relative -top-2 ml-1">
                      {splitPrice(product.price).dec}
                    </span>
                  </span>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {product.description || 'Experience premium quality with this top-rated product. Crafted meticulously to deliver the best value and performance.'}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 active:scale-95 text-black py-4 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:shadow-[0_8px_25px_rgba(250,204,21,0.25)] hover:-translate-y-0.5 transition-all duration-300 text-lg flex items-center justify-center gap-2 border border-yellow-500/50"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button 
                  onClick={handleClose}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 py-3.5 rounded-xl font-bold transition-all text-base hover:shadow-sm"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
