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

  const supabase = createClient(url, key);

  try {
    console.log('Simulating anonymous insert on "catalogs" table...');
    const testId = `anon-test-${Date.now()}`;
    const { error } = await supabase
      .from('catalogs')
      .insert({
         id: testId,
         title: 'Anon Insert Test',
         company: 'Test Company',
         thumbnail_url: 'https://placehold.co/400x300/111/C8962E?text=Catalog',
         catalog_type: 'tiles',
      });

    if (error) {
      console.log('❌ Anonymous insert failed:', error.message);
    } else {
      console.log('✅ Anonymous insert succeeded!');
      // Cleanup using admin client
      const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseAdmin = createClient(url, serviceKey);
      await supabaseAdmin.from('catalogs').delete().eq('id', testId);
      console.log('Cleaned up test record.');
    }
  } catch (err) {
    console.error('Err:', err);
  }
}

run();
