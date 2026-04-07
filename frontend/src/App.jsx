import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './slices/cartSlice';
import { fetchWishlist } from './slices/wishlistSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import NetworkStatus from './components/NetworkStatus';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';

// Admin imports
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';

// Page transition wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
        <Route path="/order-success" element={<PageWrapper><OrderSuccess /></PageWrapper>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="products" element={<PageWrapper><ProductList /></PageWrapper>} />
            <Route path="products/create" element={<PageWrapper><ProductEdit /></PageWrapper>} />
            <Route path="products/:id/edit" element={<PageWrapper><ProductEdit /></PageWrapper>} />
            <Route path="orders" element={<PageWrapper><OrderList /></PageWrapper>} />
            <Route path="users" element={<PageWrapper><UserList /></PageWrapper>} />
          </Route>
        </Route>
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

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen relative">
      <NetworkStatus />
      <CartDrawer />
      <QuickViewModal />
      
      {!isAdmin && <Header />}
      
      <main className={`flex-grow ${!isAdmin ? 'pb-10' : ''}`}>
        <AnimatedRoutes />
      </main>
      
      {!isAdmin && <Footer />}

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
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, userInfo]);

  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
