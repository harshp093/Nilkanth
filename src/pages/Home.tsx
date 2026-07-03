import React, { useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useSupabaseProducts, useSupabaseCategories, useSupabaseCatalogs } from '../hooks/useSupabaseProducts';
import ProductCard from '../components/products/ProductCard';
import type { NProduct } from '../data/products';
import ThreeHero from '../components/ThreeHero';

// ─── Counter Component ───
const Counter: React.FC<{ end: number; suffix?: string; label: string; prefix?: string }> = ({
  end, suffix = '', prefix = '', label,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-heading font-black mb-1 text-black">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {prefix}{end}{suffix}
        </motion.span>
      </div>
      <div className="text-black/85 text-xs uppercase tracking-widest font-black">{label}</div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useSupabaseProducts();
  const { categories } = useSupabaseCategories();
  const { catalogs } = useSupabaseCatalogs();

  const getCount = (catId: string) => {
    if (catId === 'tiles-catalog') {
      return (catalogs || []).length;
    }
    return (products || []).filter((p) => p.category === catId).length;
  };

  const featuredProducts = useMemo(() => {
    const dbFeatured = (products || []).filter(p => p.isFeatured);
    const catFeatured = (catalogs || [])
      .filter(c => (c as any).isFeatured || (c as any).is_featured)
      .map(c => ({
        id: c.id,
        slug: c.id,
        name: c.title,
        description: c.description || '',
        category: 'marble' as any, // fallback category
        subcategory: c.catalogType,
        brand: c.company,
        isFeatured: true,
        isActive: true,
        images: [c.thumbnailUrl],
        isCatalog: true,
        pdfUrl: c.pdfUrl || undefined,
      } as NProduct));
    return [...dbFeatured, ...catFeatured].slice(0, 8);
  }, [products, catalogs]);

  const waGeneralUrl = `https://wa.me/919974142777?text=${encodeURIComponent('Hi Nilkanth Marble! 👋\n\nI am interested in your products. Please share details.')}`;

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <ThreeHero />

      {/* ── STATS STRIP ── */}
      <section className="bg-[#C8962E] py-10 border-y border-[#C8962E]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Counter end={20} suffix="+" label="Years Experience" />
          <Counter end={500} suffix="+" label="Products" />
          <Counter end={5} label="Categories" />
          <Counter end={0} suffix="" label="Online Payments" prefix="₹" />
        </div>
        <p className="text-center text-black/70 text-xs mt-4 tracking-widest uppercase font-bold">
          N.H. No.8, Piplag Chokdi, Nadiad, Gujarat · +91 94084 61000
        </p>
      </section>

      {/* ── CATEGORIES SHOWCASE ── */}
      <section className="py-20 bg-bg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-1.5 mb-4">
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Product Categories</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-dark mb-4">
              What We Offer
            </h2>
            <p className="text-text-sub max-w-xl mx-auto">
              Everything for your dream space — under one roof in Nadiad, Gujarat.
            </p>
          </motion.div>
 
          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(cat.route)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-surface border border-border/40"
                style={{ minHeight: '220px' }}
              >
                {/* Background Image - Always show if available */}
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/natural-stone-hero.png'; }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#C8962E]/10" />
                )}
 
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(200,150,46,0.3) 0%, transparent 100%)' }} />
 
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-2xl mb-2">{cat.emoji}</span>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-heading font-bold text-white">{cat.name}</h3>
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {getCount(cat.id)} items
                    </span>
                  </div>
                  <p className="text-white/70 text-sm">{cat.description}</p>
                  <div className="flex items-center gap-1.5 text-white/90 text-sm font-semibold mt-3 group-hover:gap-3 transition-all duration-200">
                    <span>Explore</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* View All card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categories.length * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate('/products')}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 flex items-center justify-center"
              style={{ minHeight: '220px' }}
            >
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C3A6B" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-primary text-lg mb-2">View All Products</h3>
                <p className="text-gray-500 text-sm">Browse our complete collection</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
 
      {/* ── FEATURED PRODUCTS — FLIPKART STYLE ── */}
      <section className="py-20 bg-bg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-heading font-black text-dark">
                  Featured Products
                </h2>
                <div className="section-divider mt-2" />
              </motion.div>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all group font-bold"
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
 
          {productsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface/50 rounded-2xl border border-border/40 w-full">
              <div className="animate-spin h-10 w-10 border-4 border-[#C8962E] border-t-transparent rounded-full mb-4"></div>
              <p className="text-text-sub text-sm font-semibold">Loading featured collections...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-border/40 px-6 w-full text-dark">
              <span className="text-4xl mb-4 block">🏛️</span>
              <h3 className="text-xl font-heading font-bold text-dark mb-2">Catalog Under Construction</h3>
              <p className="text-text-sub text-sm max-w-md mx-auto mb-4">
                We are currently uploading our premium new products and collections. Contact us on WhatsApp or call today for live inventory, photos, and prices!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary inline-flex px-8 py-3.5 text-base">
              View All Products
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-black text-gray-900 mb-4">
              Why Choose Nilkanth?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Decades of expertise delivering quality stone and tiles across Gujarat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🏆',
                title: '20+ Years Experience',
                desc: 'Established dealership with deep expertise in marble and stone selection.',
              },
              {
                icon: '🛡️',
                title: 'Quality Guaranteed',
                desc: 'Every stone inspected for quality. Only the finest marble and granite.',
              },
              {
                icon: '💬',
                title: 'Expert Consultation',
                desc: 'Free guidance from our experts to find the right stone for your space.',
              },
              {
                icon: '🚚',
                title: 'Pan-India Delivery',
                desc: 'Safe delivery with proper packaging across India. Showroom in Nadiad.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (IndiaMart style) ── */}
      <section className="py-16 bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              How to Order — It's Simple
            </h2>
            <p className="text-white/70 mb-10">No online payments. We work like IndiaMart — browse and contact us.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '👁️', title: 'Browse Products', desc: 'Explore our catalog of 500+ marble, granite & tile products' },
              { step: '2', icon: '💬', title: 'Contact Us', desc: 'Call or WhatsApp to get pricing, availability and samples' },
              { step: '3', icon: '✅', title: 'Get Your Stone', desc: 'Visit our showroom or we deliver to your location' },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-accent flex items-center justify-center mx-auto mb-4 text-2xl">
                  {step.icon}
                </div>
                <div className="font-heading font-black text-accent text-sm mb-1">STEP {step.step}</div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="py-16 bg-bg border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#111118] to-[#1a1a26] border border-border/20 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full border border-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full border border-accent/10 translate-y-1/2" />
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left relative z-10"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2" style={{ color: '#ffffff' }}>
                Ready to transform your space?
              </h2>
              <p className="text-sm font-sans" style={{ color: '#d1d5db' }}>
                Visit our showroom at Piplag Chokdi, Nadiad or contact us today.
              </p>
              <p className="font-semibold mt-2 text-sm font-outfit" style={{ color: '#C8962E' }}>
                📍 N.H. No.8, Piplag Chokdi, Nadiad - 387 355 · Mon–Sat 9AM–7PM
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0"
            >
              <a
                href={waGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa px-7 py-3.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
              <Link to="/contact" className="btn-outline border-white/30 text-white hover:bg-white hover:text-primary px-7 py-3.5">
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
