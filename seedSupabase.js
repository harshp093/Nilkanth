import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Simple parser for .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found at the root of the project.');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value;
    }
  });
  return env;
}

async function seed() {
  console.log('🚀 Starting admin database sync from local files...');
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('❌ Error: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env file.');
    process.exit(1);
  }

  // Load compiled data dynamically using ES imports
  const productsPath = path.resolve(process.cwd(), 'dist-temp/products.js');
  const catalogsPath = path.resolve(process.cwd(), 'dist-temp/catalogs.js');
  const categoriesPath = path.resolve(process.cwd(), 'dist-temp/categories.js');

  if (!fs.existsSync(productsPath) || !fs.existsSync(catalogsPath) || !fs.existsSync(categoriesPath)) {
    console.error('❌ Error: Compiled JS files not found. Please compile TS files first.');
    process.exit(1);
  }

  // Use dynamic imports for ESNext modules
  const { allProducts } = await import('./dist-temp/products.js');
  const { tilesCatalogs } = await import('./dist-temp/catalogs.js');
  const { categories } = await import('./dist-temp/categories.js');

  console.log(`Connecting securely to: ${url}`);
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false }
  });

  try {
    // 1. Sync Products
    console.log(`\nSyncing ${allProducts.length} products with admin bypass...`);
    for (const prod of allProducts) {
      const dbProduct = {
        id: prod.id,
        slug: prod.slug,
        name: prod.name,
        description: prod.description || '',
        category: prod.category,
        subcategory: prod.subcategory || null,
        price_range: prod.priceRange || null,
        origin: prod.origin || null,
        thickness_options: prod.thicknessOptions || [],
        size_options: prod.sizeOptions || [],
        finish_options: prod.finishOptions || [],
        colors: prod.colors || [],
        color_names: prod.colorNames || [],
        application: prod.application || [],
        brand: prod.brand || null,
        model_number: prod.modelNumber || null,
        material: prod.material || null,
        is_featured: prod.isFeatured || false,
        is_active: prod.isActive || true,
        images: prod.images || [],
        view_count: prod.viewCount || 0,
      };

      const { error } = await supabase
        .from('products')
        .upsert(dbProduct, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error upserting product "${prod.name}":`, error.message);
      } else {
        console.log(`✅ Product synced: ${prod.name}`);
      }
    }

    // 2. Sync Catalogs
    console.log(`\nSyncing ${tilesCatalogs.length} tile catalogs with admin bypass...`);
    for (const cat of tilesCatalogs) {
      const dbCatalog = {
        id: cat.id,
        title: cat.title,
        company: cat.company,
        description: cat.description,
        pdf_url: cat.pdfUrl || null,
        thumbnail_url: cat.thumbnailUrl,
        catalog_type: cat.catalogType,
        tags: cat.tags || [],
        page_count: cat.pageCount || null,
        view_count: cat.viewCount || 0,
        download_count: cat.downloadCount || 0,
        is_active: cat.isActive || true,
      };

      const { error } = await supabase
        .from('catalogs')
        .upsert(dbCatalog, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error upserting catalog "${cat.title}":`, error.message);
      } else {
        console.log(`✅ Catalog synced: ${cat.title}`);
      }
    }

    // 3. Sync Categories
    console.log(`\nSyncing ${categories.length} categories with admin bypass...`);
    for (const cat of categories) {
      const dbCategory = {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        long_description: cat.longDescription || '',
        emoji: cat.emoji || '',
        color: cat.color || 'amber',
        accent_color: cat.accentColor || '#C8962E',
        image: cat.image,
        product_count: cat.productCount || 0,
        route: cat.route,
        group_name: cat.groupName || 'Natural Stone',
        is_active: true,
      };

      const { error } = await supabase
        .from('categories')
        .upsert(dbCategory, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error upserting category "${cat.name}":`, error.message);
      } else {
        console.log(`✅ Category synced: ${cat.name}`);
      }
    }

    console.log('\n🎉 Sync completed successfully!');

    // Cleanup temp directory
    console.log('🧹 Cleaning up temporary build files...');
    fs.rmSync(path.resolve(process.cwd(), 'dist-temp'), { recursive: true, force: true });
    console.log('✅ Temporary build files cleaned.');

  } catch (err) {
    console.error('💥 Unexpected error during sync:', err);
  }
}

seed();
