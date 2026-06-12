import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts, getProductsByBrand, getBrandById, getBrands } from '../data/mockDb';
import { IconFilter, IconX } from '@tabler/icons-react';

const Catalog: React.FC = () => {
  const { brandId } = useParams<{ brandId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const allBrands = getBrands();
  
  const [products, setProducts] = useState(brandId ? getProductsByBrand(brandId) : getProducts());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState<string>(brandId || searchParams.get('brand') || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedFinish, setSelectedFinish] = useState<string>(searchParams.get('finish') || 'all');

  const brandInfo = brandId ? getBrandById(brandId) : null;

  useEffect(() => {
    let filtered = getProducts();
    
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brandId === selectedBrand);
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedFinish !== 'all') {
      filtered = filtered.filter(p => p.finish === selectedFinish);
    }

    setProducts(filtered);

    // Update URL params
    const params = new URLSearchParams();
    if (selectedBrand !== 'all' && !brandId) params.set('brand', selectedBrand);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedFinish !== 'all') params.set('finish', selectedFinish);
    setSearchParams(params, { replace: true });

  }, [selectedBrand, selectedCategory, selectedFinish, brandId, setSearchParams]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <div className="bg-light min-h-screen pb-16">
      {/* Brand Banner (if specific brand route) */}
      {brandInfo && (
        <div 
          className="w-full py-16 px-4 text-center text-white relative overflow-hidden"
          style={{ backgroundColor: brandInfo.colorAccent }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl font-heading font-bold mb-4">{brandInfo.name}</h1>
            <p className="text-xl opacity-90">{brandInfo.category} | From {brandInfo.origin}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Mobile Filter Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-dark">
            {brandInfo ? 'Products' : 'Full Catalog'}
            <span className="text-lg font-sans font-normal text-gray-500 ml-3">({products.length} items)</span>
          </h1>
          <button 
            onClick={toggleFilter}
            className="lg:hidden flex items-center gap-2 btn-secondary px-4 py-2"
          >
            <IconFilter size={20} />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="font-heading font-bold text-xl">Filters</h3>
                <button onClick={toggleFilter}><IconX /></button>
              </div>

              {!brandId && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-dark">Brand</h4>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {allBrands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-dark">Product Type</h4>
                <select 
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="marble">Marble</option>
                  <option value="vitrified">Vitrified</option>
                  <option value="ceramic">Ceramic</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="adhesive">Adhesive</option>
                </select>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-dark">Finish</h4>
                <div className="space-y-2">
                  {['all', 'polished', 'matt', 'satin', 'structured', 'glossy'].map(finish => (
                    <label key={finish} className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="finish" 
                        value={finish}
                        checked={selectedFinish === finish}
                        onChange={() => setSelectedFinish(finish)}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="capitalize text-gray-700">{finish}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedBrand(brandId || 'all');
                  setSelectedCategory('all');
                  setSelectedFinish('all');
                }}
                className="w-full py-2 text-sm text-gray-500 hover:text-primary transition-colors border border-gray-200 rounded-lg mt-4"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {products.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl shadow-sm">
                <h3 className="text-xl font-heading text-dark mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const pBrand = getBrandById(product.brandId);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                    >
                      <Link to={`/product/${product.id}`} className="relative h-56 overflow-hidden block">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        {pBrand && (
                          <div className="absolute top-3 left-3">
                            <span 
                              className="text-xs font-bold px-2 py-1 rounded text-white shadow-sm uppercase tracking-wide"
                              style={{ backgroundColor: pBrand.colorAccent }}
                            >
                              {pBrand.name}
                            </span>
                          </div>
                        )}
                      </Link>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading font-bold text-lg text-dark mb-1">
                            <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                              {product.name}
                            </Link>
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.dimensions}</span>
                            <span className="text-xs capitalize bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.finish}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/product/${product.id}`}
                          className="w-full py-2 text-center text-primary font-medium border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
