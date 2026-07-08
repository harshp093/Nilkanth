import { S3Client, PutObjectCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────
// ALLOWED ORIGINS — Only these domains may call this API
// ⚠️  If you add a custom domain to Vercel (e.g. nilkanthmarble.com),
//     add it here AND redeploy. Without this, uploads will fail from
//     your custom domain due to CORS block.
// ─────────────────────────────────────────────────────────────────
const CUSTOM_DOMAIN = process.env.CUSTOM_DOMAIN || ''; // e.g. 'https://nilkanthmarble.com'

const ALLOWED_ORIGINS = [
  'https://nilkanth-marble.vercel.app',
  ...(CUSTOM_DOMAIN ? [CUSTOM_DOMAIN] : []),
  'http://localhost:5173',
  'http://localhost:4173',
];

// ─────────────────────────────────────────────────────────────────
// ALLOWED FILE TYPES — Strict allowlist (PDF + images only)
// ─────────────────────────────────────────────────────────────────
const ALLOWED_CONTENT_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]);

// ─────────────────────────────────────────────────────────────────
// ADMIN EMAIL ALLOWLIST — Server-side enforcement (not bypassable)
// ─────────────────────────────────────────────────────────────────
const ADMIN_EMAILS = ['harshpra1624@gmail.com'];

// ─────────────────────────────────────────────────────────────────
// IN-MEMORY RATE LIMITER
// 10 requests per IP per 60 seconds for presigned URL generation
// ─────────────────────────────────────────────────────────────────
const rateLimitStore = new Map(); // { ip: { count, resetAt } }
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Periodically clean up expired entries to prevent memory growth
// (Vercel instances are ephemeral so this is just good practice)
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore.entries()) {
    if (now > val.resetAt) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

// ─────────────────────────────────────────────────────────────────
// SANITIZE FILE NAME — Remove path traversal, limit length
// ─────────────────────────────────────────────────────────────────
function sanitizeFileName(name) {
  if (!name || typeof name !== 'string') return null;
  // Strip directory traversal and dangerous characters
  const cleaned = name
    .replace(/\.\./g, '')       // no ..
    .replace(/\//g, '')         // no forward slashes
    .replace(/\\/g, '')         // no backslashes
    .replace(/[^a-zA-Z0-9._\-]/g, '_') // only safe chars
    .slice(0, 200);             // max 200 chars
  return cleaned.length > 0 ? cleaned : null;
}

// ─────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // 1. Determine request origin for CORS
  const origin = req.headers.origin || '';
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  // Always set CORS headers — restrict to allowlist
  res.setHeader(
    'Access-Control-Allow-Origin',
    isAllowedOrigin ? origin : ALLOWED_ORIGINS[0]
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  // Block non-allowlisted origins (except for localhost dev flexibility)
  if (origin && !isAllowedOrigin) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // 2. Rate limiting — use Vercel's forwarded IP header
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';

  const rateCheck = checkRateLimit(clientIp);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);

  if (!rateCheck.allowed) {
    res.setHeader('Retry-After', rateCheck.retryAfter);
    return res.status(429).json({
      error: 'Too many requests. Please wait before uploading again.',
      retryAfter: rateCheck.retryAfter,
    });
  }

  // 3. Authenticate — verify Supabase JWT
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  const token = authHeader.slice(7); // strip "Bearer "

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[presigned-url] Supabase env vars missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized: invalid or expired session' });
  }

  // 4. SERVER-SIDE admin email check — cannot be bypassed from the browser
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
    console.warn(`[presigned-url] Unauthorized upload attempt by: ${user.email} from IP: ${clientIp}`);
    return res.status(403).json({ error: 'Forbidden: account is not authorized for uploads' });
  }

  // 5. Extract and validate upload parameters
  const rawFileName = req.query.fileName || req.body?.fileName;
  const contentType = (req.query.contentType || req.body?.contentType || '').toLowerCase();

  if (!rawFileName || !contentType) {
    return res.status(400).json({ error: 'fileName and contentType are required' });
  }

  // Validate file type
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    console.warn(`[presigned-url] Blocked upload: disallowed content type "${contentType}" from ${user.email}`);
    return res.status(400).json({
      error: `File type "${contentType}" is not allowed. Only PDF and image files are accepted.`,
    });
  }

  // Sanitize file name
  const fileName = sanitizeFileName(rawFileName);
  if (!fileName) {
    return res.status(400).json({ error: 'Invalid file name' });
  }

  // 6. Verify Datnass credentials
  const accessKeyId = process.env.DATNASS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.DATNASS_SECRET_ACCESS_KEY;
  const bucketName = process.env.DATNASS_BUCKET_NAME;
  const endpoint = process.env.DATNASS_ENDPOINT || 'https://s3.gdx.datnass.com';

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    console.error('[presigned-url] Datnass env vars missing');
    return res.status(500).json({ error: 'Storage service not configured' });
  }

  try {
    // 7. Initialize S3 client for Datnass GDX Cloud
    const s3Client = new S3Client({
      region: 'us-east-1',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    // 8. Configure CORS on the bucket (idempotent — safe to call each time)
    try {
      await s3Client.send(new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: ALLOWED_ORIGINS,
              AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD'],
              AllowedHeaders: ['*'],
              ExposeHeaders: ['ETag', 'Content-Length'],
              MaxAgeSeconds: 3600,
            },
          ],
        },
      }));
    } catch (corsErr) {
      // Non-fatal — bucket CORS may be set via console or already configured
      console.warn('[presigned-url] CORS setup skipped:', corsErr.message);
    }

    // 9. Generate presigned PUT URL (1 hour expiry)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const directPublicUrl = `${endpoint}/${bucketName}/${fileName}`;

    console.info(`[presigned-url] Generated URL for ${user.email}: ${fileName} (${contentType})`);

    return res.status(200).json({ uploadUrl, publicUrl: directPublicUrl, fileName });
  } catch (error) {
    console.error('[presigned-url] Error generating URL:', error.message);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
