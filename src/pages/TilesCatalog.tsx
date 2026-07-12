import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseCatalogs } from '../hooks/useSupabaseProducts';
import { catalogEnquiryWhatsApp } from '../utils/whatsapp';
import OptimizedImage from '../components/OptimizedImage';
import useSEO from '../hooks/useSEO';


/* ─────────────────────────────────────────────────────────────
   PARENT TAB CONFIG — icons & labels for known parent sections.
   Unknown parent_tab values gracefully fallback to a folder icon.
───────────────────────────────────────────────────────────────*/
const PARENT_TAB_CONFIG: Record<string, { label: string; icon: string; desc: string }> = {
  tiles:            { label: 'Tile Catalogs',      icon: '🔲', desc: 'Floor, wall, bathroom, designer & vitrified tiles' },
  sanitary:         { label: 'Sanitary Ware',       icon: '🚿', desc: 'Water closets, basins, faucets & premium bath systems' },
  stone:            { label: 'Natural Stone',        icon: '🪨', desc: 'Cladding, slate, quartzite, sandstone & natural stone' },
  'artificial-stone': { label: 'Artificial Stone',  icon: '⚗️', desc: 'Engineered quartz slabs & artificial stone catalogs' },
  other:            { label: 'Other Products',       icon: '📦', desc: 'Adhesives, chemicals & other building materials' },
};

type SortOption = 'newest' | 'oldest' | 'az' | 'most-viewed';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest',     label: '🕐 Newest First' },
  { id: 'oldest',     label: '🕰️ Oldest First' },
  { id: 'az',         label: '🔤 A – Z' },
  { id: 'most-viewed', label: '👁️ Most Viewed' },
];

/* Helper: slug → readable label */
const toLabel = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────*/
const TilesCatalog: React.FC = () => {
  useSEO({
    title: 'PDF Catalogs | Tiles, Sanitary Ware & Stone — Nilkanth Marble',
    description: 'Browse 26+ PDF catalogs from Nilkanth Marble — tiles, sanitary ware, artificial stone & natural stone. Download or view ColorTiles, Kajaria & premium brand catalogs. Nadiad, Gujarat.',
    url: '/catalogs',
    canonical: 'https://www.nilkanthmarble.com/catalogs',
    keywords: 'tiles catalog Gujarat, sanitary ware catalog Nadiad, PDF catalog marble tiles, ColorTiles catalog, Nilkanth Marble catalogs',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const { catalogs, loading } = useSupabaseCatalogs();

  /* ── State ── */
  const [searchQuery, setSearchQuery]     = useState('');
  const [sortBy, setSortBy]               = useState<SortOption>('newest');
  const [activeSubType, setActiveSubType] = useState('all');

  /* ── Derive unique parent tabs from live catalog data ── */
  const parentTabs = useMemo(() => {
    const map = new Map<string, number>();
    catalogs.forEach(c => {
      const pt = (c.parentTab || 'tiles').toLowerCase().trim();
      map.set(pt, (map.get(pt) || 0) + 1);
    });
    return Array.from(map.entries()).map(([id, count]) => ({
      id,
      label: PARENT_TAB_CONFIG[id]?.label || toLabel(id),
      icon: PARENT_TAB_CONFIG[id]?.icon || '📁',
      desc: PARENT_TAB_CONFIG[id]?.desc || '',
      count,
    }));
  }, [catalogs]);

  /* ── Active parent tab (from URL or first available) ── */
  const activeParentTab = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab && parentTabs.some(t => t.id === tab)) return tab;
    return parentTabs[0]?.id || 'tiles';
  }, [searchParams, parentTabs]);

  /* ── Derive unique sub-types for the selected parent tab ── */
  const subTypes = useMemo(() => {
    const map = new Map<string, string>(); // type-slug → readable label
    catalogs
      .filter(c => (c.parentTab || 'tiles').toLowerCase() === activeParentTab)
      .forEach(c => {
        const types = c.catalogType
          ? c.catalogType.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
          : [];
        const label = c.catalogTypeLabel || '';
        types.forEach((t, i) => {
          if (!map.has(t)) {
            const labelParts = label.split(',').map(s => s.trim());
            map.set(t, labelParts[i] || toLabel(t));
          }
        });
      });
    return [
      { id: 'all', label: 'All' },
      ...Array.from(map.entries()).map(([id, label]) => ({ id, label })),
    ];
  }, [catalogs, activeParentTab]);

  /* ── Reset sub-type when parent tab changes ── */
  const handleParentTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
    setActiveSubType('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  /* ── Filter by parent tab ── */
  const parentFiltered = useMemo(() =>
    catalogs.filter(c => (c.parentTab || 'tiles').toLowerCase() === activeParentTab),
    [catalogs, activeParentTab]
  );

  /* ── Filter by sub-type ── */
  const subFiltered = useMemo(() => {
    if (activeSubType === 'all') return parentFiltered;
    return parentFiltered.filter(c => {
      const types = c.catalogType
        ? c.catalogType.split(',').map(s => s.trim().toLowerCase())
        : [];
      return types.includes(activeSubType);
    });
  }, [parentFiltered, activeSubType]);

  /* ── Search ── */
  const searched = useMemo(() => {
    if (!searchQuery.trim()) return subFiltered;
    const q = searchQuery.toLowerCase();
    return subFiltered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      (c.tags || []).some(t => t.toLowerCase().includes(q)) ||
      (c.description || '').toLowerCase().includes(q)
    );
  }, [subFiltered, searchQuery]);

  /* ── Sort ── */
  const filtered = useMemo(() => {
    const arr = [...searched];
    switch (sortBy) {
      case 'oldest':      return arr.reverse();
      case 'az':          return arr.sort((a, b) => a.title.localeCompare(b.title));
      case 'most-viewed': return arr.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      default:            return arr;
    }
  }, [searched, sortBy]);

  const hasActiveFilters = searchQuery.trim() || sortBy !== 'newest' || activeSubType !== 'all';
  const clearFilters = () => { setSearchQuery(''); setSortBy('newest'); setActiveSubType('all'); };

  /* ── Current tab info ── */
  const currentTab = parentTabs.find(t => t.id === activeParentTab);

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-surface border-b border-border/40 pb-0 pt-8 transition-colors">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-dark/50 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-dark font-medium">PDF Catalogs</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-dark tracking-tight">
            📂 PDF Download Center
          </h1>
          <p className="text-dark/50 text-sm max-w-2xl mt-2 leading-relaxed">
            Instant access to our comprehensive premium collection catalogs — browse designs, size charts & high-resolution guides.
          </p>

          {/* ── Dynamic Parent Tabs ── */}
          {loading ? (
            <div className="flex gap-3 mt-8 pb-0">
              {[1,2,3].map(i => (
                <div key={i} className="h-11 w-32 rounded-t-xl bg-dark/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-0 mt-8 border-b border-border/20 pb-0">
              {parentTabs.map(tab => {
                const isActive = activeParentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleParentTabChange(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer -mb-px ${
                      isActive
                        ? 'border-primary text-primary font-black scale-[1.02]'
                        : 'border-transparent text-dark/60 hover:text-dark hover:border-dark/20'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-primary/15 text-primary' : 'bg-dark/8 text-dark/40'
                    }`}>{tab.count}</span>
                  </button>
                );
              })}
              {parentTabs.length === 0 && !loading && (
                <div className="text-dark/30 text-sm pb-3">No catalogs uploaded yet.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">

        {/* ── Description of current tab ── */}
        {currentTab?.desc && (
          <p className="text-dark/50 text-xs mb-5 font-medium">{currentTab.desc}</p>
        )}

        {/* ── Dynamic Sub-type filter chips ── */}
        {subTypes.length > 1 && (
          <motion.div
            key={activeParentTab}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-4 mb-5 border-b border-border/20"
          >
            {subTypes.map(sub => {
              const isActive = activeSubType === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubType(sub.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-surface border-border/40 text-dark/70 hover:text-dark hover:border-border'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* ── Search + Sort bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none text-sm">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search catalogs by name, brand, or tag..."
              className="w-full pl-9 pr-10 py-2.5 bg-surface border border-border/50 rounded-xl text-sm text-dark placeholder-dark/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark transition-colors text-xs font-bold">
                ✕
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-surface border border-border/50 rounded-xl text-sm text-dark focus:outline-none focus:border-primary/50 transition-all cursor-pointer font-medium"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 text-xs">▾</span>
          </div>
        </div>

        {/* ── Result count + clear ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-primary/8 border border-primary/15 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              {loading ? '...' : `${filtered.length} catalog${filtered.length !== 1 ? 's' : ''}`}
            </span>
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="text-xs text-dark/50 hover:text-primary transition-colors font-semibold underline underline-offset-2">
                Clear filters
              </button>
            )}
          </div>
          {searchQuery && (
            <span className="text-xs text-dark/40 font-medium">Results for "{searchQuery}"</span>
          )}
        </div>

        {/* ── Info tip ── */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4 mb-8 flex items-start gap-4 shadow-sm">
          <span className="text-2xl mt-0.5">💡</span>
          <div>
            <h4 className="text-sm font-bold text-dark">Easy Selection & Enquiries</h4>
            <p className="text-xs text-dark/60 mt-1 leading-relaxed">
              Click <strong>👁 View PDF</strong> to browse or download a catalog, or use <strong>WhatsApp Inquiry</strong> to chat directly with our team about specific designs, sizes, and pricing.
            </p>
          </div>
        </div>

        {/* ── Catalog Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-border/40 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-dark/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-dark/8 rounded w-3/4" />
                  <div className="h-2.5 bg-dark/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                layout
                key={`${activeParentTab}-${activeSubType}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {filtered.map((catalog, i) => (
                  <motion.div
                    layout
                    key={catalog.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: Math.min(i * 0.045, 0.35) }}
                    className="bg-surface rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-dark/5">
                      <OptimizedImage
                        src={catalog.thumbnailUrl}
                        alt={catalog.title}
                        width={400}
                        quality={70}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                      {/* Company badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">
                          {catalog.company}
                        </span>
                      </div>
                      {/* PDF badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          📄 PDF
                        </span>
                      </div>
                      {/* Sub-type badge */}
                      {catalog.catalogType && catalog.catalogType !== 'all' && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {catalog.catalogTypeLabel
                              ? catalog.catalogTypeLabel.split(',')[0].trim()
                              : toLabel(catalog.catalogType.split(',')[0].trim())}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-heading font-bold text-dark text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {catalog.title}
                      </h3>
                      <p className="text-dark/40 text-[11px] leading-relaxed mb-2 line-clamp-2 flex-1">
                        {catalog.description || 'Premium catalogue presentation.'}
                      </p>

                      {/* Metadata row */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {catalog.pageCount && (
                          <span className="text-[9px] font-medium text-dark/50 bg-dark/5 px-2 py-0.5 rounded">
                            {catalog.pageCount} pages
                          </span>
                        )}
                        {catalog.application && catalog.application.length > 0 && (
                          <span className="text-[9px] font-medium text-dark/50 bg-dark/5 px-2 py-0.5 rounded">
                            {catalog.application[0]}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {catalog.tags && catalog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {catalog.tags.slice(0, 4).map((tag: string) => {
                            const isMatch = searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase());
                            return (
                              <span key={tag}
                                className={`text-[9px] font-medium px-1.5 py-0.5 rounded transition-colors ${
                                  isMatch
                                    ? 'bg-primary/15 text-primary border border-primary/20'
                                    : 'bg-dark/5 text-dark/50'
                                }`}>
                                #{tag}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto border-t border-border/10 pt-3">
                        {catalog.pdfUrl ? (
                          <a
                            href={catalog.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-primary/15 hover:-translate-y-0.5"
                          >
                            👁 View PDF
                          </a>
                        ) : (
                          <button
                            onClick={() => alert('PDF coming soon. Please WhatsApp us to request this catalog.')}
                            className="flex-1 bg-dark/5 hover:bg-dark/10 text-dark/60 text-xs font-bold py-2.5 rounded-xl transition-all"
                          >
                            📋 Request PDF
                          </button>
                        )}
                        <a
                          href={catalogEnquiryWhatsApp({ title: catalog.title, id: catalog.id })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 text-white text-xs font-bold py-2.5 rounded-xl transition-all hover:brightness-105 hover:-translate-y-0.5 shadow-sm"
                          style={{ backgroundColor: '#25D366' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-surface rounded-3xl border border-border/40"
              >
                <div className="text-5xl mb-4">{searchQuery ? '🔍' : '📂'}</div>
                <h3 className="text-lg font-bold text-dark mb-1">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No catalogs in this category yet'}
                </h3>
                <p className="text-dark/40 text-xs mb-6">
                  {searchQuery
                    ? 'Try a different search term or clear your filters.'
                    : 'The admin can upload PDF catalogs under this category from the Admin Panel.'}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters}
                    className="bg-primary hover:brightness-110 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all">
                    Reset filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── WhatsApp CTA ── */}
        <div className="mt-16 bg-green-500/5 border border-green-500/10 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-500/5 rounded-full blur-xl" />
          <h3 className="font-heading font-black text-dark text-xl mb-2">
            Looking for something specific?
          </h3>
          <p className="text-dark/60 text-xs max-w-md mx-auto mb-6 leading-relaxed">
            Get direct personalized assistance. Contact us on WhatsApp for latest arrivals, custom sizes, stock queries, and custom pricing.
          </p>
          <a
            href="https://wa.me/919974142777?text=Hi! I want to inquire about catalogs and pricing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-md shadow-green-500/20 hover:-translate-y-0.5 text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Live Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default TilesCatalog;
