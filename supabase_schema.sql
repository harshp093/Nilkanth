-- ══════════════════════════════════════════════════════════════
-- NILKANTH MARBLE — COMPLETE SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Paste the ENTIRE file and click "Run"
-- ══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- 1. PRODUCTS TABLE
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

-- ─────────────────────────────────────────
-- 2. CATALOGS TABLE
-- ─────────────────────────────────────────
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

-- ─────────────────────────────────────────
-- 3. INQUIRIES TABLE
-- ─────────────────────────────────────────
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

-- ══════════════════════════════════════════════════════════════
-- 4. ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- PUBLIC READ POLICIES
-- NOTE: Supabase uses Postgres 15 — "CREATE POLICY IF NOT EXISTS" is NOT supported.
-- We use DROP...CREATE pattern to make this script re-runnable.
-- ─────────────────────────────────────────

-- Public: read active products
DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true);

-- Public: read active catalogs
DROP POLICY IF EXISTS "Public read active catalogs" ON catalogs;
CREATE POLICY "Public read active catalogs" ON catalogs
  FOR SELECT USING (is_active = true);

-- Public: submit inquiries (INSERT only)
DROP POLICY IF EXISTS "Public insert inquiries" ON inquiries;
CREATE POLICY "Public insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- ─────────────────────────────────────────
-- ADMIN (AUTHENTICATED) FULL-ACCESS POLICIES
-- ─────────────────────────────────────────

-- Products: full CRUD for signed-in admin
DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admin full access products" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Catalogs: full CRUD for signed-in admin
DROP POLICY IF EXISTS "Admin full access catalogs" ON catalogs;
CREATE POLICY "Admin full access catalogs" ON catalogs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inquiries: admin can read, update status, delete
DROP POLICY IF EXISTS "Admin read all inquiries" ON inquiries;
CREATE POLICY "Admin read all inquiries" ON inquiries
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin delete inquiries" ON inquiries;
CREATE POLICY "Admin delete inquiries" ON inquiries
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin update inquiries" ON inquiries;
CREATE POLICY "Admin update inquiries" ON inquiries
  FOR UPDATE
  TO authenticated
  USING (true);

-- ══════════════════════════════════════════════════════════════
-- 5. STORAGE BUCKETS
-- Create these manually in Supabase Dashboard → Storage → New Bucket
-- (set Public = YES / enabled for each)
--
--   product-images        ← for product photos (any image format)
--   tile-catalogs         ← PDF catalogs (primary bucket, 50MB limit)
--   tile-catalogs-b       ← overflow bucket
--   tile-catalogs-kajaria ← brand-specific bucket
--   tile-catalogs-somany  ← brand-specific bucket
--   tile-catalogs-johnson ← brand-specific bucket
--
-- OR insert them via SQL (requires storage schema access):
-- ══════════════════════════════════════════════════════════════
INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('tile-catalogs', 'tile-catalogs', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('tile-catalogs-b', 'tile-catalogs-b', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('tile-catalogs-kajaria', 'tile-catalogs-kajaria', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('tile-catalogs-somany', 'tile-catalogs-somany', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO "storage"."buckets" (id, name, public)
  VALUES ('tile-catalogs-johnson', 'tile-catalogs-johnson', true)
  ON CONFLICT (id) DO NOTHING;

-- Ensure all catalog buckets allow up to 150MB file uploads
UPDATE "storage"."buckets"
SET file_size_limit = 157286400
WHERE id LIKE 'tile-catalogs%';

-- ─────────────────────────────────────────
-- STORAGE ACCESS POLICIES
-- ─────────────────────────────────────────

-- Product images: public read
DROP POLICY IF EXISTS "Public read product images" ON "storage"."objects";
CREATE POLICY "Public read product images"
  ON "storage"."objects" FOR SELECT
  USING (bucket_id = 'product-images');

-- Product images: authenticated upload
DROP POLICY IF EXISTS "Authenticated upload product images" ON "storage"."objects";
CREATE POLICY "Authenticated upload product images"
  ON "storage"."objects" FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Product images: authenticated delete
DROP POLICY IF EXISTS "Authenticated delete product images" ON "storage"."objects";
CREATE POLICY "Authenticated delete product images"
  ON "storage"."objects" FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- Tile catalog PDFs: public read (all catalog buckets)
DROP POLICY IF EXISTS "Public read tile catalogs" ON "storage"."objects";
CREATE POLICY "Public read tile catalogs"
  ON "storage"."objects" FOR SELECT
  USING (bucket_id IN (
    'tile-catalogs','tile-catalogs-b',
    'tile-catalogs-kajaria','tile-catalogs-somany','tile-catalogs-johnson'
  ));

-- Tile catalog PDFs: authenticated upload
DROP POLICY IF EXISTS "Authenticated upload tile catalogs" ON "storage"."objects";
CREATE POLICY "Authenticated upload tile catalogs"
  ON "storage"."objects" FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN (
    'tile-catalogs','tile-catalogs-b',
    'tile-catalogs-kajaria','tile-catalogs-somany','tile-catalogs-johnson'
  ));

-- Tile catalog PDFs: authenticated delete
DROP POLICY IF EXISTS "Authenticated delete tile catalogs" ON "storage"."objects";
CREATE POLICY "Authenticated delete tile catalogs"
  ON "storage"."objects" FOR DELETE
  TO authenticated
  USING (bucket_id IN (
    'tile-catalogs','tile-catalogs-b',
    'tile-catalogs-kajaria','tile-catalogs-somany','tile-catalogs-johnson'
  ));

-- ══════════════════════════════════════════════════════════════
-- 6. AUTO-UPDATE TRIGGER FOR updated_at
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_catalogs_updated_at ON catalogs;
CREATE TRIGGER set_catalogs_updated_at
  BEFORE UPDATE ON catalogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════════════════════════════
-- DONE! All tables, RLS policies, storage buckets & triggers set up.
-- ══════════════════════════════════════════════════════════════

-- Ensure product_category enum is altered if it exists
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
