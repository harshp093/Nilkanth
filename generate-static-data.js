import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env variables manually
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
    console.warn('Could not read .env file, relying on environment variables:', err.message);
  }
}

async function run() {
  console.log('Generating static catalog datasets from Supabase database...');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase keys missing. Skipping static data compilation.');
    process.exit(0);
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const dataDir = path.join(__dirname, 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    // 1. Fetch Products
    console.log('Fetching products...');
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (pErr) throw pErr;

    const mappedProducts = (products || []).map(item => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description,
      category: item.category,
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
      viewCount: item.view_count
    }));

    fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(mappedProducts, null, 2), 'utf8');
    console.log(`Saved ${mappedProducts.length} products to products.json`);

    // 2. Fetch Catalogs
    console.log('Fetching catalogs...');
    const { data: catalogs, error: cErr } = await supabase
      .from('catalogs')
      .select('*')
      .eq('is_active', true);
    
    if (cErr) throw cErr;

    const mappedCatalogs = (catalogs || []).map(c => ({
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
      isFeatured: c.is_featured || false,
      application: c.application || []
    }));

    fs.writeFileSync(path.join(dataDir, 'catalogs.json'), JSON.stringify(mappedCatalogs, null, 2), 'utf8');
    console.log(`Saved ${mappedCatalogs.length} catalogs to catalogs.json`);

    // 3. Fetch Categories
    console.log('Fetching categories...');
    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (catErr) throw catErr;

    const mappedCategories = (categories || []).map(c => ({
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
      route: c.route
    }));

    fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(mappedCategories, null, 2), 'utf8');
    console.log(`Saved ${mappedCategories.length} categories to categories.json`);

    console.log('✅ All static datasets successfully compiled!');
  } catch (err) {
    console.error('❌ Compilation failure:', err.message);
  }
}

run();
