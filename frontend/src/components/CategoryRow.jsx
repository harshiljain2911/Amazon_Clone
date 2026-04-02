import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';
import { Link } from 'react-router-dom';

const CategoryRow = ({ title, icon, products = [], loading = false, categoryKey }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (!loading && products.length === 0) return null;

  return (
    /* White Amazon-style section box over grey page */
    <div className="bg-white border border-[#dddddd] rounded-sm p-4 mb-5">

      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl leading-none">{icon}</span>}
          <h2 className="text-lg font-bold text-[#0f1111] tracking-tight">{title}</h2>
        </div>
        <Link
          to={`/?category=${categoryKey}`}
          className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-0.5 transition-colors"
        >
          See all <ChevronRight size={14} />
        </Link>
      </div>

      {/* Scroll row */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-0 bottom-0 z-10 bg-white/95 hover:bg-white
                     border border-[#ddd] shadow-sm
                     w-9 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     rounded-l-sm -ml-4"
        >
          <ChevronLeft size={20} className="text-[#0f1111]" />
        </button>

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar"
        >
          {loading
            ? Array(6).fill(null).map((_, i) => (
                <div key={i} className="flex-none w-44">
                  <SkeletonLoader />
                </div>
              ))
            : products.map((product) => (
                <div key={product._id} className="flex-none w-44">
                  <ProductCard product={product} />
                </div>
              ))
          }
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-0 bottom-0 z-10 bg-white/95 hover:bg-white
                     border border-[#ddd] shadow-sm
                     w-9 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     rounded-r-sm -mr-4"
        >
          <ChevronRight size={20} className="text-[#0f1111]" />
        </button>
      </div>
    </div>
  );
};

export default CategoryRow;
