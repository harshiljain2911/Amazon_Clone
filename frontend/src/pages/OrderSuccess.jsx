import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Home } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};

  // If no orderId, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      
      {/* ── CSS Confetti Effect ── */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: '-10%', 
              left: `${Math.random() * 100}%`, 
              rotate: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              top: '110%', 
              rotate: 360,
              left: `${(Math.random() * 20 - 10) + (i * 5)}%` 
            }}
            transition={{ 
              duration: Math.random() * 2 + 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{ 
              backgroundColor: ['#febd69', '#232f3e', '#ffd814', '#007185', '#c7511f'][i % 5] 
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 text-center relative z-10"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={56} className="text-green-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Order Confirmed! 🎉</h1>
        <p className="text-lg text-gray-600 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Order ID</span>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-sm">{orderId}</span>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-500 font-medium">Estimated Delivery</span>
            <span className="font-bold text-orange-600">Never 😄 (Demo Mode)</span>
          </div>

          {total && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Amount Paid</span>
              <span className="font-bold text-xl text-gray-900">{formatPrice(total)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/orders" 
            className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Package size={20} /> View Orders
          </Link>
          <Link 
            to="/" 
            className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-[#FCD200]"
          >
            <Home size={20} /> Home Page
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-400 font-medium italic">
          "This is a demo project. No actual products will be delivered. But hey, the UI looks great, right?"
        </p>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
