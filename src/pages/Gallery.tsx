import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { getMarbleTypes } from '../data/mockDb';
import { IconX, IconZoomIn, IconMapPin, IconSparkles } from '@tabler/icons-react';
import useSEO from '../hooks/useSEO';

const Gallery: React.FC = () => {
  useSEO({
    title: 'Marble Gallery — 12+ Premium Natural Marble Types | Nilkanth',
    description: 'Explore Carrara, Calacatta Gold, Nero Marquina, Statuario, Portoro, Emperador, Verde Guatemala, Rosso Verona, White Onyx, Makrana & more natural marble varieties at Nilkanth Marble, Nadiad.',
    keywords: 'marble gallery, Carrara marble, Calacatta Gold, Nero Marquina, Statuario marble, Italian marble types, premium natural marble India',
    image: '/marble-statuario.png',
    url: '/gallery',
  });

  const marbles = getMarbleTypes();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const tags = ['All', ...Array.from(new Set(marbles.map(m => m.tag)))];

  const filtered = filter === 'All' ? marbles : marbles.filter(m => m.tag === filter);
  const selectedMarble = marbles.find(m => m.id === selected);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Hero Header */}
      <div ref={headerRef} className="relative py-28 px-4 text-center overflow-hidden">
        {/* Animated background marbles */}
        <div className="absolute inset-0 overflow-hidden">
          {marbles.slice(0, 4).map((m, i) => (
            <motion.div
              key={m.id}
              className="absolute opacity-20 rounded-full blur-2xl"
              style={{
                width: `${200 + i * 80}px`,
                height: `${200 + i * 80}px`,
                background: `radial-gradient(circle, ${m.color}88, transparent)`,
                top: `${[10, 60, 30, 70][i]}%`,
                left: `${[5, 70, 40, 85][i]}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isHeaderInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6"
          >
            <IconSparkles size={16} className="text-amber-400" />
            <span className="text-white/80 text-sm font-medium tracking-widest uppercase">Natural Stone Collection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight"
          >
            Marble{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Explore our world-class collection of natural marble varieties — from Italian classics to rare gems sourced across the globe.
          </motion.p>
        </motion.div>
      </div>

      {/* Filter Pills */}
      <div className="px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
        >
          {tags.map(tag => (
            <motion.button
              key={tag}
              onClick={() => setFilter(tag)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                filter === tag
                  ? 'bg-amber-400 text-stone-900 border-amber-400 shadow-lg shadow-amber-400/30'
                  : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Marble Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((marble) => (
              <motion.div
                key={marble.id}
                variants={itemVariants}
                layout
                whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-xl hover:shadow-2xl hover:shadow-black/60 transition-shadow duration-500"
                onClick={() => setSelected(marble.id)}
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={marble.imageUrl}
                    alt={marble.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-amber-400/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                    >
                      {marble.tag}
                    </motion.span>
                  </div>

                  {/* Zoom icon on hover */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <IconZoomIn size={18} className="text-white" />
                  </motion.div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-heading font-bold text-white text-xl mb-1 group-hover:text-amber-300 transition-colors duration-300">
                      {marble.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <IconMapPin size={13} />
                      <span>{marble.origin}</span>
                      <span className="ml-auto text-stone-300 text-xs bg-white/10 px-2 py-0.5 rounded-full">{marble.finish}</span>
                    </div>
                  </div>
                </div>

                {/* Color strip */}
                <motion.div
                  className="h-1 w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: marble.color === '#FFFFFF' || marble.color === '#FAFAFA' ? '#d4af37' : marble.color }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && selectedMarble && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              >
                <IconX size={20} />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-3/5 h-72 md:h-auto">
                  <img
                    src={selectedMarble.imageUrl}
                    alt={selectedMarble.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="md:w-2/5 p-8 flex flex-col justify-center">
                  <span className="inline-block bg-amber-400/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 w-fit">
                    {selectedMarble.tag}
                  </span>
                  <h2 className="text-3xl font-heading font-bold text-white mb-2">{selectedMarble.name}</h2>
                  <div className="flex items-center gap-2 text-stone-400 text-sm mb-6">
                    <IconMapPin size={14} className="text-amber-400" />
                    <span>Origin: <strong className="text-white">{selectedMarble.origin}</strong></span>
                  </div>

                  <p className="text-stone-300 leading-relaxed mb-6">{selectedMarble.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-stone-400 text-sm">Finish</span>
                      <span className="text-white font-medium">{selectedMarble.finish}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-stone-400 text-sm">Type</span>
                      <span className="text-white font-medium">Natural Marble</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-stone-400 text-sm">Category</span>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${selectedMarble.color === '#FFFFFF' || selectedMarble.color === '#FAFAFA' ? '#d4af37' : selectedMarble.color}22`,
                          color: selectedMarble.color === '#FFFFFF' || selectedMarble.color === '#FAFAFA' ? '#d4af37' : selectedMarble.color,
                        }}
                      >
                        {selectedMarble.tag}
                      </span>
                    </div>
                  </div>

                  <motion.a
                    href="/contact"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold py-3 px-6 rounded-xl text-center transition-colors inline-block"
                  >
                    Request a Sample
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
