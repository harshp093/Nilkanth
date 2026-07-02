-- ══════════════════════════════════════════════════════════════
-- NILKANTH MARBLE — ADMIN PANEL DATABASE & POLICY SETUP
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- 1. ENSURE TABLES EXIST
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id              TEXT PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  price_range     TEXT,
  origin          TEXT,
  thickness_options TEXT[]  DEFAULT '{}',
  size_options      TEXT[]  DEFAULT '{}',
  finish_options    TEXT[]  DEFAULT '{}',
  colors            TEXT[]  DEFAULT '{}',
  color_names       TEXT[]  DEFAULT '{}',
  application       TEXT[]  DEFAULT '{}',
  brand           TEXT,
  model_number    TEXT,
  material        TEXT,
  is_featured     BOOLEAN  DEFAULT FALSE,
  is_active       BOOLEAN  DEFAULT TRUE,
  images          TEXT[]   DEFAULT '{}',
  view_count      INT      DEFAULT 0,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS catalogs (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  company         TEXT NOT NULL,
  description     TEXT,
  pdf_url         TEXT,
  thumbnail_url   TEXT NOT NULL DEFAULT 'https://placehold.co/400x300/111/C8962E?text=Catalog',
  catalog_type    TEXT NOT NULL DEFAULT 'tiles',
  tags            TEXT[]   DEFAULT '{}',
  page_count      INT,
  view_count      INT      DEFAULT 0,
  download_count  INT      DEFAULT 0,
  is_active       BOOLEAN  DEFAULT TRUE,
  bucket_name     TEXT,
  file_size_bytes BIGINT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS inquiries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT,
  city             TEXT,
  product          TEXT,
  requirement_type TEXT,
  message          TEXT,
  status           TEXT DEFAULT 'unread',
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ─────────────────────────────────────────
-- 2. ENABLE ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- 3. CLEAN UP EXISTING POLICIES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read active products" ON products;
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Allow admin full access to products" ON products;

DROP POLICY IF EXISTS "Public read active catalogs" ON catalogs;
DROP POLICY IF EXISTS "Admin full access catalogs" ON catalogs;
DROP POLICY IF EXISTS "Allow admin full access to catalogs" ON catalogs;

DROP POLICY IF EXISTS "Public insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin read all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin delete inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow admin full access to inquiries" ON inquiries;

-- ─────────────────────────────────────────
-- 4. DEFINE ROBUST TABLE RLS POLICIES
-- ─────────────────────────────────────────

-- Products Policies
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Catalogs Policies
CREATE POLICY "Public read active catalogs" ON catalogs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to catalogs" ON catalogs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inquiries Policies
CREATE POLICY "Public insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access to inquiries" ON inquiries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ─────────────────────────────────────────
-- 5. STORAGE BUCKETS SETUP & RLS POLICIES
-- ─────────────────────────────────────────

-- Ensure storage schema is active (standard Supabase bucket structure)
INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('tile-catalogs', 'tile-catalogs', true)
  ON CONFLICT (id) DO NOTHING;

-- Expand maximum file upload limit to 150MB for tile-catalogs bucket
UPDATE "storage"."buckets"
SET file_size_limit = 157286400
WHERE id = 'tile-catalogs';

-- Clean up storage policies to avoid conflicts
DROP POLICY IF EXISTS "Public read product images" ON "storage"."objects";
DROP POLICY IF EXISTS "Authenticated upload product images" ON "storage"."objects";
DROP POLICY IF EXISTS "Authenticated delete product images" ON "storage"."objects";
DROP POLICY IF EXISTS "Authenticated update product images" ON "storage"."objects";

DROP POLICY IF EXISTS "Public read tile catalogs" ON "storage"."objects";
DROP POLICY IF EXISTS "Authenticated upload tile catalogs" ON "storage"."objects";
DROP POLICY IF EXISTS "Authenticated delete tile catalogs" ON "storage"."objects";
DROP POLICY IF EXISTS "Authenticated update tile catalogs" ON "storage"."objects";

-- Product Images bucket policies
CREATE POLICY "Public read product images" ON "storage"."objects"
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload product images" ON "storage"."objects"
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated update product images" ON "storage"."objects"
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated delete product images" ON "storage"."objects"
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- Tile Catalogs bucket policies
CREATE POLICY "Public read tile catalogs" ON "storage"."objects"
  FOR SELECT USING (bucket_id = 'tile-catalogs');

CREATE POLICY "Authenticated upload tile catalogs" ON "storage"."objects"
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tile-catalogs');

CREATE POLICY "Authenticated update tile catalogs" ON "storage"."objects"
  FOR UPDATE TO authenticated USING (bucket_id = 'tile-catalogs') WITH CHECK (bucket_id = 'tile-catalogs');

CREATE POLICY "Authenticated delete tile catalogs" ON "storage"."objects"
  FOR DELETE TO authenticated USING (bucket_id = 'tile-catalogs');

-- Additional overflow buckets policies (if they exist)
CREATE POLICY "Public read catalogs b" ON "storage"."objects" FOR SELECT USING (bucket_id = 'tile-catalogs-b');
CREATE POLICY "Authenticated upload catalogs b" ON "storage"."objects" FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tile-catalogs-b');
CREATE POLICY "Authenticated delete catalogs b" ON "storage"."objects" FOR DELETE TO authenticated USING (bucket_id = 'tile-catalogs-b');

-- ─────────────────────────────────────────
-- 6. DYNAMIC CATEGORY MIGRATION & ENUMS
-- ─────────────────────────────────────────
-- Ensure enum type is altered if it exists in Supabase
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
    ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'stone';
    ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'adhesives-chemicals';
  END IF;
END $$;

-- Migrate existing products to new 'stone' category if categorized as granite with natural/artificial subcategory
UPDATE products
SET category = 'stone'
WHERE category = 'granite' 
  AND (subcategory = 'natural-stone' OR subcategory = 'artificial-stone');
