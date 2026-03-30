import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593642702821-c823b13eb2a5?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2069&auto=format&fit=crop"
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 shadow-inner" style={{ minWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      <div className="relative h-[300px] sm:h-[350px] lg:h-[450px] w-full flex flex-col justify-center items-center text-center px-4 md:px-12 pt-8">
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={images[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-full h-full object-cover top-0 left-0 -z-10 object-center"
          />
        </AnimatePresence>
        
        {/* Dark vignette overlay for perfect text contrast on all sides */}
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
        
        {/* Promotional Text Overlay - Centered! */}
        <div className="relative z-20 max-w-3xl flex flex-col items-center">
           <motion.h1 
             className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight drop-shadow-lg tracking-tight text-white"
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           >
             Prime Exclusive Deals
           </motion.h1>
           <motion.p 
             className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 font-medium text-gray-100 drop-shadow-md px-4"
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.4 }}
           >
             Shop massive discounts on top electronics, home goods, and daily essentials.
           </motion.p>
           
           <motion.button 
             className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-500 hover:shadow-yellow-400/30 transition-all shadow-xl active:scale-95 text-lg cursor-pointer transform hover:-translate-y-0.5"
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.6 }}
           >
             Shop Now
           </motion.button>
        </div>

        {/* Bottom smooth gradient divider separating hero from products */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-100 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default HeroCarousel;
