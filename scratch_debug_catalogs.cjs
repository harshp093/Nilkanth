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
    console.log('--- STORAGE BUCKETS ---');
    const { data: buckets, error: storageError } = await supabaseAdmin.storage.listBuckets();
    if (storageError) {
      console.error('Storage bucket retrieval failed:', storageError.message);
    } else {
      console.log('Available buckets:', buckets.map(b => ({ name: b.name, public: b.public })));
    }

    console.log('\n--- AUTH SIGN IN ---');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: tempPassword
    });

    if (authError) {
      console.error('Login failed:', authError.message);
      return;
    }
    console.log('Login succeeded. User ID:', authData.user.id);

    console.log('\n--- TESTING CATALOG UPSERT ---');
    const testId = `cat-test-${Date.now()}`;
    const payload = {
      id: testId,
      title: 'Debug Catalog Test',
      company: 'Somany',
      description: 'Test description',
      pdf_url: 'https://placeholder.com/test.pdf',
      thumbnail_url: 'https://placeholder.com/thumb.jpg',
      catalog_type: 'tiles',
      tags: ['Glossy', 'Digital'],
      is_active: true
    };

    console.log('Performing test insert using logged-in user session...');
    const { data: insData, error: insError } = await supabase.from('catalogs').insert(payload).select();
    if (insError) {
      console.error('❌ Insert failed:', insError.message, insError.details || '');
    } else {
      console.log('✅ Insert succeeded! Inserted record:', insData);

      console.log('Performing test update using logged-in user session...');
      const { data: updData, error: updError } = await supabase
        .from('catalogs')
        .update({ title: 'Updated Title' })
        .eq('id', testId)
        .select();

      if (updError) {
        console.error('❌ Update failed:', updError.message, updError.details || '');
      } else {
        console.log('✅ Update succeeded! Updated record:', updData);
      }

      // Cleanup
      await supabaseAdmin.from('catalogs').delete().eq('id', testId);
      console.log('Cleanup done.');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
