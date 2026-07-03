import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import AdminAuthModal from '../AdminAuthModal';

const WA_NUMBER = '919974142777';
const PHONE1 = '+91 94084 61000';
const PHONE2 = '+91 99741 42777';
const EMAIL = 'nilkanth1marble@gmail.com';
const ADDRESS = 'N.H. No.8, Piplag Chokdi,\nAt. Piplag, Nadiad - 387 355, INDIA';

const Footer: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <footer className="bg-surface text-dark border-t border-border/40 transition-colors duration-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <Logo size={36} className="text-accent" />
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-xl text-dark">Nilkanth</span>
                <span className="text-accent text-xs tracking-widest uppercase font-semibold" style={{ letterSpacing: '0.15em' }}>
                  Marble
                </span>
              </div>
            </Link>
            <p className="text-text-sub text-sm italic mb-3">"The Quality Forever"</p>
            <p className="text-text-sub text-sm leading-relaxed mb-5">
              Trusted dealer of premium marble, granite, kota stone, sanitary ware and tiles in Gujarat, India.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Nilkanth Marble! I want to enquire about your products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-5 text-dark border-b border-border/40 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/catalogs', label: 'PDF Catalogs' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-text-sub hover:text-accent transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-5 text-dark border-b border-border/40 pb-2">
              Our Products
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/marble', label: '🪨 Marble' },
                { to: '/granite', label: '⬛ Granite' },
                { to: '/kota-stone', label: '🟫 Kota Stone' },
                { to: '/cladding-stone', label: '🧱 Cladding Stone' },
                { to: '/adhesives-chemicals', label: '🧪 Chemicals' },
                { to: '/catalogs', label: '📁 PDF Catalogs' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-text-sub hover:text-accent transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-widest mb-5 text-dark border-b border-border/40 pb-2">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="text-accent shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-text-sub text-sm" style={{ whiteSpace: 'pre-line' }}>{ADDRESS}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="text-accent shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 12a19.79 19.79 0 01-3-8.58A2 2 0 012.5 1.5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.78-1.78a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <div className="text-sm">
                  <a href="tel:+919408461000" className="block text-text-sub hover:text-accent transition-colors">{PHONE1}</a>
                  <a href="tel:+919974142777" className="block text-text-sub hover:text-accent transition-colors">{PHONE2}</a>
                  <a href="tel:+919998987547" className="block text-text-sub hover:text-accent transition-colors">+91 99989 87547</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <svg className="text-accent shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href={`mailto:${EMAIL}`} className="text-text-sub hover:text-accent transition-colors text-sm">{EMAIL}</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="text-text-sub shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-text-sub text-sm">Mon–Sat: 9:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-text-sub text-sm text-center md:text-left">
            © {new Date().getFullYear()} Nilkanth Marble. All rights reserved.
          </p>
          <div className="flex gap-5 text-sm text-text-sub">
            <Link to="/marble" className="hover:text-accent transition-colors">Marble</Link>
            <Link to="/granite" className="hover:text-accent transition-colors">Granite</Link>
            <Link to="/sanitary-ware" className="hover:text-accent transition-colors">Sanitary</Link>
            <Link to="/tiles-catalog" className="hover:text-accent transition-colors">Tiles</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <button
              onClick={() => setAuthOpen(true)}
              className="hover:text-accent transition-colors cursor-pointer text-text-sub/50 text-[11px] font-medium border-l border-border/40 pl-4 ml-1"
            >
              🔒 Admin
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AdminAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </footer>
  );
};

export default Footer;
