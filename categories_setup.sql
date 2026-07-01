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
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

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
