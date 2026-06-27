import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getTileCollections,
  getBrandById,
  type TileCollection,
} from '../data/mockDb';
import useSEO from '../hooks/useSEO';
import {
  IconSparkles,
  IconRuler,
  IconLayersIntersect,
  IconArrowRight,
  IconMessageCircle,
  IconFilter,
} from '@tabler/icons-react';

const BRAND_TABS = [
  { id: 'all', label: 'All Collections' },
  { id: 'colortile', label: 'Colortile' },
  { id: 'donato', label: 'Donato' },
  { id: 'latigres', label: 'Latigres' },
  { id: 'marfil', label: 'Marfil' },
];

const FINISH_OPTIONS = ['All', 'High Gloss', 'Glossy', 'Matt', 'Satin', 'Polished'];

// ─── Collection Card ────────────────────────────────────────────────────────────
const CollectionCard: React.FC<{ collection: TileCollection; index: number }> = ({ collection, index }) => {
  const brand = getBrandById(collection.brandId);
  const featuredVariants = collection.variants.filter(v => v.isFeatured).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden" style={{ height: '260px' }}>
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Brand badge */}
        {brand && (
          <div className="absolute top-4 left-4">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white uppercase tracking-widest shadow-lg"
              style={{ backgroundColor: brand.colorAccent }}
            >
              {brand.name}
            </span>
          </div>
        )}

        {/* Tag badge */}
        {collection.tag && (
          <div className="absolute top-4 right-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-400 text-stone-900 uppercase tracking-wide">
              {collection.tag}
            </span>
          </div>
        )}

        {/* Collection name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-heading font-bold text-2xl leading-tight mb-1">
            {collection.name}
          </h3>
          <p className="text-white/70 text-sm">{collection.tagline}</p>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Specs row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <IconRuler size={15} className="text-primary" />
            <span>{collection.size}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <IconLayersIntersect size={15} className="text-primary" />
            <span>{collection.thickness}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <IconSparkles size={15} className="text-primary" />
            <span>{collection.finish.join(', ')}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">
          {collection.description}
        </p>

        {/* Variant swatches */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {collection.variants.length} Varieties
          </p>
          <div className="flex gap-2 flex-wrap">
            {collection.variants.slice(0, 8).map((variant) => (
              <div key={variant.id} className="group/swatch relative">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 hover:scale-125 transition-transform duration-200 cursor-pointer"
                  style={{ backgroundColor: variant.swatchColor }}
                  title={variant.name}
                />
              </div>
            ))}
            {collection.variants.length > 8 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm ring-1 ring-gray-200 flex items-center justify-center text-xs text-gray-500 font-semibold">
                +{collection.variants.length - 8}
              </div>
            )}
          </div>
        </div>

        {/* Variant preview thumbnails */}
        {featuredVariants.length > 0 && (
          <div className="grid grid-cols-5 gap-1.5 mb-5">
            {featuredVariants.map((v) => (
              <div key={v.id} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={v.imageHighGloss}
                  alt={v.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-3 mt-auto">
          <Link
            to={`/tiles/${collection.brandId}/${collection.id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-stone-950 hover:bg-primary text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            View Collection
            <IconArrowRight size={16} />
          </Link>
          <a
            href={`https://wa.me/919408461000?text=Hi, I am interested in the ${collection.name} by ${brand?.name}. Please share more details.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-300 border border-emerald-200"
          >
            <IconMessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const Tiles: React.FC = () => {
  const [activeBrandTab, setActiveBrandTab] = useState('all');
  const [activeFinish, setActiveFinish] = useState('All');

  useSEO({
    title: 'Premium Tiles Collection — Colortile, Donato, Latigres, Marfil | Nilkanth Marble',
    description:
      'Explore premium tile collections from Colortile Genesis, Donato Aurora, Latigres Woodland, and Marfil Royal Essence. High gloss, matt, satin finishes. Available at Nilkanth Marble, Nadiad.',
    keywords: 'tiles Nadiad, Colortile Genesis, Donato vitrified tiles, ceramic tiles Gujarat, premium floor tiles',
    url: '/tiles',
  });

  const allCollections = getTileCollections();

  const filtered = useMemo(() => {
    let result = allCollections;
    if (activeBrandTab !== 'all') result = result.filter(c => c.brandId === activeBrandTab);
    if (activeFinish !== 'All') {
      result = result.filter(c =>
        c.finish.some(f => f.toLowerCase().includes(activeFinish.toLowerCase()))
      );
    }
    return result;
  }, [activeBrandTab, activeFinish, allCollections]);

  return (
    <div className="bg-light min-h-screen">
      {/* ── Hero Banner ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-stone-950" style={{ minHeight: '440px' }}>
        <img
          src="/tile-hero.png"
          alt="Premium Tiles Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center" style={{ minHeight: '440px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Product Category</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4 leading-tight">
              Premium <span className="text-amber-400">Tiles</span>
            </h1>
            <p className="text-stone-300 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Curated collections from India's leading tile brands — Colortile, Donato, Latigres & Marfil. 
              From high-gloss marble-look to natural wood grain, find the perfect tile for every space.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3">
                <p className="text-white font-bold text-xl">{allCollections.length}+</p>
                <p className="text-stone-400 text-xs uppercase tracking-wider">Collections</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3">
                <p className="text-white font-bold text-xl">{allCollections.reduce((acc, c) => acc + c.variants.length, 0)}+</p>
                <p className="text-stone-400 text-xs uppercase tracking-wider">Varieties</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3">
                <p className="text-white font-bold text-xl">4</p>
                <p className="text-stone-400 text-xs uppercase tracking-wider">Top Brands</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Filters Bar ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
            {/* Brand tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {BRAND_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBrandTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeBrandTab === tab.id
                      ? 'bg-stone-950 text-white shadow-sm'
                      : 'text-gray-600 hover:text-stone-950 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Finish filter */}
            <div className="flex items-center gap-2">
              <IconFilter size={16} className="text-gray-500" />
              <select
                value={activeFinish}
                onChange={(e) => setActiveFinish(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              >
                {FINISH_OPTIONS.map(f => (
                  <option key={f} value={f}>{f === 'All' ? 'All Finishes' : f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Collections Grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">No collections match your filters.</p>
            <button
              onClick={() => { setActiveBrandTab('all'); setActiveFinish('All'); }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-stone-900">{filtered.length}</span> collections
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {filtered.map((collection, i) => (
                <CollectionCard key={collection.id} collection={collection} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── B2C CTA Banner ───────────────────────────────────────────────────────── */}
      <div className="bg-stone-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Need help choosing the right tile?
            </h2>
            <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
              Visit our showroom in Nadiad or WhatsApp us. Our experts will help you pick the perfect tile for your space and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-amber-400/30 hover:-translate-y-1"
              >
                Visit Showroom
              </Link>
              <a
                href="https://wa.me/919408461000?text=Hi, I want to browse tile collections. Can you help me?"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <IconMessageCircle size={20} />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tiles;
