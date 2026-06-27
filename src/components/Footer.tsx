import React from 'react';
import { Link } from 'react-router-dom';
import { IconMapPin, IconPhone, IconMail } from '@tabler/icons-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t-[6px] border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Logo size={36} className="text-primary" />
              <span className="font-heading font-bold text-2xl tracking-wide">Nilkanth Marble</span>
            </div>
            <p className="text-gray-400 mb-3 italic text-sm">"The Quality Forever"</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authorized dealer for top Italian & Indian marble, premium tiles, and granite. Quality and trust spanning over 20 years in Nadiad, Gujarat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-heading font-semibold mb-5 text-white uppercase tracking-widest border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/brands" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Brands We Carry</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Product Catalog</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Marble Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-heading font-semibold mb-5 text-white uppercase tracking-widest border-b border-gray-700 pb-2">Our Products</h3>
            <ul className="space-y-2.5">
              <li><Link to="/tiles" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Premium Tiles</Link></li>
              <li><Link to="/tiles/colortile/genesis" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Colortile Genesis</Link></li>
              <li><Link to="/tiles/donato/aurora" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Donato Aurora</Link></li>
              <li><Link to="/granite?type=natural-stone" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Natural Granite</Link></li>
              <li><Link to="/granite?type=artificial-stone" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Artificial Stone</Link></li>
              <li><Link to="/granite/black-galaxy" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">Black Galaxy Granite</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-heading font-semibold mb-5 text-white uppercase tracking-widest border-b border-gray-700 pb-2">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconMapPin className="text-primary shrink-0 mt-0.5" size={18} />
                <span className="text-gray-400 text-sm">N.H. No.8, Piplag Chokdi,<br/>At. Piplag, Nadiad - 387 355, INDIA</span>
              </li>
              <li className="flex items-center gap-3">
                <IconPhone className="text-primary shrink-0" size={18} />
                <span className="text-gray-400 text-sm">+91 94084 61000<br/>+91 99989 87547</span>
              </li>
              <li className="flex items-center gap-3">
                <IconMail className="text-primary shrink-0" size={18} />
                <span className="text-gray-400 text-sm">nilkanth1marble@gmail.com</span>
              </li>
            </ul>
            <a
              href="https://wa.me/919408461000?text=Hi, I would like to visit your showroom or learn more about your products."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Nilkanth Marble. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/tiles" className="hover:text-amber-400 transition-colors">Tiles</Link>
            <Link to="/granite" className="hover:text-amber-400 transition-colors">Granite</Link>
            <Link to="/catalog" className="hover:text-amber-400 transition-colors">Catalog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
