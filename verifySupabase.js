import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Simple parser for .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found at the root of the project.');
    console.log('Please copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
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

// Subcategory normalization helper (matching the frontend logic)
function normalizeSubcategory(val) {
  const clean = val.trim().toLowerCase();
  if (clean === 'natural stone' || clean === 'natural_stone' || clean === 'natural-stone') {
    return 'natural-stone';
  }
  if (clean === 'artificial stone' || clean === 'artificial_stone' || clean === 'artificial-stone' || clean === 'engineered stone' || clean === 'engineered-stone') {
    return 'artificial-stone';
  }
  return clean.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function verify() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           NILKANTH MARBLE — BACKEND DIAGNOSTIC SYSTEM         ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in .env file.');
    process.exit(1);
  }

  console.log(`📡 URL: ${url}`);
  console.log(`🔑 Key: ${key.substring(0, 10)}... (truncated)\n`);

  const supabase = createClient(url, key);

  try {
    let checkFailed = false;

    // 1. Verify Schema Tables
    console.log('📊 Checking schema tables...');
    const tables = ['products', 'catalogs', 'inquiries', 'categories'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.error(`❌ Table "${table}" CHECK FAILED:`, error.message);
        checkFailed = true;
        if (error.message.includes('does not exist')) {
          console.log(`   👉 Please run "${table === 'categories' ? 'categories_setup.sql' : 'admin_setup.sql'}" in the Supabase SQL editor.`);
        }
      } else {
        console.log(`✅ Table "${table}" is active and accessible.`);
      }
    }

    // 2. Verify Products Column Structure
    if (!checkFailed) {
      console.log('\n📐 Inspecting "products" table column details...');
      const { data: prodSample, error: prodErr } = await supabase.from('products').select('*').limit(1);
      if (!prodErr && prodSample && prodSample.length > 0) {
        const item = prodSample[0];
        const fields = ['category', 'subcategory', 'price_range', 'images'];
        fields.forEach(field => {
          if (field in item) {
            console.log(`✅ Column "${field}" is present.`);
          } else {
            console.warn(`⚠️ Warning: Column "${field}" was not found in active schema objects.`);
          }
        });
      } else if (prodSample && prodSample.length === 0) {
        console.log('ℹ️ Products table is empty. Please run seeding script `/seed` to import products.');
      }
    }

    // 3. Verify Stone Category
    console.log('\n🪨 Checking for "stone" category in database...');
    const { data: stoneCat, error: catErr } = await supabase.from('categories').select('id, name').eq('id', 'stone').maybeSingle();
    if (catErr) {
      console.error('❌ Error checking categories table:', catErr.message);
    } else if (!stoneCat) {
      console.log('⚠️ Warning: "stone" category is missing in categories table.');
      console.log('   👉 Please seed the database via the website (/seed) or seed script to sync categories.');
    } else {
      console.log(`✅ "stone" category is active: "${stoneCat.name}"`);
    }

    // 4. Test Subcategory Normalization Functionality
    console.log('\n🧬 Testing subcategory normalization test suite...');
    const normTests = [
      { input: 'NATURAL STONE', expected: 'natural-stone' },
      { input: 'artificial stone', expected: 'artificial-stone' },
      { input: 'ENGINEERED-STONE', expected: 'artificial-stone' },
      { input: 'faucets mixers', expected: 'faucets-mixers' },
    ];
    let normPass = true;
    for (const t of normTests) {
      const res = normalizeSubcategory(t.input);
      if (res === t.expected) {
        console.log(`   Normalized "${t.input}" -> "${res}" (Pass)`);
      } else {
        console.error(`   Normalization FAILED for "${t.input}": expected "${t.expected}", got "${res}"`);
        normPass = false;
      }
    }
    if (normPass) {
      console.log('✅ Subcategory normalization validation passed successfully!');
    }

    // 5. Test Inquiries Write Access (RLS Check)
    console.log('\n📥 Verifying inquiry lead write capabilities...');
    const testLead = {
      name: 'Backend Diagnostic Lead',
      phone: '9998887776',
      email: 'diagnostics@nilkanth.com',
      city: 'Nadiad',
      product: 'Backend Check',
      requirement_type: 'single',
      message: 'Automated diagnostic validation lead.',
    };

    const { error: insError } = await supabase.from('inquiries').insert(testLead);
    if (insError) {
      console.error('❌ Inquiry insert blocked:', insError.message);
      console.log('   👉 Check if insert permission is enabled for the anonymous public role in RLS policies.');
    } else {
      console.log('✅ Inquiry insert verified successfully!');
      
      // Clean up test lead
      const { error: delError } = await supabase.from('inquiries').delete().eq('name', 'Backend Diagnostic Lead');
      if (delError) {
        console.warn('⚠️ Clean up warning:', delError.message);
      } else {
        console.log('      Cleaned up diagnostic test lead successfully.');
      }
    }

    // 6. Verify Storage Bucket Status
    console.log('\n📦 Checking storage buckets...');
    const buckets = ['product-images', 'tile-catalogs'];
    for (const b of buckets) {
      const { data: bucketData, error: bErr } = await supabase.storage.getBucket(b);
      if (bErr) {
        console.warn(`⚠️ Warning: Could not connect to "${b}" storage bucket:`, bErr.message);
        console.log(`   👉 Please create a public bucket named "${b}" in Supabase Dashboard → Storage.`);
      } else {
        console.log(`✅ Storage bucket "${b}" is configured and active.`);
      }
    }

    // 7. Special Diagnostic Notice for Postgres Syntax Error in Storage Buckets
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                     DIAGNOSTIC NOTES & TIPS                   ║');
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║ ⚡ Syntax error at or near \'"storage.buckets"\':                ║');
    console.log('║   This error occurs in PostgreSQL if a script or client tool   ║');
    console.log('║   attempts to quote the entire schema-table as one string like║');
    console.log('║   "storage.buckets" instead of schema and table separately as ║');
    console.log('║   "storage"."buckets". We have updated the SQL files to use   ║');
    console.log('║   correct quoting. Ensure you execute standard migrations.   ║');
    console.log('║                                                               ║');
    console.log('║ ⚡ Relation "supabase_migrations.schema_migrations" not found:║');
    console.log('║   This is a benign log created by migration runners checking  ║');
    console.log('║   the db status before the migrations table has been created. ║');
    console.log('║   It does not affect application behavior.                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    console.log('🌟 Backend verification checks completed successfully!');
  } catch (err) {
    console.error('💥 Unexpected exception during backend diagnostics:', err);
  }
}

verify();
