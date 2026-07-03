/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { allProducts } from '../data/products';

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

const CATEGORY_COLOR: Record<string, string> = {
  marble:       '#1C3A6B',
  granite:      '#374151',
  'kota-stone':  '#b45309',
  'cladding-stone':'#78350f',
  'adhesives-chemicals':'#059669',
};

const POPULAR_SEARCHES = [
  'Carrara Marble', 'Italian Marble', 'Black Granite',
  'Vitrified Tiles', 'Sanitary Ware', 'Rajasthani Marble',
];

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [liveResults, setLiveResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleClose = useCallback(() => {
    setQuery('');
    setActiveIndex(-1);
    setLiveResults([]);
    onClose();
  }, [onClose]);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  // Search — Supabase first, fallback to local mock data
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      const resetTimer = setTimeout(() => {
        setLiveResults([]);
        setSearching(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const searchingTimer = setTimeout(() => {
      setSearching(true);
    }, 0);

    debounceRef.current = setTimeout(async () => {
      const lower = query.toLowerCase();
      const found: SearchResult[] = [];

      if (supabase) {
        try {
          const { data } = await supabase
              .from('products')
              .select('id,slug,name,category,subcategory,price_range,brand,images')
              .or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%,subcategory.ilike.%${query}%,description.ilike.%${query}%`)
              .eq('is_active', true)
              .limit(12);

          (data || []).forEach((p: any) => {
            found.push({
              id: `db-${p.id}`,
              title: p.name,
              subtitle: [
                p.category?.replace(/-/g, ' '),
                p.subcategory,
                p.brand,
                p.price_range,
              ].filter(Boolean).join(' · '),
              tag: p.category?.charAt(0).toUpperCase() + p.category?.slice(1).replace(/-/g, ' '),
              tagColor: CATEGORY_COLOR[p.category] || '#1C3A6B',
              imageUrl: p.images?.[0],
              href: `/products/${p.slug}`,
            });
          });
        } catch {
          // fall through to local
        }
      }

      // Search local mock data only if Supabase is not configured
      if (!supabase) {
        allProducts
            .filter(p => p.isActive && (
                p.name.toLowerCase().includes(lower) ||
                p.category.toLowerCase().includes(lower) ||
                (p.description || '').toLowerCase().includes(lower) ||
                (p.brand || '').toLowerCase().includes(lower) ||
                (p.subcategory || '').toLowerCase().includes(lower)
            ))
            .slice(0, 12)
            .forEach(p => {
              found.push({
                id: `local-${p.id}`,
                title: p.name,
                subtitle: [
                  p.category.replace(/-/g, ' '),
                  p.subcategory,
                  p.priceRange,
                ].filter(Boolean).join(' · '),
                tag: p.category.charAt(0).toUpperCase() + p.category.slice(1).replace(/-/g, ' '),
                tagColor: CATEGORY_COLOR[p.category] || '#1C3A6B',
                imageUrl: p.images?.[0],
                href: `/products/${p.slug}`,
              });
            });
      }

      setLiveResults(found);
      setSearching(false);
    }, 300);

    return () => {
      clearTimeout(searchingTimer);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(result.href);
    handleClose();
  }, [navigate, handleClose]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!liveResults.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, liveResults.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIndex >= 0) { handleSelect(liveResults[activeIndex]); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#fff', maxHeight: 'calc(100vh - 120px)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
                onKeyDown={handleKeyDown}
                placeholder="Search marble, granite, tiles, sanitary ware…"
                className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                autoComplete="off"
              />
              {(query || searching) && (
                <button onClick={() => { setQuery(''); setLiveResults([]); }}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors text-sm font-bold">×</button>
              )}
              <button onClick={handleClose}
                className="ml-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-semibold hover:bg-gray-200 transition-colors">
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {/* Loading state */}
              {searching && (
                <div className="flex items-center gap-2 px-5 py-4 text-gray-400 text-sm">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75"/>
                  </svg>
                  Searching products…
                </div>
              )}

              {/* No results */}
              {!searching && query && liveResults.length === 0 && (
                <div className="text-center py-12 px-4">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500 font-semibold">No results for "{query}"</p>
                  <p className="text-gray-400 text-sm mt-1">Try searching marble, granite, tiles…</p>
                </div>
              )}

              {/* Results list */}
              {!searching && liveResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-50">
                    {liveResults.length} result{liveResults.length !== 1 ? 's' : ''} found
                  </div>
                  {liveResults.map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelect(r)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        i === activeIndex ? 'bg-primary/5' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                        {r.imageUrl ? (
                          <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">💎</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{r.title}</div>
                        <div className="text-xs text-gray-500 truncate capitalize">{r.subtitle}</div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 text-white" style={{ background: r.tagColor }}>
                        {r.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches (empty state) */}
              {!query && (
                <div className="p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map(s => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {[
                      { label: 'All Products', href: '/products', emoji: '💎' },
                      { label: 'Marble', href: '/marble', emoji: '🪨' },
                      { label: 'Granite', href: '/granite', emoji: '⬛' },
                      { label: 'Tile Catalogs', href: '/tiles-catalog', emoji: '🔲' },
                    ].map(link => (
                      <button
                        key={link.href}
                        onClick={() => { navigate(link.href); handleClose(); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 text-sm font-semibold text-gray-700 hover:text-primary transition-all"
                      >
                        <span>{link.emoji}</span>{link.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
