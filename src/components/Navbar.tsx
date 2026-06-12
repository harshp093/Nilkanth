import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMenu2, IconX } from '@tabler/icons-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-dark text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo size={36} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="font-heading font-bold text-2xl tracking-wide">Nilkanth</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/brands" className="hover:text-primary px-3 py-2 rounded-md font-medium transition-colors">Brands</Link>
              <Link to="/catalog" className="hover:text-primary px-3 py-2 rounded-md font-medium transition-colors">Catalog</Link>
              <Link to="/about" className="hover:text-primary px-3 py-2 rounded-md font-medium transition-colors">About</Link>
              <Link to="/contact" className="bg-primary hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium transition-colors">Contact</Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <IconX size={24} aria-hidden="true" /> : <IconMenu2 size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md absolute w-full border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/brands" className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Brands</Link>
            <Link to="/catalog" className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Catalog</Link>
            <Link to="/about" className="hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>About</Link>
            <Link to="/contact" className="text-primary hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
