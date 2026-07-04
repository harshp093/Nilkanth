/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { allProducts } from '../data/products';
import type { NProduct, ProductCategory } from '../data/products';
import { tilesCatalogs } from '../data/catalogs';
import type { TilesCatalog } from '../data/catalogs';
import { categories as staticCategories } from '../data/categories';
import type { Category } from '../data/categories';

/**
 * Hook to load products dynamically from static edge cache (or fallback to mock data)
 */
export function useSupabaseProducts(category?: ProductCategory) {
  const [products, setProducts] = useState<NProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/products.json');
        if (!res.ok) throw new Error('Failed to load static products file');
        const data = await res.json();
        
        let local = data as NProduct[];
        if (category) {
          local = local.filter((p) => p.category === category && p.isActive);
        } else {
          local = local.filter((p) => p.isActive);
        }
        setProducts(local);
      } catch (err) {
        console.warn('Failed to load static products JSON, using mock fallback:', err);
        let local = allProducts;
        if (category) {
          local = local.filter((p) => p.category === category && p.isActive);
        }
        setProducts(local);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category]);

  return { products, loading };
}

/**
 * Hook to load a single product by slug dynamically from static edge cache
 */
export function useSupabaseProductDetail(slug: string) {
  const [product, setProduct] = useState<NProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await fetch('/data/products.json');
        if (!res.ok) throw new Error('Failed to load static products file');
        const data = await res.json();
        const found = (data as NProduct[]).find((p) => p.slug === slug);
        setProduct(found || null);
      } catch (err) {
        console.warn('Failed to load static product details JSON, using mock fallback:', err);
        const found = allProducts.find((p) => p.slug === slug);
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [slug]);

  return { product, loading };
}

/**
 * Hook to load tile catalogs from static edge cache
 */
export function useSupabaseCatalogs() {
  const [catalogs, setCatalogs] = useState<TilesCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCatalogs() {
      try {
        const res = await fetch('/data/catalogs.json');
        if (!res.ok) throw new Error('Failed to load static catalogs file');
        const data = await res.json();
        setCatalogs(data as TilesCatalog[]);
      } catch (err) {
        console.warn('Failed to load static catalogs JSON, using mock fallback:', err);
        setCatalogs(tilesCatalogs);
      } finally {
        setLoading(false);
      }
    }

    getCatalogs();
  }, []);

  return { catalogs, loading };
}

/**
 * Hook to load categories dynamically from static edge cache
 */
export function useSupabaseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch('/data/categories.json');
        if (!res.ok) throw new Error('Failed to load static categories file');
        const data = await res.json();
        setCategories(data as Category[]);
      } catch (err) {
        console.warn('Failed to load static categories JSON, using static fallback:', err);
        setCategories(staticCategories);
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  return { categories, loading };
}
