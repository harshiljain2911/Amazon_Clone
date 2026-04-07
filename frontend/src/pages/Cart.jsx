import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { selectCartTotals, addToCartDB } from '../slices/cartSlice';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const { itemsCount, totalPrice } = useSelector(selectCartTotals);

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

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart flex justify-center items-center h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="empty-cart-content text-center bg-white p-10 rounded-2xl shadow-sm border flex flex-col items-center max-w-lg w-full relative z-10"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <ShoppingBag size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Amazon Cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added anything yet.</p>
          
          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => navigate("/")}
              className="w-full bg-[#f0c14b] hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded transition-colors shadow-sm border-none cursor-pointer"
            >
              Continue Shopping
            </button>
            
            {!userInfo && (
              <button 
                onClick={() => navigate("/login")}
                className="w-full bg-white text-blue-600 border border-gray-200 px-6 py-3 rounded font-semibold hover:bg-gray-50 transition-colors shadow-sm"
              >
                Login to see saved items
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items List */}
        <div className="lg:w-3/4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold font-serif text-gray-900 tracking-tight">Shopping Cart</h1>
              <span className="text-gray-500 hidden sm:block">Price</span>
            </div>

            <div className="flex flex-col gap-6">
              {cartItems.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-50 p-2 flex items-center justify-center">
                    <Link to={`/product/${item._id}`}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300" />
                    </Link>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                     <div className="flex justify-between gap-4">
                        <Link to={`/product/${item._id}`} className="text-lg font-medium text-gray-900 leading-snug hover:text-orange-600 line-clamp-2 md:line-clamp-none">
                          {item.name}
                        </Link>
                        <span className="font-bold text-xl block sm:hidden">{formatPrice(item.price)}</span>
                     </div>
                     
                     <div className="mt-2 text-sm text-green-600 font-medium">In Stock</div>
                     <div className="mt-1 flex items-center gap-4 text-xs">
                        <span className="text-gray-500">Shipped from Amazon</span>
                        <div className="flex items-center gap-1 text-gray-500">
                           <input type="checkbox" className="rounded border-gray-300" />
                           This is a gift
                        </div>
                     </div>

                     <div className="mt-auto pt-4 flex items-center gap-4 sm:gap-6 flex-wrap">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm h-10">
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.qty, -1)}
                            className="px-3 h-full hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-600 flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-bold text-gray-800 bg-white h-full flex items-center justify-center border-x border-gray-200">
                            {item.qty}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.qty, 1)}
                            className="px-3 h-full hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-600 flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-sm text-blue-600 hover:text-red-500 hover:underline flex items-center gap-1 font-medium transition-colors"
                        >
                           <Trash2 size={16} className="hidden sm:inline-block"/> Delete
                        </button>
                        
                        <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                        
                        <button className="text-sm text-blue-600 hover:text-orange-500 hover:underline font-medium">
                           Save for later
                        </button>
                     </div>
                  </div>
                  
                  <div className="hidden sm:block text-right">
                     <span className="font-bold text-xl">{formatPrice(item.price)}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t font-semibold text-right text-lg">
              Subtotal ({itemsCount} items): <span className="font-bold text-2xl">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
        
        {/* Checkout Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
             <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                   <span className="text-sm text-green-600 font-medium">Your order qualifies for FREE Shipping.</span>
                </div>
                <span className="text-xs text-gray-500">Choose this option at checkout. See details</span>
             </div>
             
             <h2 className="text-xl leading-tight mb-5">
               Subtotal ({itemsCount} items): <br/>
               <span className="font-bold text-2xl mt-1 block">{formatPrice(totalPrice)}</span>
             </h2>

             <div className="flex items-center gap-2 mb-6">
                <input type="checkbox" id="gift" className="rounded" />
                <label htmlFor="gift" className="text-sm cursor-pointer">This order contains a gift</label>
             </div>

             <Link
                to="/checkout"
                className="w-full block text-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 active:scale-95 text-black py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-500/50"
              >
                Proceed to Checkout
              </Link>

             <div className="border border-gray-200 bg-gray-50 rounded-lg p-3 cursor-pointer group mt-4 hover:border-gray-300 transition-colors">
                 <div className="flex items-center gap-2 font-bold mb-1 text-sm group-hover:text-blue-600">
                    <span className="text-blue-500 font-serif font-black uppercase text-xs border border-blue-500 rounded px-1">emi</span>
                    EMI Available
                 </div>
                 <div className="text-xs text-gray-600">Your order qualifies for EMI with valid credit cards.</div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Space for extra filler / padding */}
      <div className="h-10"></div>
    </div>
  );
};

export default Cart;
