import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById, getBrandById, getProductsByBrand } from '../data/mockDb';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons-react';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = productId ? getProductById(productId) : null;
  const brand = product ? getBrandById(product.brandId) : null;
  const relatedProducts = product ? getProductsByBrand(product.brandId).filter(p => p.id !== product.id).slice(0, 4) : [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <h2 className="text-2xl font-heading text-dark mb-4">Product not found</h2>
          <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors">
            <IconArrowLeft size={20} className="mr-2" /> Back to Catalog
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row">
            {/* Image Gallery */}
            <div className="md:w-1/2 relative bg-gray-100 min-h-[400px]">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <Link to={`/brands/${brand.id}`} className="inline-block shadow-lg hover:scale-105 transition-transform">
                  <span 
                    className="text-sm font-bold px-4 py-2 rounded-lg text-white uppercase tracking-wider"
                    style={{ backgroundColor: brand.colorAccent }}
                  >
                    {brand.name}
                  </span>
                </Link>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">{product.name}</h1>
                <p className="text-lg text-gray-500 capitalize">{product.category} • {brand.origin}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dimensions</p>
                  <p className="font-semibold text-dark">{product.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Thickness</p>
                  <p className="font-semibold text-dark">{product.thickness}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Finish</p>
                  <p className="font-semibold text-dark capitalize">{product.finish}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Suitable For</p>
                  <div className="flex flex-wrap gap-1">
                    {product.usage.map(u => (
                      <span key={u} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{u}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary flex-1 text-center text-lg py-4 shadow-lg shadow-primary/20"
                >
                  Send Enquiry
                </button>
                <a 
                  href={`https://wa.me/919408461000?text=Hi, I want to inquire about ${product.name} (${brand.name}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1 text-center text-lg py-4 border-2 flex justify-center items-center gap-2"
                >
                  <IconCheck size={20} className="text-green-600" /> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-2xl font-heading font-bold text-dark mb-8">More from {brand.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <Link 
                  key={rp.id} 
                  to={`/product/${rp.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={rp.imageUrl} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-dark group-hover:text-primary transition-colors">{rp.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{rp.finish}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl relative z-10 w-full max-w-md overflow-hidden"
            >
              <div className="bg-dark p-6 text-white flex justify-between items-center border-b-[4px] border-primary">
                <h3 className="font-heading font-bold text-xl">Enquire About Product</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <IconX size={24} />
                </button>
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-6 bg-gray-50 p-4 rounded-lg flex items-center gap-4">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <p className="font-bold text-dark">{product.name}</p>
                    <p className="text-sm text-gray-500">{brand.name}</p>
                  </div>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Enquiry Sent! We will contact you soon.'); setIsModalOpen(false); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="I would like to know the pricing and availability..."></textarea>
                  </div>
                  <button type="submit" className="w-full btn-primary py-3 mt-2">Submit Enquiry</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
