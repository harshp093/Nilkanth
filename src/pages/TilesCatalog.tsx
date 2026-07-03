import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseCatalogs } from '../hooks/useSupabaseProducts';
import type { CatalogType } from '../data/catalogs';
import { catalogEnquiryWhatsApp } from '../utils/whatsapp';

type MainTab = 'tiles' | 'sanitary' | 'artificial-stone';

const MAIN_TABS: { id: MainTab; label: string; icon: string; desc: string }[] = [
  { id: 'tiles', label: 'Tile Catalogs', icon: '🔲', desc: 'Floor, wall, bathroom, designer & vitrified tiles' },
  { id: 'sanitary', label: 'Sanitary Ware', icon: '🚿', desc: 'Water closets, basins, faucets & premium bath systems' },
  { id: 'artificial-stone', label: 'Artificial Stone', icon: '⚗️', desc: 'Engineered quartz slabs & artificial stones catalogs' },
];

const TILE_SUB_TABS: { id: CatalogType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tiles' },
  { id: 'floor-tiles', label: '🔲 Floor Tiles' },
  { id: 'wall-tiles', label: '🔳 Wall Tiles' },
  { id: 'bathroom-tiles', label: '🛁 Bathroom Tiles' },
  { id: 'designer-tiles', label: '🎨 Designer Tiles' },
  { id: 'vitrified', label: '✨ Vitrified Tiles' },
];

const TilesCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { catalogs, loading } = useSupabaseCatalogs();

  // Read primary tab from search params (e.g. ?tab=tile)
  const activeMainTab = useMemo<MainTab>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'sanitary') return 'sanitary';
    if (tab === 'artificial-stone' || tab === 'artificial') return 'artificial-stone';
    return 'tiles';
  }, [searchParams]);

  // Sub-tab state for tile filtration
  const [activeTileSubTab, setActiveTileSubTab] = useState<CatalogType | 'all'>('all');

  // Change tabs and sync query parameters
  const handleMainTabChange = (tabId: MainTab) => {
    setSearchParams({ tab: tabId === 'artificial-stone' ? 'artificial' : tabId });
    setActiveTileSubTab('all');
  };

  // Filter catalogs with 100% accuracy
  const filteredCatalogs = useMemo(() => {
    return catalogs.filter(c => {
      // Split comma-separated types in case of multiple types assigned to one catalog
      const assignedTypes = c.catalogType
        ? c.catalogType.split(',').map((s: string) => s.trim().toLowerCase())
        : [];

      if (activeMainTab === 'sanitary') {
        return assignedTypes.includes('sanitary');
      }
      if (activeMainTab === 'artificial-stone') {
        return assignedTypes.includes('artificial-stone');
      }
      // If active main tab is tiles, match if it contains any tiles catalog subtype
      const tileSubtypes = ['floor-tiles', 'wall-tiles', 'bathroom-tiles', 'designer-tiles', 'vitrified', 'tiles'];
      const hasTileType = assignedTypes.some(type => tileSubtypes.includes(type));
      if (!hasTileType) return false;

      if (activeTileSubTab === 'all') return true;
      return assignedTypes.includes(activeTileSubTab);
    });
  }, [catalogs, activeMainTab, activeTileSubTab]);

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-surface border-b border-border/40 py-8 transition-colors">
        {/* Glow Effects */}
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
            Get instant access to our comprehensive premium collection catalogs. Browse through design guides, size charts, and high-definition catalogs.
          </p>

          {/* Main Category Tabs */}
          <div className="flex flex-wrap gap-2.5 mt-8 border-b border-border/20 pb-0">
            {MAIN_TABS.map(tab => {
              const isActive = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleMainTabChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer -mb-px ${
                    isActive
                      ? 'border-primary text-primary font-black scale-[1.02]'
                      : 'border-transparent text-dark/60 hover:text-dark'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tiles Sub-categories Filtration */}
        {activeMainTab === 'tiles' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-4 mb-6 border-b border-border/20"
          >
            {TILE_SUB_TABS.map(subTab => {
              const isActive = activeTileSubTab === subTab.id;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setActiveTileSubTab(subTab.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-primary border-primary text-white shadow-sm shadow-primary/30'
                      : 'bg-surface border-border/40 text-dark/70 hover:text-dark hover:border-border'
                  }`}
                >
                  {subTab.label}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Info Box */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4 mb-8 flex items-start gap-4 shadow-sm">
          <span className="text-2xl mt-0.5">💡</span>
          <div>
            <h4 className="text-sm font-bold text-dark">Easy Selection & Enquiries</h4>
            <p className="text-xs text-dark/60 mt-1 leading-relaxed">
              Open the high-resolution PDF catalogs to browse detailed collections. You can click <strong>👁 View PDF</strong> to read or download, or click <strong>WhatsApp Inquiry</strong> to chat directly with our team about a specific catalogue.
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
            <p className="text-dark/50 text-xs font-medium mt-4">Syncing catalogs database...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredCatalogs.length > 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {filteredCatalogs.map((catalog, i) => (
                  <motion.div
                    layout
                    key={catalog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.4) }}
                    className="bg-surface rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-dark/5">
                        <img
                          src={catalog.thumbnailUrl}
                          alt={catalog.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">
                            {catalog.company}
                          </span>
                        </div>
                        {/* PDF Label */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                            📄 PDF
                          </span>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-dark text-sm mb-1 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                          {catalog.title}
                        </h3>
                        <p className="text-dark/40 text-[11px] leading-relaxed mb-3 line-clamp-2 h-8">
                          {catalog.description || 'Premium catalogue presentation.'}
                        </p>

                        {/* Tags */}
                        {catalog.tags && catalog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {catalog.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[9px] font-medium px-2 py-0.5 bg-dark/5 text-dark/60 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PDF Actions */}
                    <div className="p-4 pt-0 border-t border-border/10 mt-auto">
                      <div className="flex gap-2.5 pt-3">
                        {catalog.pdfUrl ? (
                          <a
                            href={catalog.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 text-center"
                          >
                            👁 View PDF
                          </a>
                        ) : (
                          <button
                            onClick={() => alert('PDF catalog will be available soon. Please click the WhatsApp button to request.')}
                            className="flex-1 bg-dark/5 hover:bg-dark/10 text-dark/60 text-xs font-bold py-2.5 rounded-xl transition-all"
                          >
                            📋 Request
                          </button>
                        )}
                        <a
                          href={catalogEnquiryWhatsApp({ title: catalog.title, id: catalog.id })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 text-white text-xs font-bold py-2.5 rounded-xl transition-all hover:brightness-105 hover:-translate-y-0.5 shadow-sm"
                          style={{ backgroundColor: '#25D366' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
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
                className="text-center py-24 bg-surface rounded-3xl border border-border/40 shadow-sm"
              >
                <div className="text-5xl mb-4">📂</div>
                <h3 className="text-lg font-bold text-dark mb-1">No catalogs found</h3>
                <p className="text-dark/40 text-xs mb-6">No premium catalogs are uploaded under this category yet.</p>
                <button
                  onClick={() => setActiveTileSubTab('all')}
                  className="bg-primary hover:brightness-110 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* WhatsApp Call To Action */}
        <div className="mt-16 bg-green-500/5 border border-green-500/10 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-500/5 rounded-full blur-xl" />
          <h3 className="font-heading font-black text-dark text-xl mb-2">
            Looking for something specific?
          </h3>
          <p className="text-dark/60 text-xs max-w-md mx-auto mb-6 leading-relaxed">
            Get direct personalized assistance. Contact us on WhatsApp for our latest arrivals, custom sizes, stock queries, and custom pricing plans.
          </p>
          <a
            href="https://wa.me/919974142777?text=Hi! I want to inquire about custom catalogs and pricing."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-md shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5 text-sm"
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
