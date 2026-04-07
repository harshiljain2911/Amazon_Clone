import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import techHero from '../assets/hero.png';

/* ─── Slide data ─────────────────────────────────────────────────────────────
   High-res lifestyle / product banner images from Unsplash
   (wide, warm-tone, editorial — closest to real Amazon.in banners)
──────────────────────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 0,
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=95&w=2400&auto=format&fit=crop',
    label: 'Great Indian Sale',
    title: 'Deals Made for You',
    sub:   'Save big across Home, Electronics & Fashion',
    cta:   'Shop the Sale',
    accent: '#febd69',
  },
  {
    id: 1,
    image:  techHero,
    label: 'Electronics',
    title: 'Next-Generation Tech',
    sub:   'Explore laptops, earbuds, cameras & more',
    cta:   'Explore Now',
    accent: '#febd69',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=95&w=2400&auto=format&fit=crop',
    label: 'Home & Kitchen',
    title: 'Upgrade Your Space',
    sub:   'Handpicked essentials for every home',
    cta:   'Shop Home',
    accent: '#febd69',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=95&w=2400&auto=format&fit=crop',
    label: 'Fashion',
    title: "India's Biggest Fashion",
    sub:   'Top brands. Fresh styles. Free delivery.',
    cta:   'Discover Fashion',
    accent: '#febd69',
  },
];

/* ─── Animation variants ──────────────────────────────────────────────────── */
const slideVariants = {
  enter: (dir) => ({
    x:       dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x:       0,
    opacity: 1,
    transition: {
      x:       { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
      opacity: { duration: 0.6,  ease: 'easeInOut' },
    },
  },
  exit: (dir) => ({
    x:       dir > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      x:       { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
      opacity: { duration: 0.4,  ease: 'easeIn' },
    },
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const labelVariants = {
  hidden: { opacity: 0, y: -10 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 },
  },
};

/* ─── Component ───────────────────────────────────────────────────────────── */
const HeroCarousel = () => {
  const [index,     setIndex]     = useState(0);
  const [direction, setDirection] = useState(1);   // +1 forward, -1 backward
  const [paused,    setPaused]    = useState(false);
  const [hovering,  setHovering]  = useState(false);
  const timerRef = useRef(null);

  /* ── preload next image ─────────────────────────────────────────────────── */
  useEffect(() => {
    const next = SLIDES[(index + 1) % SLIDES.length];
    const img  = new Image();
    img.src    = next.image;
  }, [index]);

  /* ── auto-advance ───────────────────────────────────────────────────────── */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
  }, []);

  useEffect(() => {
    if (!paused) startTimer();
    return () => clearInterval(timerRef.current);
  }, [paused, startTimer]);

  /* ── nav helpers ────────────────────────────────────────────────────────── */
  const goTo = (nextIndex, dir) => {
    setDirection(dir);
    setIndex(nextIndex);
    startTimer();
  };

  const prev = () => goTo((index - 1 + SLIDES.length) % SLIDES.length, -1);
  const next = () => goTo((index + 1) % SLIDES.length, +1);

  const slide = SLIDES[index];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ background: '#232f3e' }}
      onMouseEnter={() => { setPaused(true);  setHovering(true);  }}
      onMouseLeave={() => { setPaused(false); setHovering(false); }}
    >
      {/* ── Slide stack ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden w-full"
        style={{ minHeight: '400px', height: 'clamp(400px, 42vw, 500px)' }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Layer 1 — Background image with linear gradient overlay */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 6, ease: 'linear' }}
              style={{
                backgroundColor: '#232f3e', // Fallback color while loading
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), transparent), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '400px'
              }}
            />

            {/* Layer 2b — bottom fade into page #f3f3f3 */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: '90px',
                background: 'linear-gradient(to top, #f3f3f3 0%, transparent 100%)',
              }}
            />

            {/* Layer 3 — text content */}
            <div className="absolute inset-0 flex items-center px-10 sm:px-16 md:px-24 pb-6">
              <div className="flex flex-col gap-2 max-w-sm sm:max-w-md">
                {/* Eyebrow label */}
                <motion.span
                  key={`label-${slide.id}`}
                  variants={labelVariants}
                  initial="hidden"
                  animate="show"
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: slide.accent }}
                >
                  {slide.label}
                </motion.span>

                {/* Title */}
                <motion.h2
                  key={`title-${slide.id}`}
                  variants={textVariants}
                  initial="hidden"
                  animate="show"
                  className="text-white leading-tight font-bold tracking-tight"
                  style={{
                    fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)',
                    textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                    transitionDelay: '0.1s',
                  }}
                >
                  {slide.title}
                </motion.h2>

                {/* Sub-text */}
                <motion.p
                  key={`sub-${slide.id}`}
                  variants={textVariants}
                  initial="hidden"
                  animate="show"
                  className="text-sm text-white/85 leading-relaxed"
                  style={{
                    textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                    transitionDelay: '0.18s',
                  }}
                >
                  {slide.sub}
                </motion.p>

                {/* CTA button */}
                <motion.div
                  key={`cta-${slide.id}`}
                  variants={textVariants}
                  initial="hidden"
                  animate="show"
                  style={{ transitionDelay: '0.28s' }}
                >
                  <button
                    className="mt-1 inline-flex items-center gap-1.5 bg-[#ffd814] hover:bg-[#f7ca00]
                               text-[#0f1111] text-sm font-semibold px-5 py-2 rounded-full
                               transition-colors duration-150 border border-[#FCD200]
                               active:scale-95 shadow-md"
                  >
                    {slide.cta}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Arrow buttons ─────────────────────────────────────────────────── */}
      <motion.button
        onClick={prev}
        aria-label="Previous slide"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovering ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-white"
        style={{
          background: 'rgba(0,0,0,0.42)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </motion.button>

      <motion.button
        onClick={next}
        aria-label="Next slide"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovering ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-white"
        style={{
          background: 'rgba(0,0,0,0.42)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </motion.button>

      {/* ── Dot indicators ────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
      >
        {SLIDES.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => goTo(i, i > index ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            animate={{
              width:           i === index ? 28 : 8,
              backgroundColor: i === index ? '#febd69' : 'rgba(255,255,255,0.55)',
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{
              height:       8,
              borderRadius: 99,
              border:       'none',
              cursor:       'pointer',
              outline:      'none',
              padding:      0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
