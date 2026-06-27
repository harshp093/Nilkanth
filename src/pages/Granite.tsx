import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getGraniteVariants } from '../data/mockDb';
import useSEO from '../hooks/useSEO';
import {
  IconLeaf,
  IconAtom,
  IconSparkles,
  IconRuler,
  IconMessageCircle,
  IconMapPin,
  IconArrowRight,
  IconInfoCircle,
} from '@tabler/icons-react';

const Granite: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const initialType = typeParam === 'artificial-stone' ? 'artificial-stone' : 'natural-stone';
  const [activeTab, setActiveTab] = useState<'natural-stone' | 'artificial-stone'>(initialType);

  const allGranite = getGraniteVariants();
  const naturalGranite = allGranite.filter(g => g.subcategory === 'natural-stone');
  const artificialGranite = allGranite.filter(g => g.subcategory === 'artificial-stone');

  const activeGraniteList = activeTab === 'natural-stone' ? naturalGranite : artificialGranite;

  useSEO({
    title: activeTab === 'natural-stone' ? 'Natural Granite Stone | Nilkanth Marble' : 'Artificial Engineered Stone | Nilkanth Marble',
    description: 'Explore our premium collection of Natural Granite and Artificial Engineered Quartz stones in Nadiad, Gujarat.',
    url: `/granite?type=${activeTab}`,
  });

  const handleTabChange = (tab: 'natural-stone' | 'artificial-stone') => {
    setActiveTab(tab);
    setSearchParams({ type: tab });
  };

  return (
    <div className="bg-light min-h-screen">
      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeTab}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={activeTab === 'natural-stone' ? '/natural-stone-hero.png' : '/artificial-stone-hero.png'}
            alt="Granite Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-stone-950/60" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-heading font-black text-white mb-6 leading-tight drop-shadow-lg"
          >
            {activeTab === 'natural-stone' ? 'Natural Granite' : 'Artificial Stone'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow"
          >
            {activeTab === 'natural-stone'
              ? 'Unparalleled durability with unique, nature-crafted patterns for timeless spaces.'
              : 'Engineered quartz offering zero maintenance, high stain resistance, and consistent elegant design.'}
          </motion.p>

          {/* Sub-navigation Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-2xl"
          >
            <button
              onClick={() => handleTabChange('natural-stone')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
                activeTab === 'natural-stone'
                  ? 'bg-amber-400 text-stone-900 shadow-md'
                  : 'text-white hover:text-amber-400 hover:bg-white/5'
              }`}
            >
              <IconLeaf size={18} />
              Natural Stone
            </button>
            <button
              onClick={() => handleTabChange('artificial-stone')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
                activeTab === 'artificial-stone'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-white hover:text-blue-400 hover:bg-white/5'
              }`}
            >
              <IconAtom size={18} />
              Artificial Stone
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Educational Info Section ───────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-xl h-fit text-primary"><IconRuler size={24} /></div>
              <div>
                <h3 className="font-bold text-stone-900 mb-1">Custom Sizes</h3>
                <p className="text-sm text-gray-500">Available in standard slabs (10x3 ft, 10x4 ft) and cut-to-size formats for countertops.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-xl h-fit text-primary"><IconSparkles size={24} /></div>
              <div>
                <h3 className="font-bold text-stone-900 mb-1">Premium Finishes</h3>
                <p className="text-sm text-gray-500">Choose from Polished, Flamed, Leathered, and Honed finishes to suit your application.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-xl h-fit text-primary"><IconInfoCircle size={24} /></div>
              <div>
                <h3 className="font-bold text-stone-900 mb-1">Expert Consultation</h3>
                <p className="text-sm text-gray-500">Unsure which stone fits your needs? Our experts guide you on natural vs artificial selection.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ──────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-stone-900 mb-2">
              {activeTab === 'natural-stone' ? 'Natural Granite Collection' : 'Engineered Quartz Collection'}
            </h2>
            <p className="text-gray-500">Showing {activeGraniteList.length} premium options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {activeGraniteList.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col"
              >
                <Link to={`/granite/${product.id}`} className="block relative h-64 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-stone-950 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                        {product.tag}
                      </span>
                    </div>
                  )}
                  {/* Swatch */}
                  <div 
                    className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: product.swatchColor }}
                  />
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/granite/${product.id}`}>
                      <h3 className="font-heading font-bold text-xl text-stone-900 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                    <IconMapPin size={14} className="text-primary" />
                    {product.origin}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.finishes.map(finish => (
                      <span key={finish} className="bg-gray-50 text-gray-600 border border-gray-200 text-xs px-2.5 py-1 rounded-md">
                        {finish}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Starting from</p>
                      <p className="text-primary font-bold text-lg">{product.pricePerSqFt ?? product.priceLabel}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/919408461000?text=Hi, I want more details about ${product.name} (${activeTab}).`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2.5 rounded-lg transition-colors"
                        title="WhatsApp Enquiry"
                      >
                        <IconMessageCircle size={20} />
                      </a>
                      <Link
                        to={`/granite/${product.id}`}
                        className="bg-stone-950 hover:bg-primary text-white p-2.5 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <IconArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="bg-stone-950 text-white py-16 text-center border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold mb-4">Not sure which stone to choose?</h2>
          <p className="text-stone-400 mb-8">
            Natural granite offers unique veining and high heat resistance, while artificial quartz provides a non-porous, maintenance-free surface with uniform design. Let our experts help you decide.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn-primary">Visit Showroom</Link>
            <a href="https://wa.me/919408461000" className="btn-secondary flex items-center gap-2">
              <IconMessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Granite;
