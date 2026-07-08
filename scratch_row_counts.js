import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

// Use service role key to bypass RLS policies and see everything
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCounts() {
  console.log('Connecting to:', supabaseUrl);
  
  const tables = ['products', 'catalogs', 'categories', 'inquiries'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.log(`Table "${table}": Error or doesn't exist (${error.message})`);
      } else {
        console.log(`Table "${table}": ${count} rows`);
      }
    } catch (e) {
      console.log(`Table "${table}": Query failed (${e.message})`);
    }
  }
}

getCounts();
