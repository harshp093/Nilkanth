import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { IconArrowRight } from '@tabler/icons-react';
import useSEO from '../hooks/useSEO';

interface BrandGroup {
  id: string; // brand name formatted or as id
  name: string;
  categoryList: string[];
  productCount: number;
  description: string;
  colorAccent: string;
  origin: string;
}

const BRAND_DETAILS: Record<string, { desc: string; color: string; origin: string }> = {
  'kajaria': { desc: 'India\'s No. 1 tile manufacturer, offering world-class vitrified, ceramic, and polished wall tiles.', color: '#d97706', origin: 'India' },
  'somany': { desc: 'A leading player in ceramic tiles and bathware, known for innovation and premium digital tiles.', color: '#059669', origin: 'India' },
  'johnson': { desc: 'One of India\'s most trusted brands, producing premium sanitary ware and designer vitrified floor tiles.', color: '#2563eb', origin: 'India' },
  'colortile': { desc: 'Exclusive vitrified and digital tiles with high gloss and satin finishes, bringing aesthetics to surfaces.', color: '#7c3aed', origin: 'India' },
  'donato': { desc: 'Imported luxury tiles and sanitary fixtures that focus on minimalist Italian-inspired modern concepts.', color: '#dc2626', origin: 'Italy' },
  'latigres': { desc: 'Vibrant outdoor floor pavers and specialized vitrified tiles with exceptional strength and grip.', color: '#0891b2', origin: 'India' },
  'marfil': { desc: 'Luxury marble-finished tiles and premium bathroom fittings offering timeless design concepts.', color: '#db2777', origin: 'Spain' },
  'kalingastone': { desc: 'Premium engineered marble and quartz slabs for high-traffic and luxury kitchen spaces.', color: '#4f46e5', origin: 'India' }
};

const Brands: React.FC = () => {
  const { products, loading } = useSupabaseProducts();

  useSEO({
    title: 'Our Premium Brand Partners | Nilkanth Marble',
    description: 'We partner with world-class manufacturers like Kajaria, Somany, Johnson, and ColorTiles to bring you premium surfaces in Nadiad, Gujarat.',
    keywords: 'tile brands Nadiad, Kajaria tiles Gujarat, Somany bathware, Johnson sanitary ware, ColorTiles',
    url: '/brands',
  });

  const brands = useMemo(() => {
    const brandMap = new Map<string, { categories: Set<string>; count: number }>();
    
    products.forEach(p => {
      if (p.brand) {
        const brandKey = p.brand.trim();
        const brandNormalized = brandKey.toLowerCase();
        if (!brandMap.has(brandNormalized)) {
          brandMap.set(brandNormalized, { categories: new Set(), count: 0 });
        }
        const entry = brandMap.get(brandNormalized)!;
        entry.count += 1;
        // Format category name nicely
        const catLabel = p.category.charAt(0).toUpperCase() + p.category.slice(1).replace(/-/g, ' ');
        entry.categories.add(catLabel);
      }
    });

    const groups: BrandGroup[] = [];
    brandMap.forEach((info, key) => {
      // Find original brand name casing from the first match in products
      const originalBrand = products.find(p => p.brand?.toLowerCase() === key)?.brand || key;
      const details = BRAND_DETAILS[key] || {
        desc: `Premium manufacturer of quality ${Array.from(info.categories).join(', ')} surfaces.`,
        color: '#C8962E', // Default brand gold accent
        origin: 'India'
      };
      
      groups.push({
        id: originalBrand,
        name: originalBrand,
        categoryList: Array.from(info.categories),
        productCount: info.count,
        description: details.desc,
        colorAccent: details.color,
        origin: details.origin
      });
    });

    // Sort by product count descending
    return groups.sort((a, b) => b.productCount - a.productCount);
  }, [products]);

  return (
    <div className="bg-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            className="text-5xl font-heading font-bold text-dark mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            We collaborate with industry-leading manufacturers to bring you an unparalleled selection of premium surfaces.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 text-sm">Loading our brand partners...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-5xl block mb-4">🏬</span>
            <p className="text-gray-400 text-lg">No brands found. Please add products with branding details in the Admin Panel.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
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
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 z-10">Origin: {brand.origin}</span>
                </div>
                
                <div className="w-full md:w-3/4 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-3xl font-heading font-bold text-dark mb-2 group-hover:text-primary transition-colors">{brand.name}</h2>
                        <p className="text-primary font-medium text-sm capitalize">{brand.categoryList.join(' · ')}</p>
                      </div>
                      <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 hidden sm:block">
                        <span className="block text-2xl font-bold text-dark">{brand.productCount}</span>
                        <span className="text-[10px] text-gray-500 uppercase font-black">Products</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 max-w-3xl leading-relaxed text-sm md:text-base">{brand.description}</p>
                  </div>
                  
                  <div>
                    <Link 
                      to={`/products?brand=${brand.name}`}
                      className="inline-flex items-center font-bold transition-colors text-sm hover:underline"
                      style={{ color: brand.colorAccent }}
                    >
                      View {brand.name} Collection <IconArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands;
