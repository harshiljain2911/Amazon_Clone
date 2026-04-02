import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleCartDrawer } from '../slices/uiSlice';
import { selectCartTotals, addToCartDB } from '../slices/cartSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.isCartDrawerOpen);
  const { userInfo } = useSelector((state) => state.user);
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
    const item = cartItems.find(x => x._id === id);
    if (!item) return;

    const newQty = currentQty + amount;
    if (newQty < 1) {
      dispatch(addToCartDB({ item, qty: 0 }));
      return;
    }
    dispatch(addToCartDB({ item, qty: newQty }));
  };

  const handleRemoveItem = (id) => {
    const item = cartItems.find(x => x._id === id);
    if (item) {
      dispatch(addToCartDB({ item, qty: 0 }));
    }
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
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <ShoppingBag size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Amazon Cart is empty</h3>
                  <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added anything yet.</p>
                  
                  <div className="flex flex-col w-full gap-3">
                    <button 
                      onClick={() => {
                        handleClose();
                        navigate("/");
                      }}
                      className="w-full bg-[#f0c14b] hover:bg-yellow-500 text-black font-semibold py-2.5 px-4 rounded transition-colors shadow-sm border-none cursor-pointer text-sm"
                    >
                      Continue Shopping
                    </button>
                    
                    {!userInfo && (
                      <button 
                        onClick={() => {
                          handleClose();
                          navigate("/login");
                        }}
                        className="w-full bg-white text-blue-600 border border-gray-200 px-4 py-2.5 rounded font-semibold hover:bg-gray-50 transition-colors shadow-sm text-sm"
                      >
                        Login to see saved items
                      </button>
                    )}
                  </div>
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
