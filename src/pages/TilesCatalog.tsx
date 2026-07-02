import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabaseCatalogs } from '../hooks/useSupabaseProducts';
import type { CatalogType } from '../data/catalogs';
import { catalogEnquiryWhatsApp } from '../utils/whatsapp';

const filterTabs: { id: CatalogType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Catalogs' },
  { id: 'floor-tiles', label: '🔲 Floor Tiles' },
  { id: 'wall-tiles', label: '🔳 Wall Tiles' },
  { id: 'bathroom-tiles', label: '🚿 Bathroom' },
  { id: 'designer-tiles', label: '🎨 Designer' },
  { id: 'vitrified', label: '✨ Vitrified' },
];

const TilesCatalog: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CatalogType | 'all'>('all');

  const { catalogs, loading } = useSupabaseCatalogs();

  const filteredCatalogs = catalogs.filter(c => {
    if (activeFilter === 'all') return true;
    return c.catalogType === activeFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Tiles Catalog</span>
          </nav>
          <h1 className="text-3xl font-heading font-black text-gray-900">🔲 Tiles Catalog</h1>
          <p className="text-gray-500 mt-1">
            Browse our complete ColorTiles collection — floor, wall, bathroom, designer & vitrified tiles
          </p>

          {/* Filter tabs — scrollable */}
          <div className="flex items-center gap-1 mt-5 overflow-x-auto scrollbar-none pb-0">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as CatalogType | 'all')}
                className={`shrink-0 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-blue-900">How to Order Tiles</p>
            <p className="text-sm text-blue-700 mt-1">
              Browse our PDF catalogs below. Click "View PDF" to open it directly in a custom viewer, or click "WA Enquiry" to inquire about specific catalogs.
            </p>
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 text-sm">Loading catalogs database...</p>
          </div>
        ) : (
             /* Catalog Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCatalogs.map((catalog, i) => (
              <motion.div
                key={catalog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden" style={{ height: '130px' }}>
                    <img
                      src={catalog.thumbnailUrl}
                      alt={catalog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {catalog.company}
                      </span>
                    </div>
                    {/* PDF badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        📄 PDF
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-heading font-bold text-gray-900 text-xs mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {catalog.title}
                    </h3>
                    <p className="text-gray-500 text-[10px] mb-2 line-clamp-1">{catalog.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {catalog.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="p-3 pt-0">
                  <div className="flex gap-2">
                    {catalog.pdfUrl ? (
                      <a
                        href={catalog.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary hover:bg-blue-900 text-white text-[11px] font-semibold py-2 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        👁 View PDF
                      </a>
                    ) : (
                      <button
                        onClick={() => alert('PDF will be available soon. Please contact us via WhatsApp for the catalog.')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-semibold py-2 rounded-lg transition-colors"
                      >
                        📋 Request
                      </button>
                    )}
                    <a
                      href={catalogEnquiryWhatsApp({ title: catalog.title, id: catalog.id })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 text-white text-[11px] font-semibold py-2 rounded-lg transition-colors"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Inquire
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No catalogs state */}
        {!loading && filteredCatalogs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-xl font-heading font-bold text-gray-700 mb-2">No catalogs found</h3>
            <p className="text-gray-400 text-sm mb-6">Try selecting a different category above.</p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <h3 className="font-heading font-bold text-green-900 text-xl mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-green-700 text-sm mb-5">
            Contact us on WhatsApp for our full tiles catalog, custom sizes, and bulk pricing.
          </p>
          <a
            href="https://wa.me/919974142777?text=Hi! I want to see the complete tiles catalog."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp for Full Catalog
          </a>
        </div>
      </div>
    </div>
  );
};

export default TilesCatalog;

