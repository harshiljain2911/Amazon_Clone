import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Orders = () => {
  const { userInfo } = useSelector((state) => state.user);
  const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to see your orders</h2>
        <Link to="/login" className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-all">Sign In</Link>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
        <Link to="/" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-all">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Your Orders</h1>

        <div className="space-y-6">
          {history.map((order, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 px-5 py-3 border-b border-gray-100">
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div className="font-semibold text-gray-700 text-sm">Order #{String(history.length - idx).padStart(4, '0')}</div>
                  <div>{new Date(order.placedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div className="text-gray-500">Total</div>
                  <div className="font-bold text-gray-900 text-base">${order.total}</div>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div className="text-gray-500">Payment</div>
                  <div className="font-semibold capitalize">{order.payment === 'cod' ? 'Cash on Delivery' : order.payment.toUpperCase()}</div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  ✓ Placed
                </span>
              </div>

              {/* Items */}
              <div className="px-5 py-4 space-y-3">
                {order.cartItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-lg bg-gray-50 p-1 flex-none border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty} · ${item.price}/ea</p>
                    </div>
                    <span className="font-bold text-sm">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Address */}
              {order.address?.city && (
                <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                  <Package size={14} />
                  Delivering to <strong>{order.address.fullName}</strong> — {order.address.address}, {order.address.city} {order.address.pincode}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
