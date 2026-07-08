-- ══════════════════════════════════════════════════
-- NILKANTH MARBLE — Dynamic Catalog Type Migration
-- Run this ONCE in Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════

-- 1. Add parent_tab column (groups catalogs into main sections: tiles, sanitary, stone, etc.)
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS parent_tab TEXT DEFAULT 'tiles';

-- 2. Add human-readable label for each catalog_type (shown as sub-tab on frontend)
ALTER TABLE catalogs ADD COLUMN IF NOT EXISTS catalog_type_label TEXT;

-- 3. Backfill parent_tab for existing catalogs based on current catalog_type
UPDATE catalogs SET parent_tab = 'tiles'
WHERE catalog_type ILIKE '%floor-tile%'
   OR catalog_type ILIKE '%wall-tile%'
   OR catalog_type ILIKE '%bathroom-tile%'
   OR catalog_type ILIKE '%designer-tile%'
   OR catalog_type ILIKE '%vitrified%'
   OR catalog_type ILIKE '%tile%';

UPDATE catalogs SET parent_tab = 'sanitary'
WHERE catalog_type ILIKE '%sanitary%';

UPDATE catalogs SET parent_tab = 'artificial-stone'
WHERE catalog_type ILIKE '%artificial-stone%';

UPDATE catalogs SET parent_tab = 'stone'
WHERE catalog_type ILIKE '%natural-cladding%'
   OR catalog_type ILIKE '%cladding%'
   OR catalog_type ILIKE '%slate%'
   OR catalog_type ILIKE '%quartzite%';

-- 4. Backfill catalog_type_label from catalog_type (auto-generate readable label)
UPDATE catalogs
SET catalog_type_label = REPLACE(REPLACE(catalog_type, '-', ' '), '_', ' ')
WHERE catalog_type_label IS NULL;

-- Done!
SELECT 'Migration complete. parent_tab and catalog_type_label columns added.' AS status;
