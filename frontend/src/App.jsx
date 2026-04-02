import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import NetworkStatus from './components/NetworkStatus';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';

// Page transition wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        <NetworkStatus />
        <Toaster position="bottom-right" toastOptions={{
           duration: 3000,
           style: {
             background: '#333',
             color: '#fff',
             padding: '16px',
             borderRadius: '8px',
             fontWeight: '500'
           }
        }} />
        <CartDrawer />
        <QuickViewModal />
        
        <Header />
        <main className="flex-grow pb-10">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
