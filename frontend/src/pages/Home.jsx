import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Slight delay to showcase the new skeletons
    setTimeout(() => {
      fetchProducts();
    }, 500);
  }, []);

  return (
    <div className="relative bg-gray-100 min-h-screen pb-10">
      <HeroCarousel />

      <div className="container mx-auto px-4 z-20 relative pt-8">
        <div className="mb-6 flex items-center justify-between border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Top Deals Recommended for You</h2>
          <a href="#" className="hidden text-sm text-blue-600 hover:text-orange-500 hover:underline md:block font-medium">See more deals</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(8).fill().map((_, i) => <SkeletonLoader key={i} />)
          ) : (
            products.map((product, i) => (
              <motion.div 
                key={product._id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
