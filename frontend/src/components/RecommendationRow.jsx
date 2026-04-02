import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';

const RecommendationRow = ({ title, products = [], loading = false }) => {
  if (!loading && products.length === 0) return null;

  return (
    <div className="my-10">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-2xl font-bold font-serif text-gray-800">{title}</h2>
        <a href="#" className="text-sm font-semibold text-blue-600 hover:text-orange-500 hover:underline">
          See more
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill().map((_, i) => <SkeletonLoader key={i} />)
        ) : (
          products.map((product, i) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendationRow;
