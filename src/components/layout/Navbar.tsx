import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseCategories } from '../../hooks/useSupabaseProducts';

const PHONE = '+91 94084 61000';
const WA_NUMBER = '919974142777';
const EMAIL = 'nilkanth1marble@gmail.com';

// Static fallback product categories grouped
const staticProductCategories = [
  { id: 'marble', slug: 'marble', name: 'Marble', desc: 'Premium Italian & Indian marble', emoji: '🪨', route: '/marble', group: 'Natural Stone' },
  { id: 'granite', slug: 'granite', name: 'Granite', desc: 'Natural granite slabs', emoji: '⬛', route: '/granite', group: 'Natural Stone' },
  { id: 'kota-stone', slug: 'kota-stone', name: 'Kota Stone', desc: 'Kota stone & outdoor flooring', emoji: '🟫', route: '/kota-stone', group: 'Natural Stone' },
  { id: 'cladding-stone', slug: 'cladding-stone', name: 'Natural Cladding Stone', desc: 'Wall cladding & roofing slate', emoji: '🧱', route: '/category/cladding-stone', group: 'Natural Stone' },
  { id: 'adhesives-chemicals', slug: 'adhesives-chemicals', name: 'Chemicals', desc: 'Tile adhesives & construction chemicals', emoji: '🧪', route: '/adhesives-chemicals', group: 'Chemicals' },
];

const pdfCatalogsDropdown = [
  { to: '/catalogs?tab=tile', label: 'Tile Catalogs', desc: 'Floor, wall, bathroom & designer tiles', icon: '🔲' },
  { to: '/catalogs?tab=sanitary', label: 'Sanitary Ware Catalogs', desc: 'Closets, basins, faucets & showers', icon: '🚿' },
  { to: '/catalogs?tab=artificial-stone', label: 'Artificial Stone Catalogs', desc: 'Quartz & engineered stone catalogs', icon: '⚗️' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [catalogsOpen, setCatalogsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileCatalogsOpen, setMobileCatalogsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const catalogsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { categories } = useSupabaseCategories();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdowns click outside listeners
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
      if (catalogsRef.current && !catalogsRef.current.contains(e.target as Node)) {
        setCatalogsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change — deferred to avoid render warnings
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      setProductsOpen(false);
      setCatalogsOpen(false);
      setMobileProductsOpen(false);
      setMobileCatalogsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Force light mode on mount
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  // Compute products list grouped by group
  const groupedProducts = useMemo(() => {
    const list = categories.length > 0 ? categories.map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      desc: c.description,
      emoji: c.emoji || '🪨',
      route: c.route || `/category/${c.slug}`,
      group: c.groupName || (['marble', 'granite', 'kota-stone', 'cladding-stone'].includes(c.id) ? 'Natural Stone' : (c.id === 'adhesives-chemicals' ? 'Chemicals' : 'Other')),
    })) : staticProductCategories;

    const groups: Record<string, typeof list> = {};
    list.forEach(c => {
      const g = c.group || 'Natural Stone';
      if (!groups[g]) groups[g] = [];
      groups[g].push(c);
    });
    return groups;
  }, [categories]);

  const isProductsActive = ['/marble', '/granite', '/kota-stone', '/cladding-stone', '/products', '/category'].some(
    p => location.pathname.startsWith(p)
  );

  const isCatalogsActive = ['/tiles-catalog', '/catalogs'].some(
    p => location.pathname.startsWith(p)
  );

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="bg-primary text-white text-xs py-2 px-4 hidden md:block border-b border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`tel:+919408461000`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 12a19.79 19.79 0 01-3-8.58A2 2 0 012.5 1.5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.78-1.78a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {EMAIL}
            </a>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Nilkanth Marble! I would like to enquire about your products.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-wa-green hover:brightness-110 px-3 py-1 rounded text-white font-medium transition-all text-[11px]"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <motion.nav
        className={`sticky top-0 z-50 bg-surface transition-colors duration-300 ${
          scrolled ? 'shadow-md border-b border-border/80' : 'border-b border-border/30'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Nilkanth Marble Home">
              {/* Gold brand icon */}
              <div className="relative w-10 h-10 shrink-0">
                <img
                  src="/logo-icon.png"
                  alt="Nilkanth Marble logo icon"
                  className="w-full h-full object-contain drop-shadow-sm"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              {/* Brand text */}
              <div className="flex flex-col leading-none">
                <span
                  className="font-heading font-black text-dark text-[17px] tracking-[-0.02em] group-hover:text-primary transition-colors duration-200"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Nilkanth
                </span>
                <div className="w-full h-[1px] bg-gradient-to-r from-accent/60 to-transparent my-[2px]" />
                <span
                  className="text-accent font-black text-[9px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.35em' }}
                >
                  MARBLE
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-primary bg-primary/10'
                    : 'text-dark/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                Home
              </Link>

              {/* Products Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => { setProductsOpen(!productsOpen); setCatalogsOpen(false); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isProductsActive
                      ? 'text-primary bg-primary/10'
                      : 'text-dark/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  Products
                  <motion.svg
                    animate={{ rotate: productsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="py-2 max-h-[80vh] overflow-y-auto">
                        <Link
                          to="/products"
                          onClick={() => setProductsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors border-b border-border/40"
                        >
                          <span>🛍️</span>
                          <span>All Products</span>
                        </Link>
                        {Object.entries(groupedProducts).map(([groupName, items]) => (
                          <div key={groupName} className="mt-2 first:mt-0">
                            <div className="px-4 py-1 text-[9px] font-bold uppercase tracking-wider text-dark/40 bg-dark/2">
                              {groupName}
                            </div>
                            {items.map(item => (
                              <Link
                                key={item.id}
                                to={item.route}
                                onClick={() => setProductsOpen(false)}
                                className="flex items-start gap-3 px-4 py-2 hover:bg-primary/5 transition-colors group/item"
                              >
                                <span className="mt-0.5 text-sm group-hover/item:scale-110 transition-transform">{item.emoji}</span>
                                <div>
                                  <p className="text-xs font-semibold text-dark group-hover/item:text-primary transition-colors">{item.name}</p>
                                  <p className="text-[10px] text-dark/40 line-clamp-1 mt-0.5">{item.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PDF Catalogs Dropdown */}
              <div ref={catalogsRef} className="relative">
                <button
                  onClick={() => { setCatalogsOpen(!catalogsOpen); setProductsOpen(false); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCatalogsActive
                      ? 'text-primary bg-primary/10'
                      : 'text-dark/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  PDF Catalogs
                  <motion.svg
                    animate={{ rotate: catalogsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {catalogsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <Link
                          to="/catalogs"
                          onClick={() => setCatalogsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors border-b border-border/40"
                        >
                          <span>📁</span>
                          <span>All PDF Catalogs</span>
                        </Link>
                        {pdfCatalogsDropdown.map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setCatalogsOpen(false)}
                            className="flex items-start gap-3 px-4 py-2 hover:bg-primary/5 transition-colors group/item"
                          >
                            <span className="mt-0.5 text-sm group-hover/item:scale-110 transition-transform">{item.icon}</span>
                            <div>
                              <p className="text-xs font-semibold text-dark group-hover/item:text-primary transition-colors">{item.label}</p>
                              <p className="text-[10px] text-dark/40 mt-0.5 leading-snug">{item.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/10'
                      : 'text-dark/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* CTA Buttons */}
              <div className="flex items-center gap-2 ml-3">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi! I want to enquire about your products.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  WhatsApp
                </a>
                <a
                  href="tel:+919408461000"
                  className="flex items-center gap-1.5 bg-primary hover:brightness-110 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1 md:hidden">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-dark/70 hover:bg-primary/5 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.svg
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden border-t border-border/40 bg-surface"
            >
              <div className="px-4 py-3 space-y-1">
                <Link to="/" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-dark hover:bg-primary/5 hover:text-primary transition-colors">
                  Home
                </Link>

                {/* Mobile Products Accordion */}
                <div>
                  <button
                    onClick={() => { setMobileProductsOpen(!mobileProductsOpen); setMobileCatalogsOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-dark hover:bg-primary/5 transition-colors"
                  >
                    Products
                    <motion.svg
                      animate={{ rotate: mobileProductsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {mobileProductsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden ml-3 mt-1 space-y-1"
                      >
                        <Link to="/products" className="block px-3 py-2 rounded-lg text-xs text-primary font-bold hover:bg-primary/10 transition-colors">
                          🛍️ All Products
                        </Link>
                        {Object.entries(groupedProducts).map(([groupName, items]) => (
                          <div key={groupName} className="mt-1 first:mt-0">
                            <div className="px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-dark/30">
                              {groupName}
                            </div>
                            {items.map(item => (
                              <Link key={item.id} to={item.route} className="block px-5 py-1.5 rounded-lg text-xs text-dark/80 hover:bg-primary/5 hover:text-primary transition-colors">
                                {item.emoji} {item.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile PDF Catalogs Accordion */}
                <div>
                  <button
                    onClick={() => { setMobileCatalogsOpen(!mobileCatalogsOpen); setMobileProductsOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-dark hover:bg-primary/5 transition-colors"
                  >
                    PDF Catalogs
                    <motion.svg
                      animate={{ rotate: mobileCatalogsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {mobileCatalogsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden ml-3 mt-1 space-y-0.5"
                      >
                        <Link to="/catalogs" className="block px-3 py-2 rounded-lg text-xs text-primary font-bold hover:bg-primary/10 transition-colors">
                          📁 All PDF Catalogs
                        </Link>
                        {pdfCatalogsDropdown.map(item => (
                          <Link key={item.to} to={item.to} className="block px-3 py-2 rounded-lg text-xs text-dark/80 hover:bg-primary/5 hover:text-primary transition-colors">
                            {item.icon} {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-dark hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile CTA buttons */}
                <div className="flex gap-2 pt-3">
                  <a
                    href={`https://wa.me/${WA_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="tel:+919408461000"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm"
                  >
                    📞 Call
                  </a>
                </div>

                <p className="text-center text-xs text-dark/40 pb-2 pt-2">
                  N.H. No.8, Piplag Chokdi, Nadiad - 387 355
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
