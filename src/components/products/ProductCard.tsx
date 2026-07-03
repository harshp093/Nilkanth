import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NProduct } from '../../data/products';
import { productEnquiryWhatsApp, catalogEnquiryWhatsApp, CALL_LINK } from '../../utils/whatsapp';

interface ProductCardProps {
  product: NProduct;
  compact?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  marble: 'Marble',
  granite: 'Granite',
  'kota-stone': 'Kota Stone',
  'kota-others': 'Kota Stone',
  'cladding-stone': 'Natural Cladding Stone',
  'adhesives-chemicals': 'Chemicals',
};

const CATEGORY_COLORS: Record<string, string> = {
  marble: '#1C3A6B',
  granite: '#374151',
  'kota-stone': '#C8962E',
  'kota-others': '#C8962E',
  'cladding-stone': '#78350f',
  'adhesives-chemicals': '#059669',
};

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const isCatalog = !!product.isCatalog;
  const primaryImage = product.images[0] || '/marble-calacatta.png';
  const catColor = isCatalog ? '#ef4444' : (CATEGORY_COLORS[product.category] || '#1C3A6B');
  const catLabel = isCatalog ? (product.brand || 'CATALOG') : (CATEGORY_LABELS[product.category] || product.category);

  const waUrl = isCatalog
    ? catalogEnquiryWhatsApp({ title: product.name, id: product.id })
    : productEnquiryWhatsApp({
        name: product.name,
        slug: product.slug,
        category: catLabel,
        priceRange: product.priceRange,
      });

  const handleCardClick = () => {
    if (isCatalog && product.pdfUrl) {
      window.open(product.pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/products/${product.slug}`);
    }
  };

  return (
    <motion.div
      className="product-card group relative bg-surface border border-border/40 rounded-xl overflow-hidden flex flex-col transition-colors duration-200 shadow-sm"
      whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden cursor-pointer bg-bg"
        style={{ height: compact ? '135px' : '175px' }}
        onClick={handleCardClick}
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&q=80';
          }}
        />

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-accent text-white text-[9px] font-black tracking-wider px-2 py-0.5 rounded shadow-sm">
              {isCatalog ? '★ FEATURED CATALOG' : '★ FEATURED'}
            </span>
          </div>
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            className="bg-white text-primary text-xs font-bold px-3.5 py-1.5 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg"
          >
            {isCatalog ? '👁 View PDF →' : 'Quick View →'}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col flex-1 min-w-0 bg-surface transition-colors">
        {/* Category & Subcategory Badge */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap min-w-0">
          <span
            className="text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider"
            style={{ backgroundColor: catColor }}
          >
            {catLabel}
          </span>
          {product.subcategory && (
            <span className="text-dark/40 text-[9px] font-semibold truncate uppercase tracking-wider">
              {product.subcategory.replace(/-/g, ' ')}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3
          className="font-heading font-extrabold text-dark line-clamp-2 cursor-pointer hover:text-primary transition-colors flex-1"
          style={{ fontSize: compact ? '12px' : '13.5px', lineHeight: '1.3' }}
          onClick={handleCardClick}
        >
          {product.name}
        </h3>

        {/* Color Swatch Dots */}
        {!isCatalog && product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            {product.colors.slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-border/40 shadow-sm"
                style={{ backgroundColor: color }}
                title={product.colorNames?.[i] || color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-dark/30 text-[9px] font-bold">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Product Details (Price & Origin) */}
        <div className="mt-2 space-y-0.5">
          {isCatalog ? (
            <>
              <p className="text-red-500 font-bold" style={{ fontSize: compact ? '11px' : '12px' }}>
                📄 PDF Catalog Document
              </p>
              <p className="text-dark/40" style={{ fontSize: '9px' }}>
                📥 View & Download
              </p>
            </>
          ) : (
            <>
              {product.priceRange && (
                <p className="text-primary font-bold" style={{ fontSize: compact ? '11px' : '12px' }}>
                  {product.priceRange}
                </p>
              )}
              {product.origin && (
                <p className="text-dark/40" style={{ fontSize: '9px' }}>
                  📍 {product.origin}
                </p>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 mt-3.5 pt-2 border-t border-border/30">
          <a
            href={CALL_LINK}
            onClick={(e) => e.stopPropagation()}
            title="Call Showroom"
            className="flex-1 flex items-center justify-center gap-1 bg-primary hover:brightness-110 text-white rounded-lg transition-colors py-1.5"
            style={{ fontSize: '9px', fontWeight: 700 }}
          >
            Call
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="WhatsApp Inquiry"
            className="flex-1 flex items-center justify-center gap-1 text-white bg-wa-green hover:brightness-110 rounded-lg transition-colors py-1.5"
            style={{ fontSize: '9px', fontWeight: 700 }}
          >
            WA
          </a>
          <button
            onClick={handleCardClick}
            title={isCatalog ? "Open PDF Document" : "View Product Page"}
            className="flex items-center justify-center bg-bg hover:bg-primary/10 text-dark/70 hover:text-primary rounded-lg transition-colors p-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {isCatalog ? (
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />
              ) : (
                <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
              )}
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
