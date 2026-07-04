import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file parameters manually to load database keys
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key === 'VITE_SUPABASE_URL') supabaseUrl = value;
        if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = value;
      }
    });
  } catch (err) {
    console.warn('Could not read .env file, relying on system env vars:', err.message);
  }
}

const SITE_URL = "https://nilkanthmarble.com";

async function generate() {
  console.log('Generating dynamic sitemap...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase keys missing. Skipping dynamic sitemap generation.');
    return;
  }

  // Import createClient dynamically
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const now = new Date().toISOString().split('T')[0];

  // Static URLs
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/products</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/catalogs</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

  try {
    // Dynamic Categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, created_at');

    if (categories && categories.length > 0) {
      categories.forEach(cat => {
        const catDate = cat.created_at ? new Date(cat.created_at).toISOString().split('T')[0] : now;
        sitemapXml += `  <url>
    <loc>${SITE_URL}/products/${cat.slug}</loc>
    <lastmod>${catDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
      });
    }

    // Dynamic Products
    const { data: products } = await supabase
      .from('products')
      .select('slug, created_at')
      .eq('is_active', true);

    if (products && products.length > 0) {
      products.forEach(prod => {
        const prodDate = prod.created_at ? new Date(prod.created_at).toISOString().split('T')[0] : now;
        sitemapXml += `  <url>
    <loc>${SITE_URL}/product/${prod.slug}</loc>
    <lastmod>${prodDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
      });
    }
  } catch (err) {
    console.error('Error fetching data from Supabase for sitemap:', err.message);
  }

  sitemapXml += `</urlset>`;

  const destPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(destPath, sitemapXml, 'utf8');
  console.log(`Dynamic sitemap successfully written to ${destPath}!`);
}

generate();
