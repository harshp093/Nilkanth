import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ────────────────────────────────────────────────────────────────
   Slide Animations
────────────────────────────────────────────────────────────────── */
const textVariants = {
  hidden: { opacity: 0, y: 35, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const HERO_SLIDES = [
  {
    tag: 'ESTABLISHED 2003 · NADIAD, GUJARAT',
    heading1: 'Premium Italian',
    heading2: 'Marble Collections',
    sub: "Authorized dealer for Italy's finest marble brands. Discover Carrara, Calacatta, and Statuario of the highest grade.",
    btnLabel: 'Browse Marble Slabs',
    btnRoute: '/marble',
    imageKey: 'marble',
  },
  {
    tag: 'NATURAL & ENGINEERED STONE',
    heading1: 'Sleek Granite &',
    heading2: 'Quartz Surfaces',
    sub: 'Extremely durable countertops, wall claddings, and floorings. Premium Black Galaxy, Kashmir White, and Quartz.',
    btnLabel: 'Explore Granite',
    btnRoute: '/granite',
    imageKey: 'granite',
  },
  {
    tag: 'LUXURY BATHROOM FITTINGS',
    heading1: 'Designer Sanitary',
    heading2: 'Ware & Faucets',
    sub: 'Upgrading bathrooms with premium water closets, wash basins, faucets, and showers in multiple custom finishes.',
    btnLabel: 'View Sanitary Ware',
    btnRoute: '/sanitary-ware',
    imageKey: 'sanitary',
  },
  {
    tag: 'COLOR TILES EXCLUSIVE PARTNER',
    heading1: 'Premium Ceramic &',
    heading2: 'Vitrified Tiles',
    sub: 'Floor tiles, designer wall panels, and high-gloss vitrified tiles. Browse or download PDF catalogs instantly.',
    btnLabel: 'Download Tiles PDF',
    btnRoute: '/tiles-catalog',
    imageKey: 'tiles',
  }
];

/* ────────────────────────────────────────────────────────────────
   Main Hero Component
────────────────────────────────────────────────────────────────── */
const ThreeHero: React.FC = () => {
  const [slide, setSlide] = useState(0);

  // Auto transition every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(curr => (curr + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = HERO_SLIDES[slide];

  // Handle Drag/Swipe to move slides
  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      // Swipe Left -> Next Slide
      setSlide(curr => (curr + 1) % HERO_SLIDES.length);
    } else if (info.offset.x > swipeThreshold) {
      // Swipe Right -> Prev Slide
      setSlide(curr => (curr - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
  };

  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden flex flex-col justify-center bg-[#0c0a1a]">

      {/* Background Slideshow with touch/mouse swipe */}
      <motion.div 
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing pointer-events-auto"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background image for mobile view */}
            <div className="absolute inset-0 block lg:hidden">
              <img
                src={`/hero_${activeSlide.imageKey}.webp`}
                alt={activeSlide.heading1}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Ambient luxury lighting */}
            <div className="absolute inset-0"
                 style={{ background: 'radial-gradient(ellipse at 35% 50%, rgba(12, 10, 26, 0.4) 0%, rgba(5, 5, 8, 0.6) 60%, rgba(0,0,0,0.85) 100%)' }} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[1]"
           style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.025]"
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)', backgroundSize: '100% 4px' }} />

      {/* Left side text darkening gradient overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-[45%] pointer-events-none z-[2]"
           style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)' }} />

      {/* Left/Right manual arrows */}
      <button
        onClick={() => setSlide(curr => (curr - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary transition-all pointer-events-auto cursor-pointer"
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button
        onClick={() => setSlide(curr => (curr + 1) % HERO_SLIDES.length)}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary transition-all pointer-events-auto cursor-pointer"
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* ─── Slide Content Staggered Animations ─── */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between h-full px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full mt-16 md:mt-0 gap-10">
        <div className="flex-1 max-w-2xl pointer-events-none">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={slide}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Tagline */}
              <motion.div
                custom={0}
                variants={textVariants}
                className="flex items-center gap-3 mb-5"
              >
                <div className="h-px w-8 bg-[#C8962E]" />
                <span className="text-[#C8962E] text-xs font-bold tracking-[0.25em] uppercase font-outfit">
                  {activeSlide.tag}
                </span>
              </motion.div>

              {/* Heading — Luxury typography using Playfair Display font */}
              <motion.h1
                custom={1}
                variants={textVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury font-bold text-white leading-[1.08] sm:leading-[1.05] tracking-tight mb-5"
              >
                <span className="block">{activeSlide.heading1}</span>
                <span className="block text-gradient-gold italic font-normal">{activeSlide.heading2}</span>
              </motion.h1>

              {/* Divider line */}
              <motion.div
                custom={2}
                variants={textVariants}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-36 bg-gradient-to-r from-[#C8962E] to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8962E]" />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                custom={3}
                variants={textVariants}
                className="text-gray-300 text-sm sm:text-base md:text-lg max-w-lg font-light leading-relaxed mb-9 font-sans"
              >
                {activeSlide.sub}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                custom={4}
                variants={textVariants}
                className="flex flex-row flex-wrap gap-4 pointer-events-auto"
              >
                <Link to={activeSlide.btnRoute} className="btn-accent text-sm px-6 py-3.5 shadow-2xl hover:brightness-115">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  {activeSlide.btnLabel}
                </Link>
                <Link to="/contact" className="btn-secondary text-sm px-6 py-3.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.57 4.5 2 2 0 0 1 3.56 2.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Floating UHD Slab Object */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              className="relative w-[340px] h-[480px] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/10"
              initial={{ rotateY: -18, rotateX: 12, y: 15, opacity: 0 }}
              animate={{ 
                y: [-10, 10, -10],
                rotateY: [-18, -12, -18],
                rotateX: [12, 16, 12],
                opacity: 1
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
            >
              {/* Glowing gold backlight */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#C8962E]/35 to-transparent blur-2xl opacity-75" />
              
              {/* Slab Image */}
              <img
                src={`/hero_${activeSlide.imageKey}.webp`}
                alt={activeSlide.heading1}
                className="w-full h-full object-cover"
              />

              {/* Polished Glass shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none" />

              {/* Gold Frame border */}
              <div className="absolute inset-3 border border-[#C8962E]/40 rounded-xl pointer-events-none" />
              
              {/* Branding text overlay inside the UHD object */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C8962E] uppercase block mb-1">NILKANTH MARBLE</span>
                <h4 className="text-white font-luxury text-lg leading-tight">{activeSlide.heading1}<br/>{activeSlide.heading2}</h4>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Gems */}
          <motion.div 
            className="absolute top-1/4 left-8 w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8962E]/40 to-transparent opacity-65 blur-[1px]"
            animate={{ y: [0, -18, 0], rotate: [0, 360] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-8 w-10 h-10 rounded-lg bg-gradient-to-bl from-white/15 to-transparent opacity-50 blur-[1px]"
            animate={{ y: [0, 22, 0], rotate: [360, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Slide Navigation indicators */}
      <div className="absolute bottom-28 left-6 sm:left-12 lg:left-20 z-10 flex gap-3 pointer-events-auto">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="w-8 py-2 group focus:outline-none cursor-pointer"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slide ? 'bg-[#C8962E] w-8' : 'bg-white/20 group-hover:bg-white/40 w-4'
            }`} />
          </button>
        ))}
      </div>

      {/* ─── Bottom Stats Bar ─── */}
      <motion.div
        className="absolute bottom-0 w-full z-10 hidden md:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass-dark border-t border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
              {[
                { value: '6+',   label: 'Premium Brands' },
                { value: '500+', label: 'Stone Products' },
                { value: '20+',  label: 'Years of Trust' },
                { value: '∞',    label: 'Design Possibilities' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xl font-heading font-black text-gradient-gold">{s.value}</span>
                  <span className="text-xs text-gray-400 font-medium tracking-wider uppercase font-outfit">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em] font-outfit">NILKANTH MARBLE · THE QUALITY FOREVER</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThreeHero;
