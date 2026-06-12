import React from 'react';
import { Link } from 'react-router-dom';
import { IconMapPin, IconPhone, IconMail } from '@tabler/icons-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t-[6px] border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Logo size={36} className="text-primary" />
              <span className="font-heading font-bold text-2xl tracking-wide">Nilkanth Marble</span>
            </div>
            <p className="text-gray-400 mb-6 italic">"The Quality Forever"</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authorized dealer for top Italian & Indian marble, tiles, and stone brands. Quality and trust spanning over 20 years.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/brands" className="text-gray-400 hover:text-primary transition-colors">Brands We Carry</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-primary transition-colors">Product Catalog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6 border-b border-gray-700 pb-2 inline-block">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconMapPin className="text-primary shrink-0 mt-1" size={20} />
                <span className="text-gray-400 text-sm">N.H. No.8, Piplag Chokdi,<br/>At. Piplag, Nadiad - 387 355, INDIA</span>
              </li>
              <li className="flex items-center gap-3">
                <IconPhone className="text-primary shrink-0" size={20} />
                <span className="text-gray-400 text-sm">+91 94084 61000 / +91 99989 87547</span>
              </li>
              <li className="flex items-center gap-3">
                <IconMail className="text-primary shrink-0" size={20} />
                <span className="text-gray-400 text-sm">nilkanth1marble@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Nilkanth Marble. All rights reserved.
          </p>
          <div className="text-gray-500 text-sm">
            Designed with premium quality in mind.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
