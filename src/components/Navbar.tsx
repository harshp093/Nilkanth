import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMenu2, IconX, IconSearch, IconChevronDown } from '@tabler/icons-react';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';
import { useSupabaseCategories } from '../hooks/useSupabaseProducts';

const navLinks = [
  { to: '/brands', label: 'Brands' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/tiles', label: 'Tiles' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { categories } = useSupabaseCategories();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close categories dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Global keyboard shortcut: Ctrl+K / Cmd+K opens search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-stone-950/96 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/5'
            : 'bg-stone-950/85 backdrop-blur-md'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/" className="flex items-center gap-3 group">
                <Logo size={36} className="text-primary group-hover:scale-110 transition-transform" />
                <div className="flex flex-col leading-none">
                  <span className="font-heading font-bold text-xl tracking-wide text-white">Nilkanth</span>
                  <span className="text-amber-400/80 text-xs tracking-[0.2em] uppercase font-medium">Marble & Tiles</span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
                return (
                  <Link key={link.to} to={link.to} className="relative px-4 py-2 rounded-lg font-medium text-sm transition-colors group">
                    <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-amber-400' : 'text-stone-300 hover:text-white'}`}>
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-white/5 rounded-lg border border-amber-400/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* ── Categories Dropdown ── */}
              <div ref={categoriesRef} className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors group ${
                    location.pathname.startsWith('/category/') || location.pathname.startsWith('/marble') || location.pathname.startsWith('/granite') || location.pathname.startsWith('/kota-stone') || location.pathname.startsWith('/sanitary-ware') ? 'text-amber-400 font-bold' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Products
                  <motion.div
                    animate={{ rotate: categoriesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconChevronDown size={14} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-stone-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in"
                    >
                      <div className="p-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={cat.id === 'tiles-catalog' ? '/tiles-catalog' : (['marble', 'granite', 'kota-others', 'sanitary-ware'].includes(cat.id) ? `/${cat.id === 'kota-others' ? 'kota-stone' : cat.id}` : `/category/${cat.slug}`)}
                            onClick={() => setCategoriesOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/8 transition-colors group"
                          >
                            <div className="bg-white/10 rounded-lg p-1.5 mt-0.5 flex-shrink-0 text-sm">
                              {cat.emoji || '🪨'}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors">
                                {cat.name}
                              </p>
                              <p className="text-stone-400 text-[10px] mt-0.5 line-clamp-1">{cat.description}</p>
                            </div>
                          </Link>
                        ))}
                        <div className="border-t border-white/8 mt-1 pt-1">
                          <Link
                            to="/products"
                            onClick={() => setCategoriesOpen(false)}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs text-stone-400 hover:text-amber-400 transition-colors"
                          >
                            View all products →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Search Button ── */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSearchOpen(true)}
                className="ml-3 flex items-center gap-2.5 bg-white/6 hover:bg-white/12 border border-white/10 rounded-xl px-4 py-2 text-stone-400 hover:text-white transition-all duration-200 text-sm"
                aria-label="Search marble, tiles, brands"
                id="navbar-search-btn"
              >
                <IconSearch size={15} />
                <span className="hidden lg:inline">Search…</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 bg-white/8 border border-white/10 rounded px-1.5 py-0.5 text-xs text-stone-500 font-mono">
                  ⌘K
                </kbd>
              </motion.button>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="ml-3">
                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-900 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>

            {/* Mobile: Search + Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-white/8 transition-colors"
                aria-label="Search"
              >
                <IconSearch size={22} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <IconX size={24} />
                    </motion.div>
                  ) : (
                    <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <IconMenu2 size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
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
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden bg-stone-950/98 backdrop-blur-xl border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                        location.pathname === link.to
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-stone-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Products sub-section */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                      location.pathname.startsWith('/category/') || location.pathname.startsWith('/marble') || location.pathname.startsWith('/granite') || location.pathname.startsWith('/kota-stone') || location.pathname.startsWith('/sanitary-ware') ? 'text-amber-400 bg-amber-400/10' : 'text-stone-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Products
                    <motion.div animate={{ rotate: mobileCategoriesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <IconChevronDown size={16} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {mobileCategoriesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden ml-4 mt-1 space-y-1"
                      >
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={cat.id === 'tiles-catalog' ? '/tiles-catalog' : (['marble', 'granite', 'kota-others', 'sanitary-ware'].includes(cat.id) ? `/${cat.id === 'kota-others' ? 'kota-stone' : cat.id}` : `/category/${cat.slug}`)}
                            onClick={() => { setIsOpen(false); setMobileCategoriesOpen(false); }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                          >
                            <span className="text-base">{cat.emoji || '🪨'}</span>
                            {cat.name}
                          </Link>
                        ))}
                        <Link
                          to="/products"
                          onClick={() => { setIsOpen(false); setMobileCategoriesOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-amber-400 hover:bg-white/5 transition-colors text-sm font-semibold"
                        >
                          <span>🛍️</span>
                          View all products →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="pt-2">
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block text-center bg-gradient-to-r from-amber-500 to-amber-400 text-stone-900 px-6 py-3 rounded-xl font-bold"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
