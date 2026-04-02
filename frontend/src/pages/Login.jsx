import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/userSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    
    if (!email.includes('@')) {
      return toast.error('Please enter a valid email address');
    }

    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setStep(2);
      setTimer(30);
      
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success(data.message || 'OTP dispatched!', {
        iconTheme: { primary: '#713200', secondary: '#FFFAEE' },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification relay failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return toast.error('Provide the 6-digit access code');

    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      
      if (data.success) {
        dispatch(setCredentials({ ...data.user, token: data.token }));
        toast.success('Successfully Authenticated');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired entry');
      if (error.response?.status === 429) setStep(1); // Reset if attempts maxed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <Link to="/" className="mb-6">
        <h1 className="text-4xl font-bold font-serif tracking-tighter">amazon</h1>
      </Link>
      
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
        {step === 1 ? (
          <>
            <h2 className="text-3xl font-medium mb-6">Sign in</h2>
            
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div>
                <label className="font-medium text-sm block mb-1">
                  Email address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 outline-none transition-all" 
                  placeholder="user@example.com"
                  required 
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#f0c14b] border border-[#a88734] py-2 rounded-lg shadow-sm hover:bg-[#e4b33a] font-medium active:bg-[#d6a52c] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Sending...' : 'Continue with OTP'}
              </button>
            </form>
            
            <div className="text-xs text-black mt-4 font-normal">
              By continuing, you agree to Amazon's <a href="#" className="text-blue-600 hover:underline hover:text-orange-600">Conditions of Use</a> and <a href="#" className="text-blue-600 hover:underline hover:text-orange-600">Privacy Notice</a>.
            </div>
          </>
        ) : (
          <>
             <h2 className="text-3xl font-medium mb-2">Verify OTP</h2>
             <p className="text-sm text-gray-600 mb-4">
               Access code dispatched to <span className="font-bold text-gray-800">{email}</span>. 
               <button onClick={() => setStep(1)} className="text-blue-600 ml-1 hover:underline">Change</button>
             </p>
             <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
               <div>
                 <label className="font-medium text-sm block mb-1">Enter 6-digit Code</label>
                 <input 
                   type="text" 
                   maxLength="6"
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 outline-none text-center tracking-widest text-lg font-bold transition-all" 
                   placeholder="------"
                   required 
                   disabled={loading}
                 />
               </div>
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full flex items-center justify-center gap-2 bg-[#f0c14b] border border-[#a88734] py-2 rounded-lg shadow-sm hover:bg-[#e4b33a] font-medium active:bg-[#d6a52c] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
               >
                 {loading && (
                   <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                 )}
                 {loading ? 'Verifying...' : 'Sign in'}
               </button>
             </form>

             <div className="mt-4 text-center">
               <button 
                 onClick={handleSendOtp} 
                 disabled={timer > 0 || loading}
                 className={`text-sm font-medium transition-colors ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-orange-600 hover:underline'}`}
               >
                 {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
               </button>
             </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 w-full max-w-sm mt-8 mb-4">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="text-xs text-gray-500 font-medium">New to Amazon?</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>
      
      <button className="w-full max-w-sm border border-gray-400 py-2 rounded-lg shadow-sm bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors">
        Create your Amazon account
      </button>
    </div>
  );
};

export default Login;
