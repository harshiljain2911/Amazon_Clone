import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, CreditCard, ShoppingBag, ChevronRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { clearCartDB, clearCart } from '../slices/cartSlice';
import { formatPrice } from '../utils/formatters';
import { 
  createOrderAPI, 
  loadRazorpayScript, 
  getRazorpayConfig, 
  createRazorpayOrderAPI, 
  verifyRazorpayPaymentAPI 
} from '../services/api';

const STEPS = ['Cart', 'Address', 'Payment', 'Confirm'];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  
  const [isProcessing, setIsProcessing] = useState(false);

  const [step, setStep] = useState(1); // 1=Address, 2=Payment, 3=Confirm
  const [address, setAddress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedAddress') || '{}'); } catch { return {}; }
  });
  const [payment, setPayment] = useState('cod');

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleAddressSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    setAddress(data);
    localStorage.setItem('savedAddress', JSON.stringify(data));
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // 1. Create DB Order first securely
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item._id || item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.mobile,
          addressLine: address.addressLine,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: 'India'
        },
        paymentMethod: payment === 'cod' ? 'COD' : 'Razorpay' 
      };

      const backendOrder = await createOrderAPI(orderPayload);
      
      // 2. COD flow
      if (payment === 'cod') {
        dispatch(clearCartDB());
        dispatch(clearCart());
        navigate('/order-success', { state: { orderId: backendOrder.orderId, total: backendOrder.order.totalAmount } });
        toast.success('Order placed successfully!');
        setIsProcessing(false);
        return;
      }

      // 3. Razorpay Flow
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Check your connection.');
        setIsProcessing(false);
        return;
      }

      const keyId = await getRazorpayConfig();
      const rzpOrder = await createRazorpayOrderAPI(backendOrder.totalAmount, backendOrder._id);

      const options = {
        key: keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'Amazon Clone',
        description: 'Order Payment',
        order_id: rzpOrder.id,
        prefill: {
          name: userInfo?.name,
          email: userInfo?.email,
          contact: address.mobile || '9999999999'
        },
        handler: async function (response) {
          try {
            await verifyRazorpayPaymentAPI({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              mongoOrderId: backendOrder._id
            });
            
            dispatch(clearCartDB());
            dispatch(clearCart());
            navigate('/order-success', { state: { orderId: backendOrder.orderId, total: backendOrder.order.totalAmount } });
            toast.success('Payment verified! Order completed.');
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        theme: { color: '#232f3e' }
      };

      const paymentObject = new window.Razorpay(options);
      
      // Handle when user closes the popup
      paymentObject.on('payment.failed', function () {
        toast.error('Payment failed. Please try again.');
      });

      paymentObject.open();

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to continue</h2>
        <button onClick={() => navigate('/login')} className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full">Sign In</button>
      </div>
    );
  }

  if (cartItems.length === 0 && step < 3) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-5xl">

        {/* ── Progress Bar ── */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {STEPS.map((s, i) => {
            const idx = i; // 0=Cart,1=Address,2=Payment,3=Confirm
            const done = (idx === 0) || (idx < step);
            const active = idx === step;
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                    ${done ? 'bg-green-500 text-white' : active ? 'bg-slate-900 text-white ring-4 ring-slate-900/20' : 'bg-gray-200 text-gray-500'}`}>
                    {done ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${active ? 'text-slate-900' : done ? 'text-green-600' : 'text-gray-400'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-[2px] w-16 sm:w-24 mx-1 mb-4 rounded transition-all ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Panel ── */}
          <div className="flex-1">

            {/* STEP 1 — Address */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin size={20} className="text-orange-500" /> Delivery Address</h2>
                <form onSubmit={handleAddressSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'fullName',  label: 'Full Name',     placeholder: 'Harshil Jain',    full: true },
                    { name: 'mobile',    label: 'Mobile Number', placeholder: '+91 9876543210',  type: 'tel' },
                    { name: 'pincode',   label: 'Pincode',       placeholder: '302001',          type: 'text' },
                    { name: 'city',      label: 'City',          placeholder: 'Jaipur' },
                    { name: 'state',     label: 'State',         placeholder: 'Rajasthan' },
                    { name: 'addressLine',   label: 'Address Line',  placeholder: '123, MG Road', full: true, textarea: true },
                  ].map((f) => (
                    <div key={f.name} className={f.full ? 'col-span-full' : ''}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                      {f.textarea
                        ? <textarea name={f.name} defaultValue={address[f.name] || ''} placeholder={f.placeholder} required rows={2}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
                        : <input name={f.name} type={f.type || 'text'} defaultValue={address[f.name] || ''} placeholder={f.placeholder} required
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                      }
                    </div>
                  ))}
                  <div className="col-span-full mt-2">
                    <button type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                      Continue to Payment <ChevronRight size={18} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard size={20} className="text-orange-500" /> Payment Method</h2>

                <div className="space-y-3">
                  {[
                    { id: 'cod',  label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                    { id: 'upi',  label: 'UPI / GPay',       desc: 'PhonePe, Paytm, Google Pay', icon: '📱' },
                    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay',  icon: '💳' },
                  ].map((opt) => (
                    <label key={opt.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${payment === opt.id ? 'border-slate-900 bg-slate-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={opt.id} checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)} className="accent-slate-900 w-4 h-4" />
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Card UI (decorative when selected) */}
                {payment === 'card' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="col-span-full">
                      <input placeholder="Card Number" maxLength={19} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    </div>
                    <input placeholder="MM / YY" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    <input placeholder="CVV" type="password" maxLength={3} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                    <input placeholder="Name on Card" className="col-span-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                  </motion.div>
                )}

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="flex-none px-5 py-3 rounded-xl border-2 border-gray-200 font-semibold hover:border-gray-300 text-sm transition-all" disabled={isProcessing}>← Back</button>
                  <button onClick={handlePlaceOrder} disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    Place Order — {formatPrice(total)}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Confirmation */}
            {step === 3 && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={44} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
                <p className="text-gray-500 mb-2">Thank you, <span className="font-semibold text-gray-800">{userInfo?.name || userInfo?.email}</span>!</p>
                <p className="text-gray-500 mb-8 text-sm">Your order will be delivered to <strong>{address.city}</strong> within 3–5 business days.</p>
                <div className="text-left bg-gray-50 rounded-xl p-4 mb-8 text-sm space-y-1">
                  <div><span className="text-gray-500">Payment:</span> <span className="font-semibold capitalize">{payment === 'cod' ? 'Cash on Delivery' : payment.toUpperCase()}</span></div>
                  <div><span className="text-gray-500">Address:</span> <span className="font-semibold">{address.addressLine}, {address.city} — {address.pincode}</span></div>
                  <div><span className="text-gray-500">Total:</span> <span className="font-bold text-lg">{formatPrice(total)}</span></div>
                </div>
                <button onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold px-10 py-3.5 rounded-full shadow-md transition-all active:scale-95">
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </div>

          {/* ── Right Panel — Order Summary ── */}
          {step < 3 && (
            <div className="lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                <h3 className="font-bold text-lg mb-4 border-b pb-3">Order Summary</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 flex-none" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm font-bold">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Items ({count})</span><span>{formatPrice(total)}</span></div>
                  <div className="flex justify-between text-green-600 font-medium"><span>Delivery</span><span>FREE</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
