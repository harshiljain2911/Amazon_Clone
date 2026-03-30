import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <Link to="/" className="mb-6">
        <h1 className="text-4xl font-bold font-serif tracking-tighter">amazon</h1>
      </Link>
      
      <div className="w-full max-w-sm border border-gray-300 rounded p-6 shadow-sm">
        <h2 className="text-3xl font-medium mb-4">Sign in</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label className="font-medium text-sm block mb-1">Email or mobile phone number</label>
            <input type="email" className="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" required />
          </div>
          <button type="submit" className="w-full bg-[#f0c14b] border border-gray-400 py-2 rounded shadow-sm hover:bg-[#e4b33a] font-medium active:bg-[#d6a52c]">
            Continue
          </button>
        </form>
        
        <div className="text-xs text-black mt-4 font-normal">
          By continuing, you agree to Amazon's <a href="#" className="text-blue-600 hover:underline hover:text-orange-600">Conditions of Use</a> and <a href="#" className="text-blue-600 hover:underline hover:text-orange-600">Privacy Notice</a>.
        </div>

        <div className="mt-6">
          <button className="w-full py-2 border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 font-medium">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Sign in with Google
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full max-w-sm mt-6 mb-4">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="text-xs text-gray-500 font-medium">New to Amazon?</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>
      
      <button className="w-full max-w-sm border border-gray-400 py-2 rounded shadow-sm bg-gray-100 hover:bg-gray-200 text-sm">
        Create your Amazon account
      </button>
    </div>
  );
};

export default Login;
