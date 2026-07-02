import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Logo';

const PHONE = '+91 94084 61000';
const WA_NUMBER = '919974142777';
const EMAIL = 'nilkanth1marble@gmail.com';

const productsDropdown = [
  { to: '/marble', label: 'Marble', desc: 'Premium Italian & Indian marble', icon: '🪨' },
  { to: '/granite', label: 'Granite', desc: 'Natural granite slabs', icon: '⬛' },
  { to: '/stone', label: 'Stone', desc: 'Natural & engineered stones', icon: '🪨' },
  { to: '/kota-stone', label: 'Kota Stone', desc: 'Kota stone, slate & more', icon: '🟫' },
  { to: '/sanitary-ware', label: 'Sanitary Ware', desc: 'Closets, basins, faucets', icon: '🚿' },
  { to: '/adhesives-chemicals', label: 'Chemicals', desc: 'Tile adhesives & construction chemicals', icon: '🧪' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown click outside listener
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
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
      setMobileProductsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Synchronize theme with localstorage and DOM class list
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const isProductsActive = ['/marble', '/granite', '/kota-stone', '/sanitary-ware', '/products'].some(
    p => location.pathname.startsWith(p)
  );

  const navLinks = [
    { to: '/tiles-catalog', label: 'Tiles Catalog' },
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
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <Logo
                size={35}
                variant="full"
                className="text-dark transition-transform duration-200 group-hover:scale-[1.02]"
              />
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
                  onClick={() => setProductsOpen(!productsOpen)}
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
                      <div className="py-2">
                        <Link
                          to="/products"
                          onClick={() => setProductsOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors border-b border-border/40"
                        >
                          <span>🛍️</span>
                          <span>All Products</span>
                        </Link>
                        {productsDropdown.map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setProductsOpen(false)}
                            className="flex items-start gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors"
                          >
                            <span className="mt-0.5 text-base">{item.icon}</span>
                            <div>
                              <p className="text-sm font-semibold text-dark">{item.label}</p>
                              <p className="text-xs text-dark/40 mt-0.5">{item.desc}</p>
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

              {/* Theme Toggle & CTA Buttons */}
              <div className="flex items-center gap-2 ml-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-dark/70 hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center w-9 h-9 border border-border/30"
                  title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                  {theme === 'dark' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8962E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                    </svg>
                  )}
                </button>

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
              {/* Theme Toggle for mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-dark/70 hover:bg-primary/5 transition-colors flex items-center justify-center w-8 h-8"
              >
                {theme === 'dark' ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C8962E" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                )}
              </button>

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
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
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
                        className="overflow-hidden ml-3 mt-1 space-y-0.5"
                      >
                        <Link to="/products" className="block px-3 py-2 rounded-lg text-sm text-primary font-bold hover:bg-primary/10 transition-colors">
                          🛍️ All Products
                        </Link>
                        {productsDropdown.map(item => (
                          <Link key={item.to} to={item.to} className="block px-3 py-2 rounded-lg text-sm text-dark/80 hover:bg-primary/5 hover:text-primary transition-colors">
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
