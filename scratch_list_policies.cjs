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
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabaseAdmin = createClient(url, serviceKey);

  try {
    console.log('Querying pg_policies...');
    const { data, error } = await supabaseAdmin
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public');

    if (error) {
      console.log('Could not select from pg_policies. Error:', error.message);
    } else {
      console.log('Policies found in database:');
      data.forEach(p => {
        console.log(`- Table: ${p.tablename}, Policy: ${p.policyname}, Cmd: ${p.cmd}, Roles: ${p.roles}, Qual: ${p.qual}`);
      });
    }
  } catch (err) {
    console.error('Err:', err);
  }
}

run();
