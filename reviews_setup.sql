-- ══════════════════════════════════════════════════════════════
-- NILKANTH MARBLE — CUSTOMER REVIEWS SCHEMA
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT NOT NULL,
  city        TEXT,
  is_approved BOOLEAN DEFAULT TRUE, -- default to true so customer feedback is immediately visible
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 1. Public: read approved reviews
DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- 2. Public: submit reviews (anonymous insert)
DROP POLICY IF EXISTS "Public insert reviews" ON reviews;
CREATE POLICY "Public insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- 3. Admin (Authenticated): full access to manage, moderate and delete
DROP POLICY IF EXISTS "Admin full access reviews" ON reviews;
CREATE POLICY "Admin full access reviews" ON reviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
