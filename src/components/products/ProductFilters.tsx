import React from 'react';
import type { NProduct } from '../../data/products';
import type { FilterState } from './ProductGrid';

interface ProductFiltersProps {
  products: NProduct[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'marble', label: '🪨 Marble' },
  { value: 'granite', label: '⬛ Granite' },
  { value: 'kota-others', label: '🟫 Kota & Others' },
  { value: 'sanitary-ware', label: '🚿 Sanitary Ware' },
];

const FINISH_OPTIONS = ['Polished', 'Matte', 'Honed', 'Brushed', 'Flamed', 'Natural'];
const APPLICATION_OPTIONS = ['Flooring', 'Wall Cladding', 'Counter Top', 'Bathroom', 'Outdoor', 'Staircase', 'Pool Side'];

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, filters, onChange }) => {
  // Derive available colors from current product set
  const availableColors: { name: string; hex: string }[] = [];
  const seenColors = new Set<string>();
  products.forEach(p => {
    p.colorNames?.forEach((name, i) => {
      const key = name.toLowerCase();
      if (!seenColors.has(key)) {
        seenColors.add(key);
        availableColors.push({ name, hex: p.colors?.[i] || '#888' });
      }
    });
  });

  const toggle = (arr: string[], value: string): string[] =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const clearAll = () => onChange({ categories: [], colors: [], finishes: [], applications: [], search: '' });

  const hasFilters =
    filters.categories.length > 0 ||
    filters.colors.length > 0 ||
    filters.finishes.length > 0 ||
    filters.applications.length > 0;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-gray-900 text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary font-medium hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">Category</h4>
        <div className="space-y-2">
          {CATEGORY_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  filters.categories.includes(opt.value)
                    ? 'bg-primary border-primary'
                    : 'border-gray-300 group-hover:border-primary'
                }`}
                onClick={() => onChange({ ...filters, categories: toggle(filters.categories, opt.value) })}
              >
                {filters.categories.includes(opt.value) && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-gray-700 group-hover:text-primary cursor-pointer transition-colors"
                onClick={() => onChange({ ...filters, categories: toggle(filters.categories, opt.value) })}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Finish */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">Finish</h4>
        <div className="flex flex-wrap gap-1.5">
          {FINISH_OPTIONS.map(finish => (
            <button
              key={finish}
              onClick={() => onChange({ ...filters, finishes: toggle(filters.finishes, finish) })}
              className={`filter-chip ${filters.finishes.includes(finish) ? 'active' : ''}`}
            >
              {finish}
            </button>
          ))}
        </div>
      </div>

      {/* Application */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">Application</h4>
        <div className="space-y-2">
          {APPLICATION_OPTIONS.map(app => (
            <label key={app} className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  filters.applications.includes(app)
                    ? 'bg-primary border-primary'
                    : 'border-gray-300 group-hover:border-primary'
                }`}
                onClick={() => onChange({ ...filters, applications: toggle(filters.applications, app) })}
              >
                {filters.applications.includes(app) && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                )}
              </div>
              <span
                className="text-sm text-gray-700 group-hover:text-primary cursor-pointer transition-colors"
                onClick={() => onChange({ ...filters, applications: toggle(filters.applications, app) })}
              >
                {app}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider + count */}
      <div className="pt-2 border-t border-gray-100 text-center">
        <span className="text-xs text-gray-400">
          Showing {products.length} products
        </span>
      </div>
    </div>
  );
};

export default ProductFilters;
