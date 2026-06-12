import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBrands } from '../data/mockDb';
import { IconArrowRight } from '@tabler/icons-react';

const Brands: React.FC = () => {
  const brands = getBrands();

  return (
    <div className="bg-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-5xl font-heading font-bold text-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Brand Partners
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-primary mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We collaborate with industry-leading manufacturers to bring you an unparalleled selection of premium surfaces.
          </motion.p>
        </div>

        <div className="space-y-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row group"
            >
              <div 
                className="w-full md:w-1/4 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative overflow-hidden"
                style={{ backgroundColor: `${brand.colorAccent}10` }} // 10% opacity
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ backgroundColor: brand.colorAccent }}
                ></div>
                <div className="h-24 w-24 mb-4 rounded-full bg-white shadow-md flex items-center justify-center relative z-10">
                  <span className="font-heading font-bold text-4xl" style={{ color: brand.colorAccent }}>{brand.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 z-10">Origin: {brand.origin}</span>
              </div>
              
              <div className="w-full md:w-3/4 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-heading font-bold text-dark mb-2 group-hover:text-primary transition-colors">{brand.name}</h2>
                      <p className="text-primary font-medium">{brand.category}</p>
                    </div>
                    <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 hidden sm:block">
                      <span className="block text-2xl font-bold text-dark">{brand.productCount}</span>
                      <span className="text-xs text-gray-500 uppercase">Products</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 max-w-3xl leading-relaxed">{brand.description}</p>
                </div>
                
                <div>
                  <Link 
                    to={`/brands/${brand.id}`}
                    className="inline-flex items-center font-medium transition-colors"
                    style={{ color: brand.colorAccent }}
                  >
                    View {brand.name} Products <IconArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
