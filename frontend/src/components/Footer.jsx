import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-amazon text-white mt-10">
      <div className="hover:bg-amazon-light text-center py-4 cursor-pointer text-sm" onClick={() => window.scrollTo(0,0)}>
        Back to top
      </div>
      <div className="bg-amazon-light py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="font-bold mb-4">Get to Know Us</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>Careers</li>
              <li>About Us</li>
              <li>Press Releases</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Make Money with Us</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>Sell products</li>
              <li>Become an Affiliate</li>
              <li>Advertise Your Products</li>
            </ul>
          </div>
          <div>
             <h3 className="font-bold mb-4">Let Us Help You</h3>
             <ul className="text-sm space-y-2 text-gray-300">
               <li>Your Account</li>
               <li>Your Orders</li>
               <li>Help</li>
             </ul>
          </div>
        </div>
      </div>
      <div className="text-center py-6 text-xs text-gray-300 border-t border-gray-600">
        &copy; {new Date().getFullYear()}, amazon_clone.com
      </div>
    </footer>
  );
};

export default Footer;
