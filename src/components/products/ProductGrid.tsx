/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { NProduct, ProductCategory } from '../../data/products';
import ProductCard from './ProductCard';
import { useSupabaseCategories } from '../../hooks/useSupabaseProducts';

interface ProductGridProps {
  products: NProduct[];
  title?: string;
  showFilters?: boolean;
  pageSize?: number;
  defaultCategory?: ProductCategory;
}

export interface FilterState {
  categories: string[];
  colors: string[];
  finishes: string[];
  applications: string[];
  search: string;
  subcategory?: string;
  brand?: string;
}

const ITEMS_PER_PAGE = 24;

const FINISH_OPTIONS = ['Polished', 'Matte', 'Honed', 'Brushed', 'Flamed', 'Natural'];
const APPLICATION_OPTIONS = ['Flooring', 'Wall Cladding', 'Counter Top', 'Bathroom', 'Outdoor', 'Staircase', 'Pool Side'];

const staticCategoryTabs = [
  { value: 'all', label: '🛍️ All Products', route: '/products' },
  { value: 'marble', label: '🪨 Marble', route: '/marble' },
  { value: 'granite', label: '⬛ Granite', route: '/granite' },
  { value: 'kota-stone', label: '🟫 Kota Stone', route: '/kota-stone' },
  { value: 'cladding-stone', label: '🧱 Cladding Stone', route: '/cladding-stone' },
  { value: 'adhesives-chemicals', label: '🧪 Chemicals', route: '/adhesives-chemicals' },
];

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  showFilters = true,
  pageSize = ITEMS_PER_PAGE,
  defaultCategory,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize filters based on current URL path
  const { categories } = useSupabaseCategories();

  // Initialize filters based on current URL path
  const currentTab = useMemo(() => {
    // Try to match path with categories from database
    const matchingCat = categories.find(cat => 
      location.pathname.startsWith(cat.route) || 
      (cat.slug && location.pathname.includes(`/category/${cat.slug}`)) ||
      (cat.id && location.pathname.includes(`/category/${cat.id}`))
    );
    if (matchingCat) return matchingCat.id;

    if (location.pathname.startsWith('/marble')) return 'marble';
    if (location.pathname.startsWith('/granite')) return 'granite';
    if (location.pathname.startsWith('/cladding-stone')) return 'cladding-stone';
    if (location.pathname.startsWith('/adhesives-chemicals')) return 'adhesives-chemicals';
    if (location.pathname.startsWith('/kota-stone')) return 'kota-stone';
    return 'all';
  }, [location.pathname, categories]);

  const categoryTabs = useMemo(() => {
    if (!categories || categories.length === 0) {
      return staticCategoryTabs;
    }
    const list = [{ value: 'all', label: '🛍️ All Products', route: '/products' }];
    categories.forEach(cat => {
      list.push({
        value: cat.id,
        label: `${cat.emoji || '🪨'} ${cat.name}`,
        route: cat.route || `/category/${cat.slug}`,
      });
    });
    return list;
  }, [categories]);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialBrand = searchParams.get('brand') || '';

  const [filters, setFilters] = useState<FilterState>({
    categories: defaultCategory ? [(defaultCategory as string) === 'kota-others' ? 'kota-stone' : defaultCategory] : (currentTab !== 'all' ? [currentTab] : []),
    colors: [],
    finishes: [],
    applications: [],
    search: '',
    subcategory: '',
    brand: initialBrand,
  });

  // Sync filters if URL search params change
  useEffect(() => {
    const brandParam = new URLSearchParams(location.search).get('brand') || '';
    if (brandParam !== filters.brand) {
      setFilters(prev => ({ ...prev, brand: brandParam }));
    }
  }, [location.search]);

  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured');
  const [page, setPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isCompact, setIsCompact] = useState(true);

  // Derive available colors dynamically
  const availableColors = useMemo(() => {
    const list: { name: string; hex: string }[] = [];
    const seen = new Set<string>();
    products.forEach(p => {
      p.colorNames?.forEach((name, i) => {
        const key = name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ name, hex: p.colors?.[i] || '#888' });
        }
      });
    });
    return list;
  }, [products]);

  // Derive available brands dynamically
  const availableBrands = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => {
      if (p.brand) list.add(p.brand);
    });
    return Array.from(list);
  }, [products]);

  // Filters Handler
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleTabClick = (tabVal: string, route: string) => {
    navigate(route);
    setFilters(prev => ({
      ...prev,
      categories: tabVal === 'all' ? [] : [tabVal],
      subcategory: '',
      brand: '',
    }));
    setPage(1);
  };

  const toggleFilterItem = (field: keyof FilterState, val: string) => {
    setFilters(prev => {
      const arr = prev[field] as string[];
      const updated = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
      return { ...prev, [field]: updated };
    });
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: defaultCategory ? [defaultCategory] : (currentTab !== 'all' ? [currentTab] : []),
      colors: [],
      finishes: [],
      applications: [],
      search: '',
      subcategory: '',
      brand: '',
    });
    setPage(1);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Subcategory filter
    if (filters.subcategory) {
      const targetSub = filters.subcategory.trim().toLowerCase().replace(/\s+/g, '-');
      result = result.filter(p => p.subcategory && p.subcategory.trim().toLowerCase().replace(/\s+/g, '-') === targetSub);
    }

    // Brand filter
    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand);
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter(p =>
        p.colorNames?.some(c => filters.colors.includes(c))
      );
    }

    // Finish filter
    if (filters.finishes.length > 0) {
      result = result.filter(p =>
        p.finishOptions?.some(f => filters.finishes.some(ff => f.toLowerCase().includes(ff.toLowerCase())))
      );
    }

    // Application filter
    if (filters.applications.length > 0) {
      result = result.filter(p =>
        p.application?.some(a => filters.applications.some(fa => a.toLowerCase().includes(fa.toLowerCase())))
      );
    }

    // Search term
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.origin?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, filters, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const activeFilterCount =
    filters.colors.length +
    filters.finishes.length +
    filters.applications.length +
    (filters.subcategory ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* ─── STATUS BAR COMMAND CENTER ─── */}
      <div className="bg-surface border border-border/60 rounded-2xl p-4 shadow-sm space-y-4 transition-colors">
        
        {/* Top row: Search, Filter, Sort, Layout */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by product name, brand, origin, type..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-4 py-2 border border-border/60 rounded-xl text-sm bg-bg text-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder-dark/35"
            />
          </div>

          {/* Action buttons with animations */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Filter Toggle */}
            <button
              onClick={() => { setShowAdvancedFilters(!showAdvancedFilters); setShowSortDropdown(false); }}
              className={`flex items-center gap-1.5 border px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                showAdvancedFilters || activeFilterCount > 0
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/60 text-dark/70 hover:bg-primary/5 hover:border-primary/30'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-primary text-white text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Toggle */}
            <div className="relative">
              <button
                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowAdvancedFilters(false); }}
                className={`flex items-center gap-1.5 border px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  showSortDropdown
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/60 text-dark/70 hover:bg-primary/5 hover:border-primary/30'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M11 5L6 10M6 10L1 5M6 10V22M13 19L18 14M18 14L23 19M18 14V2"/>
                </svg>
                Sort
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-xl shadow-xl z-50 py-1"
                  >
                    {[
                      { value: 'featured', label: '★ Featured' },
                      { value: 'name-asc', label: 'Alphabetical A-Z' },
                      { value: 'name-desc', label: 'Alphabetical Z-A' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value as any); setShowSortDropdown(false); setPage(1); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors ${
                          sortBy === opt.value ? 'text-primary bg-primary/5' : 'text-dark/70'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Layout density Toggle */}
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="p-2 border border-border/60 rounded-xl hover:bg-primary/5 hover:border-primary/30 text-dark/70 transition-all cursor-pointer"
              title={isCompact ? 'Detailed Grid Layout' : 'Compact Catalog Grid'}
            >
              {isCompact ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Category Tabs list */}
        {showFilters && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-border/30 pt-3">
            {categoryTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value, tab.route)}
                className={`shrink-0 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  currentTab === tab.value
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'bg-bg text-dark/70 border border-border/40 hover:text-primary hover:border-primary/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ─── EXPANDING ADVANCED FILTERS PANEL ─── */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-border/40 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
                {/* Colors block */}
                {availableColors.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-dark/40 uppercase tracking-widest">Select Color</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map(c => (
                        <button
                          key={c.name}
                          onClick={() => toggleFilterItem('colors', c.name)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative border ${
                            filters.colors.includes(c.name) ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border/60'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {filters.colors.includes(c.name) && (
                            <span className="text-[9px] font-black mix-blend-difference text-white">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finishes block */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-dark/40 uppercase tracking-widest">Select Finish</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {FINISH_OPTIONS.map(f => (
                      <button
                        key={f}
                        onClick={() => toggleFilterItem('finishes', f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          filters.finishes.includes(f)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-bg text-dark/70 border-border/50 hover:border-primary/45'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applications block */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-dark/40 uppercase tracking-widest">Application Area</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {APPLICATION_OPTIONS.map(app => (
                      <button
                        key={app}
                        onClick={() => toggleFilterItem('applications', app)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          filters.applications.includes(app)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-bg text-dark/70 border-border/50 hover:border-primary/45'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brands selection block */}
              {availableBrands.length > 0 && (
                <div className="border-t border-border/30 mt-4 pt-3 space-y-2.5">
                  <h4 className="text-[10px] font-bold text-dark/40 uppercase tracking-widest">Partner Brands / Companies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableBrands.map(b => (
                      <button
                        key={b}
                        onClick={() => setFilters(prev => ({ ...prev, brand: prev.brand === b ? '' : b }))}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          filters.brand === b
                            ? 'bg-accent text-white border-accent'
                            : 'bg-bg text-dark/70 border-border/50 hover:border-accent/45'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear filters row */}
              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-border/30">
                <button onClick={clearAllFilters} className="text-xs font-semibold text-dark/40 hover:text-primary transition-colors cursor-pointer">
                  Clear All Filters
                </button>
                <button onClick={() => setShowAdvancedFilters(false)} className="text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── STONE SUB-CATEGORY FILTERS ─── */}
        {currentTab === 'stone' && (
          <div className="flex items-center gap-2 border-t border-border/30 pt-3">
            <span className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mr-2">Stone Type:</span>
            {[
              { id: '', label: 'All Slabs' },
              { id: 'natural-stone', label: '🌿 Natural Stone' },
              { id: 'artificial-stone', label: '🧪 Artificial Stone' },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setFilters(prev => ({ ...prev, subcategory: sub.id }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.subcategory === sub.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-bg text-dark/60 hover:text-accent hover:bg-accent/5'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* ─── SANITARY WARE SUB-CATEGORY FILTERS ─── */}
        {currentTab === 'sanitary-ware' && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-border/30 pt-3">
            <span className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mr-2 shrink-0">Fixtures:</span>
            {[
              { id: '', label: 'All Items' },
              { id: 'water-closets', label: '🚽 Water Closets' },
              { id: 'wash-basins', label: '🪣 Wash Basins' },
              { id: 'faucets-mixers', label: '🚰 Faucets & Taps' },
              { id: 'shower-systems', label: '🚿 Showers' },
              { id: 'bathroom-accessories', label: '🪤 Accessories' },
              { id: 'bathtubs', label: '🛁 Bathtubs' },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setFilters(prev => ({ ...prev, subcategory: sub.id }))}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.subcategory === sub.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-bg text-dark/60 hover:text-accent hover:bg-accent/5'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── PRODUCT CATALOG GRID (COMPACT CLAUDE OPTIMIZED) ─── */}
      <div>
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border/60 rounded-2xl shadow-sm transition-colors">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-heading font-black text-dark mb-1">No products found</h3>
            <p className="text-dark/40 text-xs mb-4">Try adjusting your filters or search keywords</p>
            <button
              onClick={clearAllFilters}
              className="btn-accent px-6 py-2.5 text-xs font-bold shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`grid gap-3 transition-all duration-300 ${
              isCompact
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, delay: Math.min(i * 0.03, 0.2) }}
                >
                  <ProductCard product={product} compact={isCompact} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
              disabled={page === 1}
              className="px-3.5 py-2 rounded-xl border border-border/60 text-xs font-semibold text-dark/70 disabled:opacity-40 hover:bg-primary/5 transition-all cursor-pointer"
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pg = i + 1;
              if (totalPages > 7) {
                if (page <= 4) pg = i + 1;
                else if (page >= totalPages - 3) pg = totalPages - 6 + i;
                else pg = page - 3 + i;
              }
              return (
                <button
                  key={pg}
                  onClick={() => { setPage(pg); window.scrollTo(0, 0); }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    page === pg
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-border/60 text-dark/70 hover:bg-primary/5'
                  }`}
                >
                  {pg}
                </button>
              );
            })}

            <button
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
              disabled={page === totalPages}
              className="px-3.5 py-2 rounded-xl border border-border/60 text-xs font-semibold text-dark/70 disabled:opacity-40 hover:bg-primary/5 transition-all cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
