-- Run this in your Supabase SQL Editor to allow logged-in Admin accounts to manage all data.

-- 1. Enable Authenticated (Admin) access to Products
CREATE POLICY "Allow admin full access to products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Enable Authenticated (Admin) access to Catalogs
CREATE POLICY "Allow admin full access to catalogs" ON catalogs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Enable Authenticated (Admin) access to Inquiries
CREATE POLICY "Allow admin full access to inquiries" ON inquiries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
