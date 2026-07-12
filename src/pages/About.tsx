import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import useSEO from '../hooks/useSEO';

const About: React.FC = () => {
  useSEO({
    title: 'About Us | Nilkanth Marble — 20+ Years in Nadiad, Gujarat',
    description: 'Learn about Nilkanth Marble — trusted dealer of premium marble, granite, kota stone & tiles in Nadiad, Gujarat since 20+ years. Located at NH-8, Piplag Chokdi. Call +91 94084 61000.',
    url: '/about',
    canonical: 'https://www.nilkanthmarble.com/about',
    keywords: 'Nilkanth Marble about, marble dealer Nadiad, stone tiles Gujarat, about us marble shop',
  });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">About Us</span>
          </nav>
          <h1 className="text-3xl font-heading font-black text-gray-900">About Nilkanth Marble</h1>
          <p className="text-gray-500 mt-1">"The Quality Forever" — Established in Nadiad, Gujarat</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero about section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Logo size={56} className="text-primary" />
              <div>
                <h2 className="font-heading font-black text-gray-900 text-3xl">Nilkanth Marble</h2>
                <p className="text-accent font-semibold text-sm tracking-widest uppercase" style={{ letterSpacing: '0.15em' }}>
                  THE QUALITY FOREVER
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4 text-base">
              Nilkanth Marble is a trusted dealer of premium marble, granite, kota stone, sanitary ware and tiles,
              serving homes and businesses across Gujarat and beyond. We are located at Piplag Chokdi, Nadiad —
              right on National Highway No. 8.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              With over <strong>20 years of experience</strong> in the stone and tiles industry, we have built a
              reputation for uncompromising quality and honest business. Our showroom features a curated selection
              of <strong>500+ products</strong> including world-class marble varieties from Italy, natural granites
              from Rajasthan and Andhra Pradesh, kota stone, complete bathroom sanitary ware solutions, and
              ColorTiles PDF catalogs.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '20+', label: 'Years in Business' },
                { number: '500+', label: 'Products' },
                { number: '5', label: 'Product Categories' },
                { number: '1000+', label: 'Happy Customers' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
                  <div className="text-2xl font-heading font-black text-accent mb-0.5">{stat.number}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ height: '420px' }}>
              <img
                src="/marble-calacatta.png"
                alt="Nilkanth Marble Showroom"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&q=80';
                }}
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Located at</p>
              <p className="font-heading font-bold text-gray-900 text-sm mt-0.5">NH-8, Piplag Chokdi</p>
              <p className="text-gray-500 text-xs">Nadiad - 387 355, Gujarat</p>
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-heading font-black text-gray-900 mb-2">Our Team</h2>
          <div className="section-divider mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Vinod Shah',
                phone: '+91 99989 87547',
                role: 'Proprietor',
                emoji: '👨‍💼',
              },
              {
                name: 'Hitesh Shah',
                phone: '+91 99741 42777',
                role: 'Sales & Enquiries',
                emoji: '🤝',
              },
              {
                name: 'Nilkanth Marble',
                phone: '+91 94084 61000',
                role: 'Main Office',
                emoji: '🏢',
              },
            ].map((person) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{person.emoji}</div>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">{person.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{person.role}</p>
                <a
                  href={`tel:${person.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-primary transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 12a19.79 19.79 0 01-3-8.58A2 2 0 012.5 1.5h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.78-1.78a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {person.phone}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What we offer */}
        <div className="bg-primary rounded-3xl p-10 text-white text-center">
          <h2 className="text-2xl font-heading font-bold mb-3">Ready to Visit Us?</h2>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">
            Come visit our showroom on NH-8, Piplag Chokdi, Nadiad. We're open Monday to Saturday, 9 AM to 7 PM.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/919974142777"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa px-8 py-3.5"
            >
              WhatsApp Us
            </a>
            <Link to="/contact" className="btn-outline border-white/40 text-white hover:bg-white hover:text-primary px-8 py-3.5">
              Contact Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
