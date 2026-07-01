import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import ProductGrid from '../components/products/ProductGrid';

const Marble: React.FC = () => {
  const { products, loading } = useSupabaseProducts('marble');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Marble</span>
          </nav>
          <h1 className="text-3xl font-heading font-black text-gray-900">🪨 Marble</h1>
          <p className="text-gray-500 mt-1">
            Premium Italian & Indian marble — Carrara, Calacatta, Statuario, Nero Marquina and more
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 text-sm">Loading marble products...</p>
          </div>
        ) : (
          <ProductGrid products={products} showFilters={true} />
        )}
      </div>
    </div>
  );
};

export default Marble;
