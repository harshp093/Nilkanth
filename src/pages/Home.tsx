import React, { Suspense, lazy, useRef, useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { getBrands, getFeaturedProducts, getMarbleTypes } from '../data/mockDb';
import type { MarbleType } from '../data/mockDb';
import HeroLoader from '../components/HeroLoader';
import useSEO from '../hooks/useSEO';
import { IconCheck, IconShieldCheck, IconMessageCircle, IconArrowRight, IconArrowLeft, IconMapPin, IconSparkles, IconDiamond } from '@tabler/icons-react';

// Lazy load the heavy 3D component
const ThreeHero = lazy(() => import('../components/ThreeHero'));

/* ─── Marble Carousel ─── */
const MarbleCarousel: React.FC<{ marbles: MarbleType[]; onNavigate: () => void }> = ({ marbles, onNavigate }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const total = marbles.length;
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: '-100px' });

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setCurrent(((next % total) + total) % total);
  }, [total]);

  const prev = () => go(current - 1, -1);
  const next = () => go(current + 1, 1);

  /* ── Arrow key navigation (only when carousel is in viewport) ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Skip if search overlay is open (body is position:fixed)
      if (document.body.style.position === 'fixed') return;
      // Only fire if carousel section is in viewport
      if (!inView) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(current - 1, -1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1, 1); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, go, inView]);

  const marble = marbles[current];
  const accentColor = marble.color === '#FFFFFF' || marble.color === '#FAFAFA' ? '#d4af37' : marble.color;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.96 }),
  };

  return (
    <div ref={sectionRef} className="w-full">
      {/* Main Carousel Stage */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-white/8 shadow-2xl" style={{ height: 'clamp(320px, 55vh, 540px)' }}>

        {/* Image layer */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={marble.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <img
              src={marble.imageUrl}
              alt={marble.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Info Panel (left side) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${marble.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.38, delay: 0.1 }}
            className="absolute bottom-0 left-0 p-6 md:p-10 max-w-md"
          >
            <span
              className="inline-block text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor, border: `1px solid ${accentColor}40` }}
            >
              {marble.tag}
            </span>
            <h3 className="font-heading font-black text-white text-3xl md:text-4xl mb-2 leading-tight">{marble.name}</h3>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
              <IconMapPin size={13} style={{ color: accentColor }} />
              <span>Origin: <strong className="text-white/80">{marble.origin}</strong></span>
              <span className="text-white/30 mx-1">·</span>
              <span className="text-white/50">{marble.finish}</span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed hidden md:block">{marble.description}</p>
            <motion.button
              whileHover={{ scale: 1.04, x: 4 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNavigate}
              className="mt-4 flex items-center gap-2 text-sm font-bold"
              style={{ color: accentColor }}
            >
              View in Gallery <IconArrowRight size={14} />
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Counter badge */}
        <div className="absolute top-5 right-5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-white text-xs font-mono">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        {/* ── Arrow Buttons ── */}
        <motion.button
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.93 }}
          onClick={prev}
          aria-label="Previous marble"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 backdrop-blur-sm border border-white/15 hover:border-white/35 rounded-full p-3 text-white transition-all duration-200 shadow-xl"
        >
          <IconArrowLeft size={22} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.93 }}
          onClick={next}
          aria-label="Next marble"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 backdrop-blur-sm border border-white/15 hover:border-white/35 rounded-full p-3 text-white transition-all duration-200 shadow-xl"
        >
          <IconArrowRight size={22} />
        </motion.button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <motion.div
            className="h-full"
            style={{ backgroundColor: accentColor }}
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
        {marbles.map((m, i) => {
          const isActive = i === current;
          const tc = m.color === '#FFFFFF' || m.color === '#FAFAFA' ? '#d4af37' : m.color;
          return (
            <motion.button
              key={m.id}
              onClick={() => go(i, i > current ? 1 : -1)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative shrink-0 rounded-xl overflow-hidden transition-all duration-300"
              style={{
                width: isActive ? '90px' : '64px',
                height: '56px',
                border: isActive ? `2px solid ${tc}` : '2px solid transparent',
                boxShadow: isActive ? `0 0 14px ${tc}55` : 'none',
              }}
              aria-label={m.name}
            >
              <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 transition-opacity ${isActive ? 'bg-black/20' : 'bg-black/50 hover:bg-black/30'}`} />
              {isActive && (
                <motion.div
                  layoutId="thumb-active"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: tc }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-stone-600 text-xs mt-3 flex items-center justify-center gap-2">
        <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono text-stone-500">←</kbd>
        <kbd className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono text-stone-500">→</kbd>
        Navigate with arrow keys when viewing this section
      </p>
    </div>
  );
};



/* ─── Animated Counter ─── */
const Counter: React.FC<{ end: number; suffix?: string; label: string }> = ({ end, suffix = '', label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-heading font-black text-amber-400 mb-1">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {end}{suffix}
        </motion.span>
      </div>
      <div className="text-stone-400 text-sm uppercase tracking-widest font-medium">{label}</div>
    </div>
  );
};

const Home: React.FC = () => {
  useSEO({
    title: 'Premium Marble & Tiles Showroom Nadiad, Gujarat — The Quality Forever',
    description: 'Nilkanth Marble & Tiles — Authorized dealer of premium Italian marble, vitrified tiles & ceramics in Nadiad, Gujarat. KalingaStone, Donato, Colortile & more. Call +91 94084 61000.',
    keywords: 'marble showroom Nadiad, Italian marble Gujarat, premium tiles India, Calacatta marble, Carrara marble, vitrified tiles dealer',
    image: '/marble-calacatta.png',
    url: '/',
  });

  const brands = getBrands();
  const featuredProducts = getFeaturedProducts();
  const marbleTypes = getMarbleTypes();
  const navigate = useNavigate();

  const marbleSectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: marbleSectionRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* 3D Hero */}
      <Suspense fallback={<HeroLoader />}>
        <ThreeHero />
      </Suspense>

      {/* ── Stats Strip ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-stone-950 py-12 border-y border-white/5"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { end: 500, suffix: '+', label: 'Products' },
            { end: 6, suffix: '', label: 'Premium Brands' },
            { end: 15, suffix: '+', label: 'Years Experience' },
            { end: 12, suffix: '', label: 'Marble Varieties' },
          ].map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </div>
      </motion.section>


      {/* ── Marble Types Carousel with Arrow Navigation ── */}
      <section ref={marbleSectionRef} className="relative py-20 bg-stone-950 overflow-hidden">
        {/* Parallax background orbs */}
        <motion.div style={{ y: parallaxY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-5 py-2 mb-5"
            >
              <IconDiamond size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Natural Stone Collection</span>
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-heading font-black text-white mb-4 leading-tight">
              World-Class{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                Marble Types
              </span>
            </h2>
            <p className="text-stone-400 text-base max-w-2xl mx-auto">
              Use <kbd className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-stone-300 font-mono mx-1">←</kbd>
              <kbd className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-xs text-stone-300 font-mono mx-1">→</kbd>
              arrow keys or buttons to browse all {marbleTypes.length} premium marbles.
            </p>
          </motion.div>

          {/* ── Main Carousel ── */}
          <MarbleCarousel marbles={marbleTypes} onNavigate={() => navigate('/gallery')} />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-900 px-8 py-4 rounded-full font-bold text-base shadow-2xl shadow-amber-500/30 transition-all duration-300"
              >
                <IconSparkles size={20} />
                Explore Full Marble Gallery
                <IconArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ── Brands Section ── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 mb-4">Brands We Carry</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-4" />
            <p className="text-stone-500 max-w-xl mx-auto">Authorized dealer of the finest brands in marble, tiles, and stone</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.25 } }}
                onClick={() => navigate(`/brands/${brand.id}`)}
                className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group border-t-4 border-transparent hover:border-current"
                style={{ borderTopColor: brand.colorAccent }}
              >
                <motion.div
                  className="h-16 w-16 mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${brand.colorAccent}15` }}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-heading font-bold text-2xl" style={{ color: brand.colorAccent }}>
                    {brand.name.charAt(0)}
                  </span>
                </motion.div>
                <h3 className="font-semibold text-stone-900 text-base mb-1">{brand.name}</h3>
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">{brand.category}</p>
                <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{brand.productCount} Products</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-heading font-bold text-stone-900 mb-3">Featured Collection</h2>
              <div className="w-24 h-1 bg-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/catalog" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-red-700 transition-colors group">
                View Full Catalog
                <motion.span whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <IconArrowRight size={20} />
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.slice(0, 8).map((product) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-stone-50 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-stone-900 shadow-sm uppercase tracking-wide">
                      {brands.find(b => b.id === product.brandId)?.name || 'Brand'}
                    </span>
                  </div>
                  {(product as any).origin && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-amber-400/90 text-stone-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <IconMapPin size={10} /> {(product as any).origin}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-stone-500">
                    <span>{product.dimensions}</span>
                    <span className="capitalize bg-stone-200 px-2 py-0.5 rounded-full text-xs">{product.finish}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center md:hidden">
            <Link to="/catalog" className="btn-secondary inline-flex items-center gap-2">
              View Full Catalog <IconArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Nilkanth ── */}
      <section className="py-28 bg-stone-950 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-amber-400/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full border border-primary/10"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-stone-950 via-stone-900/50 to-stone-950" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Why Choose Nilkanth?</h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">Decades of expertise and a commitment to quality ensures your spaces look magnificent forever.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: IconShieldCheck, title: 'Authorized Dealer', desc: 'Directly sourcing from top-tier brands ensures 100% genuine products with manufacturer warranties.', color: 'text-primary' },
              { icon: IconCheck, title: 'Premium Selection', desc: 'Curated collections of the finest Italian design stones, vitrified tiles, and premium marble varieties.', color: 'text-amber-400' },
              { icon: IconMessageCircle, title: 'Expert Guidance', desc: 'Our experienced team helps you select the perfect materials for your specific architectural needs.', color: 'text-emerald-400' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <motion.div
                  className="p-5 rounded-2xl mb-6"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <item.icon size={44} className={item.color} />
                </motion.div>
                <h3 className="text-2xl font-heading font-bold mb-4">{item.title}</h3>
                <p className="text-stone-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA Strip ── */}
      <section className="relative py-16 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-red-500 to-primary" />
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-white to-transparent"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between text-white gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Ready to transform your space?</h2>
            <p className="text-white/80 text-lg">Visit our showroom in Nadiad or contact us today.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <div className="flex flex-col text-right hidden sm:flex mr-4">
              <span className="font-bold text-lg">+91 94084 61000</span>
              <span className="text-sm text-white/80">nilkanth1marble@gmail.com</span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="bg-white text-primary hover:bg-stone-950 hover:text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-xl"
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
