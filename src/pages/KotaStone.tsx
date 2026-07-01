import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import ProductGrid from '../components/products/ProductGrid';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'kota-stone', label: '🟫 Kota Stone' },
  { id: 'slate', label: '🪨 Slate' },
];

const KotaStone: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { products, loading } = useSupabaseProducts('kota-others');

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter(p => p.subcategory === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Kota & Others</span>
          </nav>
          <h1 className="text-3xl font-heading font-black text-gray-900">🟫 Kota & Others</h1>
          <p className="text-gray-500 mt-1">
            Kota stone, slate & natural stones — ideal for outdoor, pool side, steps and flooring
          </p>

          <div className="flex items-center gap-2 mt-5 border-b border-gray-100 pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 text-sm">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} showFilters={false} />
        )}
      </div>
    </div>
  );
};

export default KotaStone;
