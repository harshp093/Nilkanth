import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
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
  const supabase = createClient(url, serviceKey);

  console.log('--- STORAGE BUCKETS AND FILES ---');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('Failed to list buckets:', bucketError.message);
    return;
  }

  for (const bucket of buckets) {
    console.log(`\nBucket: "${bucket.name}" (Public: ${bucket.public})`);
    
    // Recursive list files in bucket
    let allFiles = [];
    async function listFolder(folderPath = '') {
      const { data: files, error } = await supabase.storage.from(bucket.name).list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
      
      if (error) {
        console.error(`Error listing folder "${folderPath}" in "${bucket.name}":`, error.message);
        return;
      }

      for (const file of files) {
        const fullPath = folderPath ? `${folderPath}/${file.name}` : file.name;
        if (file.id === null) {
          // It's a folder, list contents
          await listFolder(fullPath);
        } else {
          allFiles.push({
            name: fullPath,
            size: file.metadata?.size || 0,
            mimeType: file.metadata?.mimetype || 'unknown',
            created: file.created_at
          });
        }
      }
    }

    await listFolder();
    
    if (allFiles.length === 0) {
      console.log('  No files found.');
    } else {
      let totalSize = 0;
      allFiles.forEach(f => {
        totalSize += f.size;
        console.log(`  - ${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB) - ${f.mimeType}`);
      });
      console.log(`  Total files: ${allFiles.length}, Total Size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    }
  }
}

run();
