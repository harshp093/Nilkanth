import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSupabaseProducts, useSupabaseCategories } from '../hooks/useSupabaseProducts';
import ProductGrid from '../components/products/ProductGrid';
import useSEO from '../hooks/useSEO';

interface DynamicCategoryPageProps {
  categoryId?: string;
}

const DynamicCategoryPage: React.FC<DynamicCategoryPageProps> = ({ categoryId }) => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { categories, loading: categoriesLoading } = useSupabaseCategories();
  const [activeTab, setActiveTab] = React.useState('all');

  // Find current category dynamically
  const currentCategory = useMemo(() => {
    if (categoryId) {
      return categories.find(c => c.id === categoryId);
    }
    if (categorySlug) {
      return categories.find(c => c.slug === categorySlug);
    }
    return undefined;
  }, [categories, categoryId, categorySlug]);

  const targetCategoryId = currentCategory?.id || categoryId || categorySlug || '';
  const { products, loading: productsLoading } = useSupabaseProducts(targetCategoryId as any);

  // Setup dynamic SEO meta tags
  useSEO({
    title: currentCategory 
      ? `${currentCategory.name} Collections — Premium Surfaces | Nilkanth Marble`
      : 'Showroom Product Collections | Nilkanth Marble',
    description: currentCategory?.description || 'Browse our premium tile, marble, and granite collections.',
    keywords: currentCategory ? `${currentCategory.name} collections, premium surfaces, Nilkanth Marble` : 'surfaces, marble, tiles',
    url: currentCategory ? `/category/${currentCategory.slug}` : '/products',
  });

  // Extract unique subcategories from the products dynamically to support dynamic subcategory tabs
  const subcategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.subcategory) set.add(p.subcategory);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    return products.filter(p => p.subcategory === activeTab);
  }, [products, activeTab]);

  const loading = categoriesLoading || productsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-32">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 text-sm">Loading showroom collections...</p>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <div className="text-8xl mb-4">🪨</div>
          <h1 className="text-3xl font-heading font-black text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-500 mb-6">This category collections page doesn't exist or is currently inactive.</p>
          <Link to="/products" className="btn-primary inline-flex">← Browse All Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100 py-8 relative overflow-hidden">
        {/* Abstract design elements to make it feel premium */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{currentCategory.name}</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentCategory.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 capitalize">{currentCategory.name}</h1>
          </div>
          <p className="text-gray-500 mt-2 max-w-3xl text-sm md:text-base leading-relaxed">
            {currentCategory.longDescription || currentCategory.description}
          </p>

          {/* Dynamic tabs filter based on products subcategories */}
          {subcategories.length > 0 && (
            <div className="flex items-center gap-1.5 mt-6 overflow-x-auto scrollbar-none pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`shrink-0 px-4 py-2 text-xs font-bold rounded-lg border transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                    : 'bg-transparent text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                🌍 All {currentCategory.name}
              </button>
              {subcategories.map(sub => {
                const label = sub.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveTab(sub)}
                    className={`shrink-0 px-4 py-2 text-xs font-bold rounded-lg border transition-all whitespace-nowrap capitalize ${
                      activeTab === sub
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                        : 'bg-transparent text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
            <span className="text-5xl block mb-4">🏺</span>
            <h3 className="text-gray-900 font-heading font-bold text-lg mb-1">No products found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-4">We are currently updating this category showroom collection. Please contact our Nadiad store for custom requirements.</p>
            <Link to="/contact" className="btn-accent inline-flex px-5 py-2.5 text-xs font-bold">Contact Store</Link>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} showFilters={false} />
        )}
      </div>
    </div>
  );
};

export default DynamicCategoryPage;
