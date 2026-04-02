import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleCartDrawer } from '../slices/uiSlice';
import { selectCartTotals, removeFromCart, updateQuantity } from '../slices/cartSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isCartDrawerOpen);
  const { cartItems } = useSelector((state) => state.cart);
  const { itemsCount, totalPrice } = useSelector(selectCartTotals);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleClose = () => {
    dispatch(toggleCartDrawer(false));
  };

  const handleUpdateQuantity = (id, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) {
      dispatch(removeFromCart(id));
      return;
    }
    dispatch(updateQuantity({ id, qty: newQty }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black z-[100] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Your Cart
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {itemsCount}
                </span>
              </h2>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="mb-4 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </div>
                  <p className="text-lg font-medium">Your Amazon Cart is empty</p>
                  <Link 
                    to="/" 
                    onClick={handleClose}
                    className="mt-4 text-blue-600 hover:text-orange-500 hover:underline"
                  >
                    Shop today's deals
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item._id} 
                    className="flex gap-4 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain p-1 bg-white rounded flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link 
                          to={`/product/${item._id}`} 
                          onClick={handleClose}
                          className="font-medium text-sm line-clamp-2 hover:text-orange-600 text-gray-800"
                        >
                          {item.name}
                        </Link>
                        <div className="font-bold text-lg mt-1">${item.price.toFixed(2)}</div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-md shadow-sm h-8 bg-gray-50 overflow-hidden">
                          <button 
                            className="px-2 h-full hover:bg-gray-200 text-gray-600 active:bg-gray-300 transition-colors"
                            onClick={() => handleUpdateQuantity(item._id, item.qty, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 font-semibold text-sm bg-white border-x h-full flex items-center justify-center min-w-[36px]">
                            {item.qty}
                          </span>
                          <button 
                            className="px-2 h-full hover:bg-gray-200 text-gray-600 active:bg-gray-300 transition-colors"
                            onClick={() => handleUpdateQuantity(item._id, item.qty, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-2xl font-bold">${totalPrice}</span>
                </div>
                <Link 
                   to="/cart"
                   onClick={handleClose}
                   className="w-full block text-center bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-lg font-bold shadow-sm transition-all mb-3 border border-blue-200"
                >
                  View Full Cart
                </Link>
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-black py-3 rounded-lg font-bold shadow-md transition-all">
                  Proceed to Checkout ({itemsCount} items)
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
