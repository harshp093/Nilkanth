import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client instance. If keys are missing, fallback gracefully to mock data
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (supabase && supabaseUrl) {
  // Route all storage traffic directly to storage hostname, bypassing Gateway
  if (supabaseUrl.includes('.supabase.co')) {
    const directStorageUrl = supabaseUrl.replace('.supabase.co', '.storage.supabase.co') + '/storage/v1';
    (supabase.storage as any).url = directStorageUrl;
  }
}

if (!supabase) {
  console.warn(
    '⚠️ Supabase VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are missing. ' +
    'The application will run in local mock data fallback mode.'
  );
}
