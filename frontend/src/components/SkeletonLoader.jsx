import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="bg-white p-5 shadow-sm rounded-sm z-30 flex flex-col h-[400px]">
      <div className="bg-gray-200 animate-pulse h-48 w-full mb-4 rounded"></div>
      
      <div className="bg-gray-200 animate-pulse h-6 w-3/4 mb-2 rounded"></div>
      <div className="bg-gray-200 animate-pulse h-6 w-1/2 mb-4 rounded"></div>
      
      <div className="bg-gray-200 animate-pulse h-4 w-1/4 mb-4 rounded"></div>
      <div className="bg-gray-200 animate-pulse h-8 w-1/3 mb-4 rounded"></div>
      
      <div className="bg-gray-200 animate-pulse h-10 w-full rounded-full mt-auto"></div>
    </div>
  );
};

export default SkeletonLoader;
