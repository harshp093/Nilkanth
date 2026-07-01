import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Simple parser for .env file since dotenv is not in dependencies
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

async function verify() {
  console.log('🔍 Starting Supabase connection verification...');
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in .env file.');
    process.exit(1);
  }

  console.log(`Connecting to: ${url}`);
  const supabase = createClient(url, key);

  try {
    // 1. Verify Products Table Read Access
    console.log('\nChecking "products" table...');
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);

    if (prodError) {
      console.error('❌ Error reading products table:', prodError.message);
      console.log('👉 Make sure you ran the SQL script in the Supabase SQL Editor and enabled RLS policies.');
    } else {
      console.log('✅ Products table read access verified! Found:', products.length, 'record(s)');
    }

    // 2. Verify Catalogs Table Read Access
    console.log('\nChecking "catalogs" table...');
    const { data: catalogs, error: catError } = await supabase
      .from('catalogs')
      .select('id, title')
      .limit(1);

    if (catError) {
      console.error('❌ Error reading catalogs table:', catError.message);
    } else {
      console.log('✅ Catalogs table read access verified! Found:', catalogs.length, 'record(s)');
    }

    // 3. Verify Inquiries Table Write Access
    console.log('\nTesting "inquiries" table write access...');
    const testInquiry = {
      name: 'Test Verification Lead',
      phone: '9999999999',
      email: 'test@verification.com',
      city: 'Nadiad',
      product: 'Verification Check',
      requirement_type: 'single',
      message: 'This is an automated connection test message.',
    };

    const { error: insError } = await supabase
      .from('inquiries')
      .insert(testInquiry);

    if (insError) {
      console.error('❌ Error inserting test inquiry:', insError.message);
    } else {
      console.log('✅ Inquiries write access verified! Successfully inserted test lead.');
      
      // Clean up test inquiry
      const { error: delError } = await supabase
        .from('inquiries')
        .delete()
        .eq('name', 'Test Verification Lead');
      if (!delError) {
        console.log('🧹 Cleaned up verification test lead.');
      }
    }

    // 4. Verify Storage Bucket Link
    console.log('\nChecking "tiles-catalogs" Storage Bucket...');
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .getBucket('tiles-catalogs');

    if (bucketError) {
      console.warn('⚠️ Warning: Could not connect to "tiles-catalogs" storage bucket:', bucketError.message);
      console.log('👉 Make sure you created a public bucket named "tiles-catalogs" in your Supabase Storage dashboard.');
    } else {
      console.log('✅ "tiles-catalogs" storage bucket is configured correctly!');
    }

    console.log('\n🌟 Verification complete! If all checks passed green, your backend is 100% ready!');
  } catch (err) {
    console.error('💥 Unexpected exception during verification:', err);
  }
}

verify();
