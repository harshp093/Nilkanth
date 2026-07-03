import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  if (catError) {
    console.error('Error categories:', catError);
  } else {
    console.log('--- CATEGORIES ---');
    console.log(categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, is_active: c.is_active })));
  }

  const { data: products, error: prodError } = await supabase.from('products').select('id,name,category,subcategory');
  if (prodError) {
    console.error('Error products:', prodError);
  } else {
    console.log('--- PRODUCTS BY CATEGORY ---');
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    console.log(counts);
    console.log('Sample products:', products.slice(0, 5));
  }

  const { data: catalogs, error: catgError } = await supabase.from('catalogs').select('id,title,catalog_type');
  if (catgError) {
    console.error('Error catalogs:', catgError);
  } else {
    console.log('--- CATALOGS ---');
    console.log(catalogs.map(c => ({ id: c.id, title: c.title, type: c.catalog_type })));
  }
}

run();
