import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTileCollectionById, getBrandById } from '../data/mockDb';
import type { TileVariant } from '../data/mockDb';
import useSEO from '../hooks/useSEO';
import {
  IconRuler,
  IconLayersIntersect,
  IconSparkles,
  IconX,
  IconMessageCircle,
  IconChevronRight,
  IconChevronLeft,
} from '@tabler/icons-react';

const TileCollectionDetail: React.FC = () => {
  const { brandId, collectionId } = useParams<{ brandId: string; collectionId: string }>();
  const navigate = useNavigate();
  const collection = collectionId ? getTileCollectionById(collectionId) : null;
  const brand = brandId ? getBrandById(brandId) : null;
  
  const [selectedSurfaces, setSelectedSurfaces] = useState<Record<string, string>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxTab, setLightboxTab] = useState<'high-gloss' | 'high-gloss-sinker'>('high-gloss');
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useSEO({
    title: collection ? `${collection.name} Tiles by ${brand?.name} | Nilkanth Marble` : 'Tile Collection',
    description: collection?.description ?? '',
    url: `/tiles/${brandId}/${collectionId}`,
  });

  if (!collection || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-dark mb-4">Collection not found</h2>
          <button onClick={() => navigate('/tiles')} className="btn-primary">Back to Tiles</button>
        </div>
      </div>
    );
  }

  const handleSurfaceToggle = (variantId: string, surface: string) => {
    setSelectedSurfaces(prev => ({
      ...prev,
      [variantId]: surface
    }));
  };

  const getActiveSurface = (variant: TileVariant) => {
    return selectedSurfaces[variant.id] || variant.surfaces[0];
  };

  const activeVariant = lightboxIndex !== null ? collection.variants[lightboxIndex] : null;

  return (
    <div className="bg-light min-h-screen pb-20">
      {/* ── Breadcrumb ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/tiles" className="hover:text-primary transition-colors">Tiles</Link>
            <span>›</span>
            <span className="text-stone-900 font-semibold">{collection.name}</span>
          </div>
        </div>
      </div>

      {/* ── Collection Header ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-stone-950 rounded-3xl overflow-hidden relative shadow-2xl mb-12 text-white">
          <div className="absolute inset-0">
            <img src={collection.coverImage} alt={collection.name} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          </div>
          <div className="relative z-10 p-10 lg:p-16 max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary/20 border border-primary/50 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
                {brand.name}
              </span>
              <span className="bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
                {collection.tagline}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-heading font-black mb-6 leading-tight">
              {collection.name}
            </h1>
            <p className="text-stone-300 text-lg lg:text-xl leading-relaxed mb-8">
              {collection.description}
            </p>
            <div className="flex flex-wrap gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 text-stone-300">
                <IconRuler size={20} className="text-primary" />
                <span>Size: <strong className="text-white">{collection.size}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <IconLayersIntersect size={20} className="text-primary" />
                <span>Finishes: <strong className="text-white">{collection.finish.join(', ')}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <IconSparkles size={20} className="text-primary" />
                <span>Variants: <strong className="text-white">{collection.variants.length}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Variant Grid (PDF Style) ────────────────────────────────────────── */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-stone-900">Available Varieties</h2>
          <span className="text-sm text-gray-500 font-medium">Click on any tile to enlarge</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collection.variants.map((variant, index) => {
            const activeSurface = getActiveSurface(variant);
            const displayImage = activeSurface === 'High Gloss Sinker' && variant.imageHighGlossSinker 
              ? variant.imageHighGlossSinker 
              : variant.imageHighGloss;

            return (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col group"
              >
                {/* Tile Image Preview */}
                <div 
                  className="relative h-64 bg-gray-100 cursor-pointer overflow-hidden"
                  onClick={() => setLightboxIndex(index)}
                >
                  <motion.img
                    src={displayImage}
                    alt={variant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm text-stone-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                      <IconSparkles size={20} />
                    </div>
                  </div>
                  
                  {/* Pattern Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-stone-950/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md border border-white/10 shadow-sm">
                      {variant.patterns}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-stone-900 mb-1 leading-tight">
                        {variant.name}
                      </h3>
                      <p className="text-xs text-gray-500">{variant.colorDescription}</p>
                    </div>
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0 shadow-inner"
                      style={{ backgroundColor: variant.swatchColor }}
                      title={`Colour Reference: ${variant.swatchColor}`}
                    />
                  </div>

                  {/* Surface Toggles */}
                  {variant.surfaces.length > 1 && (
                    <div className="mt-2 bg-gray-50 p-1.5 rounded-lg flex mb-4 border border-gray-100">
                      {variant.surfaces.map(surface => (
                        <button
                          key={surface}
                          onClick={() => handleSurfaceToggle(variant.id, surface)}
                          className={`flex-1 text-[11px] font-bold uppercase tracking-wider py-1.5 rounded-md transition-colors ${
                            activeSurface === surface
                              ? 'bg-white text-stone-900 shadow-sm border border-gray-200'
                              : 'text-gray-400 hover:text-stone-600'
                          }`}
                        >
                          {surface.replace('High Gloss ', 'HG ')}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-primary font-bold text-sm">{variant.priceLabel}</span>
                    <a
                      href={`https://wa.me/919408461000?text=Hi, I am interested in the ${brand.name} ${collection.name} tile: ${variant.name} (${activeSurface}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-emerald-500 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg"
                    >
                      <IconMessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Lightbox Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && activeVariant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/95 backdrop-blur-md"
              onClick={() => setLightboxIndex(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] z-10"
            >
              {/* Image Area */}
              <div className="md:w-2/3 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                <img 
                  src={lightboxTab === 'high-gloss' ? activeVariant.imageHighGloss : (activeVariant.imageHighGlossSinker || activeVariant.imageHighGloss)} 
                  alt={activeVariant.name}
                  className="max-w-full max-h-full object-contain p-4"
                />
                
                {/* Surface Toggle Tabs inside image area */}
                {activeVariant.surfaces.includes('High Gloss Sinker') && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-lg flex gap-1 border border-white/20">
                    <button
                      onClick={() => setLightboxTab('high-gloss')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                        lightboxTab === 'high-gloss' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      High Gloss
                    </button>
                    <button
                      onClick={() => setLightboxTab('high-gloss-sinker')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                        lightboxTab === 'high-gloss-sinker' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      High Gloss Sinker
                    </button>
                  </div>
                )}

                {/* Nav Arrows */}
                <button 
                  onClick={() => setLightboxIndex(prev => prev! > 0 ? prev! - 1 : collection.variants.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-900 shadow-md hover:bg-white transition-colors"
                >
                  <IconChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setLightboxIndex(prev => prev! < collection.variants.length - 1 ? prev! + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-900 shadow-md hover:bg-white transition-colors"
                >
                  <IconChevronRight size={24} />
                </button>
              </div>

              {/* Info Area */}
              <div className="md:w-1/3 p-6 md:p-8 flex flex-col bg-white overflow-y-auto">
                <button 
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-stone-900 transition-colors z-20 bg-white/80 rounded-full p-1"
                >
                  <IconX size={24} />
                </button>

                <div className="mb-6">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">{collection.name}</span>
                  <h2 className="text-3xl font-heading font-bold text-stone-900 mt-1 mb-2">{activeVariant.name}</h2>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: activeVariant.swatchColor }} />
                    {activeVariant.colorDescription}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500 text-sm">Size</span>
                    <span className="font-semibold text-stone-900">{collection.size}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500 text-sm">Available Surfaces</span>
                    <span className="font-semibold text-stone-900 text-right">{activeVariant.surfaces.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500 text-sm">Pattern Variation</span>
                    <span className="font-semibold text-stone-900">{activeVariant.patterns}</span>
                  </div>
                  <div className="flex justify-between pb-3">
                    <span className="text-gray-500 text-sm">Est. Price</span>
                    <span className="font-bold text-primary">{activeVariant.priceLabel}</span>
                  </div>
                </div>

                {!enquiryOpen ? (
                  <div className="mt-auto flex flex-col gap-3">
                    <button 
                      onClick={() => setEnquiryOpen(true)}
                      className="w-full bg-stone-950 hover:bg-stone-800 text-white font-bold py-4 rounded-xl transition-colors"
                    >
                      Enquire Now
                    </button>
                    <a
                      href={`https://wa.me/919408461000?text=Hi, I want to know the price for ${activeVariant.name} tile (${collection.name}, ${brand.name}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <IconMessageCircle size={20} />
                      WhatsApp
                    </a>
                  </div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-auto space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100"
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert('Enquiry sent!');
                      setEnquiryOpen(false);
                    }}
                  >
                    <h4 className="font-bold text-stone-900 mb-2">Request Quote</h4>
                    <input required type="text" placeholder="Name" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-primary" />
                    <input required type="tel" placeholder="Phone" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-primary" />
                    <input type="number" placeholder="Approx Sq Ft (Optional)" className="w-full p-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-primary" />
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setEnquiryOpen(false)} className="flex-1 bg-white border border-gray-300 text-stone-600 py-2.5 rounded-lg font-bold text-sm">Cancel</button>
                      <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg font-bold text-sm">Send</button>
                    </div>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TileCollectionDetail;
