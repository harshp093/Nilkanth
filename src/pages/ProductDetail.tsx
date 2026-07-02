import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSupabaseProductDetail, useSupabaseProducts } from '../hooks/useSupabaseProducts';
import ProductCard from '../components/products/ProductCard';
import InquiryForm from '../components/inquiry/InquiryForm';
import { productEnquiryWhatsApp, shareProductWhatsApp, CALL_LINK } from '../utils/whatsapp';

const CATEGORY_LABELS: Record<string, string> = {
  marble: 'Marble',
  granite: 'Granite',
  stone: 'Stone',
  'adhesives-chemicals': 'Adhesives & Chemicals',
  'kota-others': 'Kota & Others',
  'sanitary-ware': 'Sanitary Ware',
  'tiles-catalog': 'Tiles',
};

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useSupabaseProductDetail(slug || '');
  const { products: relatedProducts } = useSupabaseProducts(product?.category);

  const [activeImage, setActiveImage] = React.useState(0);
  const [activeThickness, setActiveThickness] = React.useState<string | undefined>(undefined);
  const [activeFinish, setActiveFinish] = React.useState<string | undefined>(undefined);

  // Safely initialize options in the next tick to prevent render warnings
  React.useEffect(() => {
    if (product) {
      const t = product.thicknessOptions?.[0];
      const f = product.finishOptions?.[0];
      setTimeout(() => {
        setActiveImage(0);
        setActiveThickness(t);
        setActiveFinish(f);
      }, 0);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-center px-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-dark/60 text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-heading font-black text-dark mb-2">Product Not Found</h1>
          <p className="text-dark/50 mb-6 font-medium">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-accent px-6 py-2.5">Browse All Products</Link>
        </div>
      </div>
    );
  }

  const catLabel = CATEGORY_LABELS[product.category] || product.category;
  const waUrl = productEnquiryWhatsApp({
    name: product.name,
    slug: product.slug,
    category: catLabel,
    priceRange: product.priceRange,
  });
  const shareUrl = shareProductWhatsApp({ name: product.name, slug: product.slug });
  const related = (relatedProducts || []).filter(p => p.id !== product.id).slice(0, 4);

  const allImages = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&q=80',
  ];

  const handlePrevImage = () => {
    setActiveImage(curr => (curr - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = () => {
    setActiveImage(curr => (curr + 1) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border/30 py-3 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-dark/50">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>›</span>
            <Link to={product.category === 'kota-others' ? '/kota-stone' : `/${product.category}`} className="hover:text-primary transition-colors capitalize">
              {catLabel}
            </Link>
            <span>›</span>
            <span className="text-dark font-bold truncate max-w-48">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">

          {/* LEFT — Dynamic Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Viewport */}
            <div className="relative bg-surface rounded-2xl overflow-hidden border border-border/40 shadow-sm aspect-[4/3] group transition-colors">
              <img
                src={allImages[activeImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&q=80';
                }}
              />

              {/* Featured Badge */}
              {product.isFeatured && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-accent text-white text-[10px] font-black tracking-wider px-3 py-1 rounded-full shadow-md">★ Featured</span>
                </div>
              )}

              {/* Number notation overlay [ 2 / 5 ] */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg z-10 font-mono">
                {activeImage + 1} / {allImages.length}
              </div>

              {/* Slide Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer text-sm font-bold z-10 shadow-md"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer text-sm font-bold z-10 shadow-md"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 pt-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-surface ${activeImage === i ? 'border-primary scale-[1.03] shadow-md' : 'border-border/40 hover:border-dark/30'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=100&q=60';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Share via WhatsApp */}
            <div className="pt-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-dark/50 hover:text-green-500 font-bold transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Share details with WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT — Product Information */}
          <div className="mt-8 lg:mt-0 space-y-6">
            {/* Category Badging */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge bg-primary text-white text-[10px] font-bold py-1 px-2.5 rounded-xl uppercase tracking-wider">{catLabel}</span>
              {product.subcategory && (
                <span className="badge bg-[#C8962E]/15 text-[#C8962E] text-[10px] font-bold py-1 px-2.5 rounded-xl capitalize tracking-wider">{product.subcategory.replace(/-/g, ' ')}</span>
              )}
              {product.brand && (
                <span className="badge bg-border/40 text-dark/70 text-[10px] font-bold py-1 px-2.5 rounded-xl">{product.brand}</span>
              )}
            </div>

            {/* Title / Name */}
            <div>
              <h1 className="font-heading font-black text-dark leading-tight" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                {product.name}
              </h1>
              {product.origin && (
                <p className="text-dark/50 text-xs font-semibold mt-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8962E" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  Origin: <strong className="text-dark font-extrabold">{product.origin}</strong>
                </p>
              )}
            </div>

            {/* Price Box */}
            {product.priceRange && (
              <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4 shadow-sm transition-colors">
                <span className="text-[10px] text-dark/40 uppercase tracking-widest font-black">Estimated Price</span>
                <p className="text-primary font-heading font-black text-3xl mt-1 leading-none">{product.priceRange}</p>
                <p className="text-dark/40 text-[11px] font-medium mt-2">*Rates depend on dimensions, finishes & order volumes. Contact showroom.</p>
              </div>
            )}

            {/* Specifications Blocks */}
            <div className="space-y-4">
              {/* Thickness Options */}
              {product.thicknessOptions && product.thicknessOptions.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-dark/50 uppercase tracking-wider mb-2 block">
                    Thickness Options: <span className="text-primary font-bold">{activeThickness}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.thicknessOptions.map(t => (
                      <button
                        key={t}
                        onClick={() => setActiveThickness(t)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${activeThickness === t
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'border-border/60 text-dark/70 hover:border-primary hover:text-primary bg-surface'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Finish Options */}
              {product.finishOptions && product.finishOptions.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-dark/50 uppercase tracking-wider mb-2 block">
                    Surface Finishes: <span className="text-primary font-bold">{activeFinish}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.finishOptions.map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveFinish(f)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${activeFinish === f
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'border-border/60 text-dark/70 hover:border-primary hover:text-primary bg-surface'
                          }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.sizeOptions && product.sizeOptions.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-dark/50 uppercase tracking-wider mb-2 block">Available Formats / Sizes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizeOptions.map(s => (
                      <span key={s} className="px-3.5 py-1.5 bg-surface rounded-xl border border-border/50 text-xs font-bold text-dark/70">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* COLOR SWATCHES SYNCED WITH SLIDES */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-dark/50 uppercase tracking-wider mb-2 block">Available Color Options:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveImage(Math.min(i, allImages.length - 1));
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${activeImage === i
                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                            : 'border-border/60 text-dark/70 bg-surface hover:border-primary/40'
                          }`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-sm" style={{ backgroundColor: c }} />
                        <span>{product.colorNames?.[i] || c}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-dark/30 font-semibold mt-1.5">*Selecting color switches the preview slideshow</p>
                </div>
              )}

              {/* Applications */}
              {product.application && product.application.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-dark/50 uppercase tracking-wider mb-2 block">Recommended Applications:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.application.map(a => (
                      <span key={a} className="text-[11px] font-bold px-3 py-1.5 bg-primary/10 text-primary rounded-xl transition-colors">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description Text */}
            {product.description && (
              <div className="pt-2 border-t border-border/30">
                <span className="text-xs font-bold text-dark/50 uppercase tracking-wider mb-2.5 block">Product Profile:</span>
                <p className="text-dark/70 text-sm leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-border/30">
              <a
                href={CALL_LINK}
                className="w-full btn-primary justify-center py-3.5 text-sm font-bold shadow-lg"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.57 4.5 2 2 0 0 1 3.56 2.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Office: +91 99741 42777
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-wa justify-center py-3.5 text-sm font-bold shadow-lg text-white"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Product Inquiry
              </a>
            </div>
          </div>
        </div>

        {/* ── Inquiry Form ── */}
        <div className="mt-16">
          <h2 className="text-xl font-heading font-black text-dark mb-2">Detailed Inquiry Form</h2>
          <div className="section-divider mb-6" />
          <div className="max-w-2xl bg-surface rounded-2xl border border-border/40 p-6 md:p-8 shadow-sm transition-colors">
            <InquiryForm
              productName={product.name}
              productSlug={product.slug}
            />
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-heading font-black text-dark mb-2 animate-pulse">Related Recommendations</h2>
            <div className="section-divider mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} compact={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border/40 p-3 flex gap-2 md:hidden z-40 transition-colors" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <a href={CALL_LINK} className="flex-1 btn-primary justify-center py-3 text-sm font-bold shadow-sm">
          📞 Call
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-white flex items-center justify-center gap-1.5 rounded-xl text-sm font-bold shadow-sm"
          style={{ backgroundColor: '#25D366' }}
        >
          💬 WhatsApp
        </a>
      </div>
      {/* Spacer for mobile sticky bar */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default ProductDetail;
