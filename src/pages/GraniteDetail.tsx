import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getGraniteById, getGraniteVariants } from '../data/mockDb';
import useSEO from '../hooks/useSEO';
import {
  IconMapPin,
  IconRuler,
  IconSparkles,
  IconCheck,
  IconX,
  IconMessageCircle,
  IconLeaf,
  IconAtom,
  IconHome,
  IconBuildingSkyscraper,
} from '@tabler/icons-react';

const USAGE_ICONS: Record<string, React.ReactNode> = {
  countertop: <IconRuler size={16} />,
  floor: <IconHome size={16} />,
  wall: <IconBuildingSkyscraper size={16} />,
  bathroom: <IconSparkles size={16} />,
  outdoor: <IconLeaf size={16} />,
  feature: <IconSparkles size={16} />,
  vanity: <IconSparkles size={16} />,
};

const GraniteDetail: React.FC = () => {
  const { stoneId } = useParams<{ stoneId: string }>();
  const navigate = useNavigate();
  const granite = stoneId ? getGraniteById(stoneId) : null;
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeFinish, setActiveFinish] = useState(granite?.finishes[0] ?? 'Polished');

  // Related stones — same subcategory, different id
  const allGranite = getGraniteVariants();
  const related = allGranite
    .filter(g => g.subcategory === granite?.subcategory && g.id !== stoneId)
    .slice(0, 4);

  useSEO({
    title: granite
      ? `${granite.name} — ${granite.subcategory === 'natural-stone' ? 'Natural' : 'Artificial'} Stone | Nilkanth Marble`
      : 'Stone Detail | Nilkanth Marble',
    description: granite?.description ?? '',
    keywords: `${granite?.name} granite price, ${granite?.name} Nadiad, buy granite Gujarat`,
    url: `/granite/${stoneId}`,
  });

  if (!granite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-dark mb-4">Stone not found</h2>
          <button onClick={() => navigate('/granite')} className="btn-primary">Browse All Granite</button>
        </div>
      </div>
    );
  }

  const isNatural = granite.subcategory === 'natural-stone';

  return (
    <div className="bg-light min-h-screen pb-20">
      {/* ── Breadcrumb ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/granite" className="hover:text-primary transition-colors">Granite</Link>
            <span>›</span>
            <Link
              to={`/granite?type=${granite.subcategory}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {isNatural ? 'Natural Stone' : 'Artificial Stone'}
            </Link>
            <span>›</span>
            <span className="text-stone-900 font-semibold">{granite.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-16">
          <div className="flex flex-col lg:flex-row">
            {/* ── Image Panel ────────────────────────────────────────────────── */}
            <div className="lg:w-1/2 relative bg-gray-100 min-h-[500px]">
              <img
                src={granite.imageUrl}
                alt={granite.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subcategory badge */}
              <div className="absolute top-6 left-6">
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md ${
                  isNatural
                    ? 'bg-stone-800 text-amber-400'
                    : 'bg-blue-900 text-blue-200'
                }`}>
                  {isNatural ? <IconLeaf size={13} /> : <IconAtom size={13} />}
                  {isNatural ? 'Natural Stone' : 'Artificial Stone'}
                </span>
              </div>

              {/* Tag */}
              {granite.tag && (
                <div className="absolute top-6 right-6">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400 text-stone-900 uppercase tracking-wide shadow-sm">
                    {granite.tag}
                  </span>
                </div>
              )}

              {/* Colour swatch + name */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: granite.swatchColor }}
                />
                <div>
                  <p className="text-white font-semibold text-sm">{granite.color}</p>
                  <p className="text-white/60 text-xs">Colour Reference</p>
                </div>
              </div>
            </div>

            {/* ── Info Panel ─────────────────────────────────────────────────── */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 mb-2">
                {granite.name}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 mb-6">
                <IconMapPin size={16} className="text-primary flex-shrink-0" />
                <span>{granite.origin}</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">{granite.description}</p>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 rounded-2xl p-5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Thickness</p>
                  <p className="font-bold text-stone-900">{granite.thickness}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Available Sizes</p>
                  <p className="font-bold text-stone-900 text-sm">{granite.sizes[0]}</p>
                  {granite.sizes.length > 1 && (
                    <p className="text-xs text-gray-500">+{granite.sizes.length - 1} more options</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Est. Price</p>
                  <p className="font-bold text-primary">
                    {granite.pricePerSqFt ?? granite.priceLabel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Stone Type</p>
                  <p className="font-bold text-stone-900">{isNatural ? 'Natural Granite' : 'Engineered Quartz'}</p>
                </div>
              </div>

              {/* Finishes selector */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Available Finishes</p>
                <div className="flex flex-wrap gap-2">
                  {granite.finishes.map(finish => (
                    <button
                      key={finish}
                      onClick={() => setActiveFinish(finish)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        activeFinish === finish
                          ? 'bg-stone-950 text-white border-stone-950'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-stone-400'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage chips */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Suitable For</p>
                <div className="flex flex-wrap gap-2">
                  {granite.usage.map(u => (
                    <span key={u} className="flex items-center gap-1.5 text-sm bg-stone-50 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-full capitalize">
                      {USAGE_ICONS[u] ?? <IconCheck size={14} />}
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-auto flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="flex-1 bg-stone-950 hover:bg-primary text-white font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 text-center"
                >
                  Send Enquiry
                </button>
                <a
                  href={`https://wa.me/919408461000?text=Hi, I am interested in ${granite.name} (${activeFinish} finish). Please share pricing and slab availability.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <IconMessageCircle size={20} />
                  WhatsApp for Price
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Available Sizes ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-16">
          <h3 className="text-xl font-heading font-bold text-stone-900 mb-6">Available Slab Sizes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {granite.sizes.map(size => (
              <div key={size} className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-100">
                <IconRuler size={20} className="text-stone-400 mx-auto mb-2" />
                <p className="font-bold text-stone-900 text-sm">{size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related Stones ──────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <div>
            <h3 className="text-2xl font-heading font-bold text-stone-900 mb-8">
              More {isNatural ? 'Natural Stone' : 'Artificial Stone'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/granite/${rel.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={rel.imageUrl}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute bottom-3 left-3 w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: rel.swatchColor }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-stone-900 group-hover:text-primary transition-colors">{rel.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <IconMapPin size={12} className="text-primary" />
                      {rel.origin}
                    </p>
                    {rel.pricePerSqFt && (
                      <p className="text-xs text-primary font-semibold mt-2">{rel.pricePerSqFt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Enquiry Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {enquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm"
              onClick={() => setEnquiryOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
            >
              <div className="bg-stone-950 p-5 flex items-center justify-between border-b-4 border-primary">
                <h3 className="font-heading font-bold text-white text-xl">Enquire About Stone</h3>
                <button onClick={() => setEnquiryOpen(false)} className="text-gray-400 hover:text-white">
                  <IconX size={22} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-4 mb-5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: granite.swatchColor }}
                  />
                  <div>
                    <p className="font-bold text-stone-900">{granite.name}</p>
                    <p className="text-sm text-gray-500">{activeFinish} · {isNatural ? 'Natural' : 'Artificial'} Stone</p>
                  </div>
                </div>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thank you for your enquiry! Our team will contact you shortly with pricing and availability.');
                    setEnquiryOpen(false);
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Ramesh Patel" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area Required (in sq ft)</label>
                    <input type="number" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="e.g. 250" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows={3} className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Application area, delivery location, budget range..." />
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all">
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GraniteDetail;
