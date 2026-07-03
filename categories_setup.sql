-- ══════════════════════════════════════════════════════════════
-- NILKANTH MARBLE — CATEGORIES TABLE & POLICY SETUP
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS categories (
  id               TEXT PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  description      TEXT NOT NULL,
  long_description TEXT,
  emoji            TEXT,
  color            TEXT,
  accent_color     TEXT,
  image            TEXT NOT NULL,
  product_count    INT DEFAULT 0,
  route            TEXT NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE,
  group_name       TEXT DEFAULT 'Natural Stone',
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Alter table to add group_name column if it does not exist (for existing setups)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT 'Natural Stone';

-- Alter products table category column to TEXT (removes enum constraint for dynamic categories)
ALTER TABLE products ALTER COLUMN category TYPE TEXT;

-- ─────────────────────────────────────────
-- ENABLE ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- CLEAN UP POLICIES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read active categories" ON categories;
DROP POLICY IF EXISTS "Allow admin full access to categories" ON categories;

-- ─────────────────────────────────────────
-- DEFINE ROBUST POLICIES
-- ─────────────────────────────────────────
CREATE POLICY "Public read active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────
-- CATEGORY DATA MIGRATION & CLEANUP
-- ─────────────────────────────────────────

-- Delete removed categories from database
DELETE FROM categories WHERE id IN ('stone', 'sanitary-ware', 'tiles-catalog', 'kota-others');

-- Insert or update the new correct categories
INSERT INTO categories (id, slug, name, description, long_description, emoji, color, accent_color, image, route, group_name, is_active)
VALUES 
  ('marble', 'marble', 'Marble', 'Premium Italian & Indian marble', 'From iconic Carrara White to rare Portoro Gold — world-class marble varieties for luxury flooring, wall cladding, countertops and more.', '🪨', 'blue', '#1C3A6B', '/marble-calacatta.png', '/marble', 'Natural Stone', true),
  ('granite', 'granite', 'Granite', 'Natural granite slabs', 'Black Galaxy, Kashmir White, Tan Brown and other premium natural granites. Beautiful and durable natural stone slabs for kitchen countertops, flooring, and elevations.', '⬛', 'slate', '#374151', '/natural-stone-hero.png', '/granite', 'Natural Stone', true),
  ('kota-stone', 'kota-stone', 'Kota Stone', 'Kota stone & outdoor flooring', 'Kota blue and green limestone for outdoor use — pathways, pool sides, steps. Durable and slip-resistant natural limestone slabs.', '🟫', 'amber', '#C8962E', '/natural-stone-hero.png', '/kota-stone', 'Natural Stone', true),
  ('cladding-stone', 'cladding-stone', 'Natural Cladding Stone', 'Wall cladding & roofing slate', 'Premium natural cladding stone and slate varieties for feature walls, exterior elevations, and rustic roofing slate applications.', '🧱', 'amber', '#C8962E', '/natural-stone-hero.png', '/category/cladding-stone', 'Natural Stone', true),
  ('adhesives-chemicals', 'adhesives-chemicals', 'Chemicals', 'Tile adhesives & construction chemicals', 'High-performance polymer modified cement adhesives, white adhesives, epoxy grouts, and waterproofing chemicals by Roff (Pidilite), Laticrete, and Weber.', '🧪', 'emerald', '#059669', '/adhesives-hero.png', '/adhesives-chemicals', 'Chemicals', true)
ON CONFLICT (id) DO UPDATE SET 
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color,
  accent_color = EXCLUDED.accent_color,
  image = EXCLUDED.image,
  route = EXCLUDED.route,
  group_name = EXCLUDED.group_name,
  is_active = EXCLUDED.is_active;

-- ─────────────────────────────────────────
-- PRODUCT CATEGORY ASSOCIATIONS MIGRATION
-- ─────────────────────────────────────────

-- 1. Deactivate products under 'stone' or 'sanitary-ware' as they are now PDF catalog only
UPDATE products
SET is_active = false
WHERE category IN ('stone', 'sanitary-ware');

-- 2. Migrate products under 'kota-others' to the renamed 'kota-stone' category
UPDATE products
SET category = 'kota-stone'
WHERE category = 'kota-others';

-- 3. Move slate products (specifically roofing slate) to the new 'cladding-stone' category
UPDATE products
SET category = 'cladding-stone', subcategory = 'roofing-slate'
WHERE subcategory = 'slate' OR slug = 'roofing-slate';

-- 4. Update remaining kota stone subcategory names to just 'kota-stone'
UPDATE products
SET subcategory = 'kota-stone'
WHERE category = 'kota-stone';
