import { S3Client, PutObjectCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers (for our own API endpoint)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // 1. Authenticate with Supabase — only admin users can upload
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: 'Supabase credentials missing on server.' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized: ' + (authError?.message || 'Invalid user session') });
  }

  // 2. Extract file upload parameters
  const fileName = req.query.fileName || req.body?.fileName;
  const contentType = req.query.contentType || req.body?.contentType;

  if (!fileName || !contentType) {
    return res.status(400).json({ error: 'fileName and contentType are required' });
  }

  // 3. Verify Datnass GDX Cloud Credentials
  const accessKeyId = process.env.DATNASS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.DATNASS_SECRET_ACCESS_KEY;
  const bucketName = process.env.DATNASS_BUCKET_NAME;
  const endpoint = process.env.DATNASS_ENDPOINT || 'https://s3.gdx.datnass.com';

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    return res.status(500).json({ error: 'Datnass storage environment variables are not configured.' });
  }

  try {
    // 4. Initialize S3 Client pointing to Datnass GDX Cloud
    const s3Client = new S3Client({
      region: 'us-east-1',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    // 5. Ensure CORS is configured on the bucket (idempotent — safe to call every time)
    //    This allows browsers on nilkanth-marble.vercel.app to PUT files directly.
    try {
      await s3Client.send(new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: ['https://nilkanth-marble.vercel.app', 'http://localhost:5173', 'http://localhost:4173'],
              AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD'],
              AllowedHeaders: ['*'],
              ExposeHeaders: ['ETag', 'Content-Length'],
              MaxAgeSeconds: 3600,
            },
          ],
        },
      }));
    } catch (corsErr) {
      // Non-fatal — log but continue. CORS set via UI is fine too.
      console.warn('CORS setup skipped (may not be supported or already set):', corsErr.message);
    }

    // 6. Generate Presigned PUT URL (valid for 1 hour)
    //    ACL: 'public-read' works now that bucket ownership = "Object Writer" (ACLs enabled)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: contentType,
      ACL: 'public-read', // Object Writer ownership mode allows this — makes file publicly accessible
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // 7. The public URL is the direct S3 path — no proxy needed since ACL makes it public!
    const directPublicUrl = `${endpoint}/${bucketName}/${fileName}`;

    return res.status(200).json({
      uploadUrl,
      publicUrl: directPublicUrl,
      fileName,
    });
  } catch (error) {
    console.error('Error generating presigned Datnass URL:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL: ' + error.message });
  }
}
