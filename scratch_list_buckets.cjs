const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
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

async function run() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(url, key);
  const supabaseAdmin = createClient(url, serviceKey);

  const adminEmail = 'harshpra1624@gmail.com';
  const tempPassword = 'tempPassword123!@#';

  try {
    console.log('Signing in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: tempPassword
    });

    if (authError) {
      console.error('Login failed:', authError.message);
      return;
    }
    console.log('Login succeeded.');

    console.log('Inserting test catalog...');
    const testId = `cat-test-pdf-${Date.now()}`;
    const testPayload = {
      id: testId,
      title: 'Auth PDF Test',
      company: 'Colortile',
      pdf_url: 'https://nbmvvwvhjiubedlyfuyb.supabase.co/storage/v1/object/public/tile-catalogs/catalog_test.pdf',
      thumbnail_url: 'https://placehold.co/400x300/111/C8962E?text=Catalog',
      catalog_type: 'floor-tiles',
      is_active: true
    };

    const { data: insData, error: insError } = await supabase.from('catalogs').insert(testPayload).select();
    if (insError) {
      console.error('❌ Insert failed:', insError.message);
    } else {
      console.log('✅ Insert succeeded! Inserted record:', insData);
      
      // Cleanup
      await supabaseAdmin.from('catalogs').delete().eq('id', testId);
      console.log('Cleanup done.');
    }

  } finally {
    console.log('Finished.');
  }
}

run();
