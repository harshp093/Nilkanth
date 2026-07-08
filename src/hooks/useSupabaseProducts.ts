/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { allProducts } from '../data/products';
import type { NProduct, ProductCategory } from '../data/products';
import { tilesCatalogs } from '../data/catalogs';
import type { TilesCatalog } from '../data/catalogs';
import { categories as staticCategories } from '../data/categories';
import type { Category } from '../data/categories';

// Map Supabase product row → NProduct shape
function mapProduct(item: any): NProduct {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description,
    category: item.category,
    subcategory: item.subcategory,
    priceRange: item.price_range,
    origin: item.origin,
    thicknessOptions: item.thickness_options,
    sizeOptions: item.size_options,
    finishOptions: item.finish_options,
    colors: item.colors,
    colorNames: item.color_names,
    application: item.application,
    brand: item.brand,
    modelNumber: item.model_number,
    material: item.material,
    isFeatured: item.is_featured,
    isActive: item.is_active,
    images: item.images || [],
    viewCount: item.view_count,
  };
}

// Map Supabase catalog row → TilesCatalog shape
function mapCatalog(c: any): TilesCatalog {
  return {
    id: c.id,
    title: c.title,
    company: c.company,
    description: c.description,
    pdfUrl: c.pdf_url,
    thumbnailUrl: c.thumbnail_url,
    catalogType: c.catalog_type,
    catalogTypeLabel: c.catalog_type_label || undefined,
    parentTab: c.parent_tab || 'tiles',
    tags: c.tags,
    pageCount: c.page_count,
    viewCount: c.view_count,
    downloadCount: c.download_count,
    isActive: c.is_active,
    isFeatured: c.is_featured || false,
    application: c.application || [],
  } as TilesCatalog;
}

/**
 * Hook to load products LIVE from Supabase (with mock fallback if DB unavailable)
 */
export function useSupabaseProducts(category?: ProductCategory) {
  const [products, setProducts] = useState<NProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (supabase) {
        try {
          let query = supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (category) {
            query = query.eq('category', category);
          }

          const { data, error } = await query;
          if (error) throw error;
          setProducts((data || []).map(mapProduct));
          return;
        } catch (err) {
          console.warn('Supabase live fetch failed, trying static JSON fallback:', err);
        }
      }

      // Fallback 1: static JSON file (built at deploy time)
      try {
        const res = await fetch('/data/products.json');
        if (!res.ok) throw new Error('Static JSON not found');
        const data = await res.json();
        let local = data as NProduct[];
        if (category) local = local.filter((p) => p.category === category && p.isActive);
        else local = local.filter((p) => p.isActive);
        setProducts(local);
        return;
      } catch {
        // Fallback 2: hardcoded mock data
        console.warn('Using hardcoded mock product data as last resort');
        let local = allProducts;
        if (category) local = local.filter((p) => p.category === category && p.isActive);
        setProducts(local);
      }
    }

    loadData().finally(() => setLoading(false));
  }, [category]);

  return { products, loading };
}

/**
 * Hook to load a single product by slug LIVE from Supabase
 */
export function useSupabaseProductDetail(slug: string) {
  const [product, setProduct] = useState<NProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();
          if (error) throw error;
          setProduct(data ? mapProduct(data) : null);
          return;
        } catch (err) {
          console.warn('Supabase live detail fetch failed:', err);
        }
      }

      // Fallback to static JSON
      try {
        const res = await fetch('/data/products.json');
        if (!res.ok) throw new Error('Static JSON not found');
        const data = await res.json();
        const found = (data as NProduct[]).find((p) => p.slug === slug);
        setProduct(found || null);
        return;
      } catch {
        const found = allProducts.find((p) => p.slug === slug);
        setProduct(found || null);
      }
    }

    loadDetail().finally(() => setLoading(false));
  }, [slug]);

  return { product, loading };
}

/**
 * Hook to load tile catalogs LIVE from Supabase
 */
export function useSupabaseCatalogs() {
  const [catalogs, setCatalogs] = useState<TilesCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCatalogs() {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('catalogs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          if (error) throw error;
          setCatalogs((data || []).map(mapCatalog));
          return;
        } catch (err) {
          console.warn('Supabase live catalogs fetch failed:', err);
        }
      }

      // Fallback to static JSON
      try {
        const res = await fetch('/data/catalogs.json');
        if (!res.ok) throw new Error('Static JSON not found');
        const data = await res.json();
        setCatalogs(data as TilesCatalog[]);
        return;
      } catch {
        setCatalogs(tilesCatalogs);
      }
    }

    getCatalogs().finally(() => setLoading(false));
  }, []);

  return { catalogs, loading };
}

/**
 * Hook to load categories LIVE from Supabase
 */
export function useSupabaseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true });
          if (error) throw error;
          if (data && data.length > 0) {
            setCategories(data.map((c: any) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
              description: c.description,
              longDescription: c.long_description || '',
              emoji: c.emoji || '',
              color: c.color || 'amber',
              accentColor: c.accent_color || '#C8962E',
              image: c.image,
              productCount: c.product_count || 0,
              route: c.route,
            } as Category)));
            return;
          }
        } catch (err) {
          console.warn('Supabase live categories fetch failed:', err);
        }
      }

      // Fallback to static JSON
      try {
        const res = await fetch('/data/categories.json');
        if (!res.ok) throw new Error('Static JSON not found');
        const data = await res.json();
        setCategories(data as Category[]);
        return;
      } catch {
        setCategories(staticCategories);
      }
    }

    getCategories().finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
