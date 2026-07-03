import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import ProductGrid from '../components/products/ProductGrid';

const KotaStone: React.FC = () => {
  const { products, loading } = useSupabaseProducts('kota-stone');

  // Fallback to fetch kota-others if no products returned yet
  const { products: fallbackProducts, loading: fallbackLoading } = useSupabaseProducts(
    products.length === 0 ? ('kota-others' as any) : undefined
  );

  const displayedProducts = products.length > 0 ? products : fallbackProducts;
  const isPageLoading = loading && (products.length === 0 ? fallbackLoading : true);

  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <div className="bg-surface border-b border-border/30 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-dark/50 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>›</span>
            <span className="text-dark font-medium">Kota Stone</span>
          </nav>
          <h1 className="text-3xl font-heading font-black text-dark">🟫 Kota Stone</h1>
          <p className="text-dark/50 mt-1">
            Premium natural Kota blue and green limestone slabs — ideal for outdoor pathways, patios, pool sides, steps, and heavy-duty flooring
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPageLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-dark/50 text-sm">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={displayedProducts} showFilters={false} />
        )}
      </div>
    </div>
  );
};

export default KotaStone;
