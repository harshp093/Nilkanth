import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBrands, getFeaturedProducts } from '../data/mockDb';
import ThreeHero from '../components/ThreeHero';
import { IconCheck, IconShieldCheck, IconMessageCircle, IconArrowRight } from '@tabler/icons-react';

const Home: React.FC = () => {
  const brands = getBrands();
  const featuredProducts = getFeaturedProducts();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <ThreeHero />

      {/* Brands Section */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4"
            >
              Brands We Carry
            </motion.h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/brands/${brand.id}`)}
                className={`cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center group border-t-4 ${brand.id === 'kalingastone' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'}`}
                style={{ borderTopColor: brand.colorAccent }}
              >
                <div className="h-16 w-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-heading font-bold text-2xl" style={{ color: brand.colorAccent }}>{brand.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-dark text-lg mb-1">{brand.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{brand.category}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{brand.productCount} Products</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-heading font-bold text-dark mb-4">Featured Collection</h2>
              <div className="w-24 h-1 bg-primary"></div>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center text-primary font-semibold hover:text-red-700 transition-colors">
              View Full Catalog <IconArrowRight size={20} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-light shadow-sm hover:shadow-xl transition-all duration-500"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-dark shadow-sm uppercase tracking-wide">
                      {brands.find(b => b.id === product.brandId)?.name || 'Brand'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-dark mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{product.dimensions}</span>
                    <span className="capitalize bg-gray-200 px-2 py-0.5 rounded">{product.finish}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/catalog" className="btn-secondary inline-flex items-center">
              View Full Catalog <IconArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Nilkanth */}
      <section className="py-24 bg-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
           {/* Abstract background pattern placeholder */}
           <div className="absolute -top-1/2 -right-1/4 w-full h-full rounded-full bg-primary blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Why Choose Nilkanth?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">We bring decades of expertise and a commitment to quality that ensures your spaces look magnificent forever.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="bg-primary/20 p-4 rounded-full mb-6">
                <IconShieldCheck size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-4">Authorized Dealer</h3>
              <p className="text-gray-400">Directly sourcing from top-tier brands ensures 100% genuine products with manufacturer warranties.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="bg-primary/20 p-4 rounded-full mb-6">
                <IconCheck size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-4">Premium Selection</h3>
              <p className="text-gray-400">Curated collections of the finest Italian design stones, vitrified tiles, and premium marble.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="bg-primary/20 p-4 rounded-full mb-6">
                <IconMessageCircle size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-4">Expert Guidance</h3>
              <p className="text-gray-400">Our experienced team helps you select the perfect materials for your specific architectural needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-primary py-12 relative overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between text-white">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-heading font-bold mb-2">Ready to transform your space?</h2>
            <p className="text-white/80">Visit our showroom in Nadiad or contact us today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col text-right hidden sm:flex mr-4">
              <span className="font-semibold">+91 94084 61000</span>
              <span className="text-sm text-white/80">nilkanth1marble@gmail.com</span>
            </div>
            <Link to="/contact" className="bg-white text-primary hover:bg-dark hover:text-white px-8 py-4 rounded-full font-bold transition-colors shadow-lg">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
