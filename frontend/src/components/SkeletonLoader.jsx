import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="bg-white/50 backdrop-blur-md p-6 shadow-sm rounded-2xl z-30 flex flex-col h-[480px] border border-white/50 relative overflow-hidden">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" 
           style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }}>
      </div>

      {/* Image Skeleton */}
      <div className="bg-slate-200/60 rounded-xl h-48 w-full mb-6"></div>
      
      {/* Title Skeletons */}
      <div className="bg-slate-200/60 h-5 w-[85%] mb-3 rounded-md"></div>
      <div className="bg-slate-200/60 h-5 w-[60%] mb-5 rounded-md"></div>
      
      {/* Rating & Price Skeletons */}
      <div className="bg-slate-200/60 h-4 w-[40%] mb-4 rounded-md"></div>
      <div className="bg-slate-200/60 h-8 w-[35%] mb-4 rounded-md"></div>
      
      {/* Button Skeleton */}
      <div className="bg-slate-200/60 h-12 w-full mt-auto rounded-xl"></div>
    </div>
  );
};

export default SkeletonLoader;
