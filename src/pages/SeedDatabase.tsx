/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { allProducts } from '../data/products';
import { tilesCatalogs } from '../data/catalogs';
import { categories } from '../data/categories';

const SeedDatabase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSeed = async () => {
    if (!supabase) {
      alert('Supabase client is not initialized. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file first.');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setLogs([]);
    addLog('🚀 Starting Database Seed...');

    try {
      // 1. Upload Products
      addLog(`Syncing ${allProducts.length} products...`);
      for (const prod of allProducts) {
        // Map to DB column names (under_score style)
        const dbProduct = {
          id: prod.id,
          slug: prod.slug,
          name: prod.name,
          description: prod.description || '',
          category: prod.category,
          subcategory: prod.subcategory || null,
          price_range: prod.priceRange || null,
          origin: prod.origin || null,
          thickness_options: prod.thicknessOptions || [],
          size_options: prod.sizeOptions || [],
          finish_options: prod.finishOptions || [],
          colors: prod.colors || [],
          color_names: prod.colorNames || [],
          application: prod.application || [],
          brand: prod.brand || null,
          model_number: prod.modelNumber || null,
          material: prod.material || null,
          is_featured: prod.isFeatured || false,
          is_active: prod.isActive || true,
          images: prod.images || [],
          view_count: prod.viewCount || 0,
        };

        const { error } = await supabase
          .from('products')
          .upsert(dbProduct, { onConflict: 'id' });

        if (error) {
          addLog(`❌ Error upserting product "${prod.name}": ${error.message}`);
          console.error(error);
        } else {
          addLog(`✅ Product synced: ${prod.name}`);
        }
      }

      // 2. Upload Catalogs
      addLog(`Syncing ${tilesCatalogs.length} tile catalogs...`);
      for (const cat of tilesCatalogs) {
        const dbCatalog = {
          id: cat.id,
          title: cat.title,
          company: cat.company,
          description: cat.description,
          pdf_url: cat.pdfUrl || null,
          thumbnail_url: cat.thumbnailUrl,
          catalog_type: cat.catalogType,
          tags: cat.tags || [],
          page_count: cat.pageCount || null,
          view_count: cat.viewCount || 0,
          download_count: cat.downloadCount || 0,
          is_active: cat.isActive || true,
        };

        const { error } = await supabase
          .from('catalogs')
          .upsert(dbCatalog, { onConflict: 'id' });

        if (error) {
          addLog(`❌ Error upserting catalog "${cat.title}": ${error.message}`);
          console.error(error);
        } else {
          addLog(`✅ Catalog synced: ${cat.title}`);
        }
      }

      // 3. Upload Categories
      addLog(`Syncing ${categories.length} categories...`);
      for (const cat of categories) {
        const dbCategory = {
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          long_description: cat.longDescription || '',
          emoji: cat.emoji || '',
          color: cat.color || 'amber',
          accent_color: cat.accentColor || '#C8962E',
          image: cat.image,
          product_count: cat.productCount || 0,
          route: cat.route,
          is_active: true,
        };

        const { error } = await supabase
          .from('categories')
          .upsert(dbCategory, { onConflict: 'id' });

        if (error) {
          addLog(`⚠️ Category "${cat.name}" sync skipped or error: ${error.message} (Note: Run categories_setup.sql if relation does not exist)`);
          console.warn(error);
        } else {
          addLog(`✅ Category synced: ${cat.name}`);
        }
      }

      addLog('🎉 Seed process completed!');
      setSuccess(true);
    } catch (err: any) {
      addLog(`💥 Unexpected error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
        <h1 className="font-heading font-black text-gray-900 text-3xl text-center mb-2">
          Database Seeder
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Upload products & catalogs to your live Supabase database.
        </p>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 text-blue-800 text-sm rounded-xl p-4 mb-6">
          <p className="font-semibold mb-1">Before running:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensure you have run the schema script in your Supabase SQL Editor.</li>
            <li>Ensure your <strong>.env</strong> contains correct credentials.</li>
            <li>This seeder uses `upsert` so it safe to run multiple times without duplicating entries.</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full btn-accent justify-center py-3 text-base font-bold shadow-lg"
          >
            {loading ? '⏳ Syncing Data...' : '🚀 Seed Supabase Database'}
          </button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-gray-900 text-green-400 font-mono text-xs rounded-xl p-4 h-64 overflow-y-auto shadow-inner">
            {logs.map((log, index) => (
              <div key={index} className="py-0.5 border-b border-gray-800/40">
                {log}
              </div>
            ))}
          </div>
        )}

        {/* Success Prompt */}
        {success && (
          <div className="mt-6 text-center bg-green-50 border border-green-200 text-green-800 rounded-xl p-4">
            <h3 className="font-heading font-bold text-lg mb-1">🎉 Seed Succeeded!</h3>
            <p className="text-sm">
              All mock products & catalogs are now live in your Supabase instance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedDatabase;
