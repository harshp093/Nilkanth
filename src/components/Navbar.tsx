import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMenu2, IconX, IconSearch } from '@tabler/icons-react';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';

const navLinks = [
  { to: '/brands', label: 'Brands' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
                <span className="hidden lg:inline">Search marble…</span>
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
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="pt-2">
                  <Link
                    to="/contact"
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
