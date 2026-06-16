import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSearch, IconX, IconArrowRight, IconMapPin, IconSparkles, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { getProducts, getMarbleTypes, getBrands } from '../data/mockDb';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  imageUrl?: string;
  href: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setQuery('');
    setActiveIndex(-1);
    onClose();
  }, [onClose]);

  const allProducts = useMemo(() => getProducts(), []);
  const allMarbles = useMemo(() => getMarbleTypes(), []);
  const allBrands = useMemo(() => getBrands(), []);

  /**
   * ✅ FIX: Results are derived from query — use useMemo, not useEffect + setState.
   * This computes synchronously during render with zero extra render cycles.
   */
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    const found: SearchResult[] = [];

    allProducts.forEach(p => {
      if (
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.finish.toLowerCase().includes(lower) ||
        (p.origin && p.origin.toLowerCase().includes(lower)) ||
        (p.description && p.description.toLowerCase().includes(lower))
      ) {
        found.push({
          id: `product-${p.id}`,
          title: p.name,
          subtitle: `${p.category} · ${p.dimensions} · ${p.finish}`,
          tag: 'Product',
          tagColor: '#E8553A',
          imageUrl: p.imageUrl,
          href: `/product/${p.id}`,
        });
      }
    });

    allMarbles.forEach(m => {
      if (
        m.name.toLowerCase().includes(lower) ||
        m.origin.toLowerCase().includes(lower) ||
        m.description.toLowerCase().includes(lower) ||
        m.tag.toLowerCase().includes(lower)
      ) {
        found.push({
          id: `marble-${m.id}`,
          title: m.name,
          subtitle: `Natural Marble · Origin: ${m.origin} · ${m.finish}`,
          tag: m.tag,
          tagColor: '#d97706',
          imageUrl: m.imageUrl,
          href: '/gallery',
        });
      }
    });

    allBrands.forEach(b => {
      if (
        b.name.toLowerCase().includes(lower) ||
        b.category.toLowerCase().includes(lower) ||
        b.description.toLowerCase().includes(lower)
      ) {
        found.push({
          id: `brand-${b.id}`,
          title: b.name,
          subtitle: `${b.category} · ${b.productCount} products · Origin: ${b.origin}`,
          tag: 'Brand',
          tagColor: b.colorAccent,
          href: `/brands/${b.id}`,
        });
      }
    });

    return found.slice(0, 8);
  }, [query, allProducts, allMarbles, allBrands]);

  /* ── Body scroll lock: freeze page behind search ── */
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      // Restore scroll position exactly
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goTo = useCallback((href: string) => {
    navigate(href);
    handleClose();
  }, [navigate, handleClose]);

  /* ── Scroll active result into view inside the results panel ── */
  useEffect(() => {
    if (activeItemRef.current && resultsRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  /* ── Keyboard navigation (scoped to search panel only) ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') { handleClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setActiveIndex(i => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setActiveIndex(i => Math.max(i - 1, -1));
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        goTo(results[activeIndex].href);
      }
    };
    // useCapture=true so we intercept before any other handler
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [isOpen, results, activeIndex, handleClose, goTo]);

  const popular = ['Carrara White', 'Calacatta Gold', 'Nero Marquina', 'Statuario', 'Marble Tiles', 'Vitrified'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click to close, no scroll behind */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Search Panel — scrollable INSIDE only */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-6 left-0 right-0 z-[201] mx-auto max-w-2xl px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-stone-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
              style={{ maxHeight: 'min(85vh, 640px)' }}
            >
              {/* ── Input Row ── */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 shrink-0">
                <IconSearch size={20} className="text-amber-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setActiveIndex(-1);
                  }}
                  placeholder="Search marble type, origin, brand, finish…"
                  className="flex-1 bg-transparent text-white text-base placeholder:text-stone-500 outline-none caret-amber-400"
                  id="global-search-input"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      setQuery('');
                      setActiveIndex(-1);
                    }}
                    className="text-stone-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/8"
                  >
                    <IconX size={16} />
                  </motion.button>
                )}
                <button
                  onClick={handleClose}
                  className="text-stone-500 hover:text-white text-xs border border-white/10 hover:border-white/25 rounded-lg px-2.5 py-1.5 transition-all"
                >
                  Esc
                </button>
              </div>

              {/* ── Scrollable Results Area (ONLY this scrolls) ── */}
              <div
                ref={resultsRef}
                className="overflow-y-auto overscroll-contain flex-1"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#d97706 transparent' }}
              >
                {query.trim() === '' ? (
                  /* Popular Searches */
                  <div className="px-5 py-5">
                    <p className="text-stone-500 text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                      <IconSparkles size={13} className="text-amber-400" />
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popular.map(term => (
                        <motion.button
                          key={term}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setQuery(term);
                            setActiveIndex(-1);
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-amber-400/15 hover:text-amber-400 text-stone-300 rounded-full text-sm border border-white/8 transition-all duration-200"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>

                    {/* Quick marble preview thumbnails */}
                    <p className="text-stone-500 text-xs uppercase tracking-widest font-semibold mt-6 mb-3">Quick Browse — Marble Types</p>
                    <div className="grid grid-cols-3 gap-2">
                      {allMarbles.slice(0, 6).map(m => (
                        <button
                          key={m.id}
                          onClick={() => goTo('/gallery')}
                          className="relative rounded-xl overflow-hidden h-20 group border border-white/5 hover:border-amber-400/40 transition-all"
                        >
                          <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                          <span className="absolute bottom-1.5 left-0 right-0 text-center text-white text-xs font-semibold px-1 leading-tight">{m.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  /* No Results */
                  <div className="px-5 py-12 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-white font-semibold text-lg mb-1">
                      No results for "<span className="text-amber-400">{query}</span>"
                    </p>
                    <p className="text-stone-500 text-sm">Try: marble name, country (Italy, Spain, India), or finish type.</p>
                  </div>
                ) : (
                  /* Results List */
                  <div className="py-2">
                    <div className="px-5 pt-2 pb-1 flex items-center justify-between">
                      <span className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
                        {results.length} result{results.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-stone-600 flex items-center gap-1.5">
                        <IconArrowUp size={11} />
                        <IconArrowDown size={11} />
                        to navigate
                      </span>
                    </div>

                    {results.map((result, i) => {
                      const isActive = activeIndex === i;
                      return (
                        <motion.button
                          key={result.id}
                          ref={isActive ? activeItemRef : undefined}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.035 }}
                          onClick={() => goTo(result.href)}
                          className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-120 group outline-none ${isActive
                              ? 'bg-amber-400/12 border-l-2 border-amber-400'
                              : 'hover:bg-white/5 border-l-2 border-transparent'
                            }`}
                        >
                          {/* Thumbnail */}
                          <div className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-stone-800 border transition-all duration-200 ${isActive ? 'border-amber-400/50 scale-105' : 'border-white/5'}`}>
                            {result.imageUrl ? (
                              <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center font-heading font-bold text-base"
                                style={{ backgroundColor: `${result.tagColor}22`, color: result.tagColor }}
                              >
                                {result.title.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold truncate transition-colors ${isActive ? 'text-amber-300' : 'text-white group-hover:text-amber-300'}`}>
                              {result.title}
                            </div>
                            <div className="text-stone-500 text-xs truncate mt-0.5">{result.subtitle}</div>
                          </div>

                          {/* Tag + Arrow */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${result.tagColor}20`, color: result.tagColor }}
                            >
                              {result.tag}
                            </span>
                            <IconArrowRight
                              size={14}
                              className={`transition-colors ${isActive ? 'text-amber-400' : 'text-stone-600 group-hover:text-amber-400'}`}
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="px-5 py-2.5 border-t border-white/5 flex items-center gap-4 text-xs text-stone-600 shrink-0 bg-stone-950">
                <span className="flex items-center gap-1"><IconArrowUp size={10} /><IconArrowDown size={10} /> Navigate</span>
                <span>↵ Open</span>
                <span>Esc Close</span>
                <span className="ml-auto flex items-center gap-1">
                  <IconMapPin size={10} /> Nadiad, Gujarat
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
