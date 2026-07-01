/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { allProducts } from '../data/products';
import type { NProduct, ProductCategory } from '../data/products';
import { tilesCatalogs } from '../data/catalogs';
import type { TilesCatalog } from '../data/catalogs';
import { categories as staticCategories } from '../data/categories';
import type { Category } from '../data/categories';

/**
 * Hook to load products dynamically from Supabase (or fallback to mock data)
 */
export function useSupabaseProducts(category?: ProductCategory) {
  const [products, setProducts] = useState<NProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Graceful fallback to mock data if Supabase keys are missing
      if (!supabase) {
        let local = allProducts;
        if (category) {
          local = local.filter((p) => p.category === category && p.isActive);
        }
        setProducts(local);
        setLoading(false);
        return;
      }

      try {
        let query = supabase.from('products').select('*').eq('is_active', true);
        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) {
          throw error;
        }

        // Map column name styles from db under_score back to camelCase
        const mappedProducts = (data || []).map((item: any) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          description: item.description,
          category: item.category as ProductCategory,
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
          images: item.images,
          viewCount: item.view_count,
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching products from Supabase:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category]);

  return { products, loading };
}

/**
 * Hook to load a single product by slug dynamically
 */
export function useSupabaseProductDetail(slug: string) {
  const [product, setProduct] = useState<NProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!supabase) {
        const found = allProducts.find((p) => p.slug === slug);
        setProduct(found || null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const mapped: NProduct = {
            id: data.id,
            slug: data.slug,
            name: data.name,
            description: data.description,
            category: data.category as ProductCategory,
            subcategory: data.subcategory,
            priceRange: data.price_range,
            origin: data.origin,
            thicknessOptions: data.thickness_options,
            sizeOptions: data.size_options,
            finishOptions: data.finish_options,
            colors: data.colors,
            colorNames: data.color_names,
            application: data.application,
            brand: data.brand,
            modelNumber: data.model_number,
            material: data.material,
            isFeatured: data.is_featured,
            isActive: data.is_active,
            images: data.images,
            viewCount: data.view_count,
          };
          setProduct(mapped);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to get product from Supabase:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [slug]);

  return { product, loading };
}

/**
 * Hook to load tile catalogs from Supabase
 */
export function useSupabaseCatalogs() {
  const [catalogs, setCatalogs] = useState<TilesCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCatalogs() {
      if (!supabase) {
        setCatalogs(tilesCatalogs);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('catalogs')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        const mapped: TilesCatalog[] = (data || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          company: c.company,
          description: c.description,
          pdfUrl: c.pdf_url,
          thumbnailUrl: c.thumbnail_url,
          catalogType: c.catalog_type,
          tags: c.tags,
          pageCount: c.page_count,
          viewCount: c.view_count,
          downloadCount: c.download_count,
          isActive: c.is_active,
        }));

        setCatalogs(mapped);
      } catch (err) {
        console.error('Error fetching catalogs from Supabase:', err);
        setCatalogs([]);
      } finally {
        setLoading(false);
      }
    }

    getCatalogs();
  }, []);

  return { catalogs, loading };
}

/**
 * Hook to load categories dynamically from Supabase (or fallback to static data)
 */
export function useSupabaseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCategories() {
      if (!supabase) {
        setCategories(staticCategories);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) {
          // If categories table doesn't exist, fall back to static list gracefully
          if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
            console.warn('Categories table does not exist in Supabase, using static fallback.');
            setCategories(staticCategories);
          } else {
            throw error;
          }
          return;
        }

        if (!data || data.length === 0) {
          setCategories([]);
          return;
        }

        const mapped: Category[] = data.map((c: any) => ({
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
        }));

        setCategories(mapped);
      } catch (err) {
        console.error('Error fetching categories from Supabase, using static fallback:', err);
        setCategories(staticCategories);
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  return { categories, loading };
}
