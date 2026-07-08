/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   (Typed structures matching the Postgres schemas)
────────────────────────────────────────────────────────────────── */

interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  price_range: string | null;
  origin: string | null;
  thickness_options: string[];
  size_options: string[];
  finish_options: string[];
  colors: string[];
  color_names: string[];
  application: string[];
  brand: string | null;
  model_number: string | null;
  material: string | null;
  is_featured: boolean;
  is_active: boolean;
  images: string[];
  view_count: number;
  created_at: string;
}

interface CatalogRecord {
  id: string;
  title: string;
  company: string;
  description: string | null;
  pdf_url: string | null;
  thumbnail_url: string;
  catalog_type: string;
  catalog_type_label: string | null;
  parent_tab: string;
  tags: string[];
  page_count: number | null;
  view_count: number;
  download_count: number;
  is_active: boolean;
  created_at: string;
}

interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string | null;
  emoji: string | null;
  color: string | null;
  accent_color: string | null;
  image: string;
  product_count: number;
  route: string;
  is_active: boolean;
}

type ActiveTab = 'dashboard' | 'products' | 'catalogs' | 'categories';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
────────────────────────────────────────────────────────────────── */
const CATEGORY_OPTIONS = ['marble', 'granite', 'kota-stone', 'cladding-stone', 'adhesives-chemicals'];

const normalizeSubcategory = (val: string): string => {
  const clean = val.trim().toLowerCase();
  if (clean === 'natural stone' || clean === 'natural_stone' || clean === 'natural-stone') {
    return 'natural-stone';
  }
  if (clean === 'artificial stone' || clean === 'artificial_stone' || clean === 'artificial-stone' || clean === 'engineered stone' || clean === 'engineered-stone') {
    return 'artificial-stone';
  }
  return clean.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};


const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;top:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:12px;font-weight:700;font-size:14px;box-shadow:0 10px 40px rgba(0,0,0,0.4);background:${type === 'success' ? '#22c55e' : '#ef4444'};color:white;transform:translateY(-8px);opacity:0;transition:all 0.3s ease`;
  el.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.transform = 'translateY(0)'; el.style.opacity = '1'; });
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(-8px)'; setTimeout(() => el.remove(), 300); }, 3200);
};

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR NAV ITEM
────────────────────────────────────────────────────────────────── */
interface NavItemProps {
  id: ActiveTab;
  label: string;
  icon: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ id, label, icon, count, active, onClick }) => (
  <button key={id} onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group cursor-pointer ${active ? 'bg-gradient-to-r from-[#C8962E]/20 to-transparent text-[#C8962E] border border-[#C8962E]/30 shadow-md shadow-[#C8962E]/5'
        : 'text-[#8888aa] hover:text-white hover:bg-white/5'
      }`}>
    <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${active ? 'scale-110' : ''}`}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {count !== undefined && (
      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-[#C8962E] text-white' : 'bg-white/10 text-[#8888aa]'}`}>{count}</span>
    )}
  </button>
);

/* ═══════════════════════════════════════════════════════════════
   STAT CARD
────────────────────────────────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, sub }) => (
  <div className="admin-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-200 cursor-default border border-[#1e1e2e]/80">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: color + '22' }}>{icon}</div>
    <div>
      <div className="text-[#8888aa] text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-white text-2xl font-heading font-black">{value}</div>
      {sub && <div className="text-[#8888aa]/75 text-[11px] mt-0.5">{sub}</div>}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   CLOUDFLARE R2 SECURE UPLOADER HELPER
────────────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════
   DIRECT BROWSER-TO-S3 UPLOADER HELPER (with CORS & ACL support)
────────────────────────────────────────────────────────────────── */
const uploadDirectToS3 = async (
  file: File | Blob,
  fileName: string,
  contentType: string,
  onProgress?: (percent: number) => void
): Promise<string> => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || '';

  const res = await fetch(`/api/get-presigned-url?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to get presigned upload URL');
  }
  const { uploadUrl, publicUrl } = await res.json();

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.setRequestHeader('x-amz-acl', 'public-read'); // Must match signed ACL (since Object Writer is enabled)
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(percent);
        }
      };
    }
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
        resolve(null);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });

  return publicUrl;
};

/* ═══════════════════════════════════════════════════════════════
   IMAGE MANAGER & HEIC CONVERTER FOR IPHONE
────────────────────────────────────────────────────────────────── */
interface ImageManagerProps {
  images: string[];
  onChange: (imgs: string[]) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ images, onChange }) => {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [conversionState, setConversionState] = useState('');
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (images.includes(url)) { showToast('URL already added', 'error'); return; }
    onChange([...images, url]);
    setUrlInput('');
    showToast('Image URL added!');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploading(true);
    setProgress(5);
    setConversionState('Preparing image file...');

    let fileToUpload: File | Blob = file;

    // Detect iPhone .HEIC / .HEIF files and convert client-side using CDN heic2any
    const filenameLower = file.name.toLowerCase();
    if (filenameLower.endsWith('.heic') || filenameLower.endsWith('.heif')) {
      setConversionState('iOS HEIC Image Detected. Converting...');
      setProgress(15);
      try {
        // Fetch heic2any library from CDN if not already on the window object
        if (!(window as any).heic2any) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/heic2any@0.4.0/dist/heic2any.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load iOS image converter script.'));
            document.head.appendChild(script);
          });
        }

        setProgress(35);
        const heic2anyFn = (window as any).heic2any;
        const convertedBlob = await heic2anyFn({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });

        const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
        fileToUpload = new File([singleBlob], newName, { type: 'image/jpeg' });
        setConversionState('Conversion successful!');
        setProgress(50);
      } catch (err: any) {
        showToast('HEIC Conversion failed, trying raw upload: ' + err.message, 'error');
      }
    }

    // ── Compress image via Canvas (skip SVG / GIF which don't benefit) ──
    const skipCompress = filenameLower.endsWith('.svg') || filenameLower.endsWith('.gif');
    if (!skipCompress) {
      try {
        const originalSizeKb = Math.round((fileToUpload as File | Blob).size / 1024);
        setConversionState(`Compressing image (${originalSizeKb} KB → optimising)...`);
        setProgress(55);
        const compressed = await compressImage(fileToUpload as File | Blob);
        const compressedSizeKb = Math.round(compressed.size / 1024);
        fileToUpload = compressed;
        setConversionState(`✅ Compressed: ${originalSizeKb} KB → ${compressedSizeKb} KB. Uploading...`);
        setProgress(65);
      } catch (compErr: any) {
        console.warn('Image compression skipped:', compErr.message);
        setConversionState('Uploading to Datnass Cloud...');
      }
    }

    try {
      setConversionState(prev => prev.includes('Uploading') ? prev : 'Uploading to Datnass Cloud...');
      const name = `prod_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

      const publicUrl = await uploadDirectToS3(fileToUpload as File, name, 'image/jpeg', (pct) => {
        setProgress(65 + Math.round(pct * 0.35));
      });

      setProgress(100);
      onChange([...images, publicUrl]);
      showToast('Image compressed & uploaded to Datnass Cloud!');
      setTimeout(() => { setUploading(false); setProgress(0); setConversionState(''); }, 800);
    } catch (err: any) {
      showToast('Upload failed: ' + err.message, 'error');
      setUploading(false);
      setProgress(0);
      setConversionState('');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="Or paste image URL and click Add" className="admin-input flex-1 placeholder-white/20" />
        <button type="button" onClick={addUrl} className="btn-accent px-4 py-2 text-xs whitespace-nowrap">Add URL</button>
      </div>

      {/* File Browser / Upload Zone */}
      <label className="upload-zone flex items-center justify-center gap-3 cursor-pointer p-6 border-2 border-dashed border-[#2a2a3a] hover:border-[#C8962E]/50 rounded-2xl bg-white/[0.02] transition-all" onClick={() => fileRef.current?.click()}>
        {uploading ? (
          <div className="w-full space-y-2">
            <div className="text-[#C8962E] text-xs font-semibold text-center">{conversionState || 'Uploading to Datnass Cloud...'}</div>
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
            <div className="text-[#8888aa] text-[10px] text-center">{progress}% completed</div>
          </div>
        ) : (
          <>
            <span className="text-3xl">📁</span>
            <div>
              <div className="text-[#e4e4ef] text-sm font-semibold">Select / Browse Image File</div>
              <div className="text-[#8888aa] text-xs mt-0.5">Supports iPhone formats (.HEIC), PNG, JPG, WEBP, SVG</div>
            </div>
          </>
        )}
      </label>
      <input ref={fileRef} type="file" accept="image/*,.heic,.heif,.webp,.avif,.svg" className="hidden" onChange={handleUpload} />

      {/* Images List Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-5 gap-2 pt-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-[#1e1e2e]">
              <img src={img} alt="" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23111" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" fill="%23555" font-size="10">Error</text></svg>'; }} />
              {idx === 0 && <div className="absolute top-1.5 left-1.5 bg-[#C8962E] text-white text-[8px] font-black px-1.5 py-0.5 rounded">MAIN</div>}

              {/* Image Ordering and Delete Controls */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1 rounded-md backdrop-blur-sm">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    const newImgs = [...images];
                    const temp = newImgs[idx];
                    newImgs[idx] = newImgs[idx - 1];
                    newImgs[idx - 1] = temp;
                    onChange(newImgs);
                  }}
                  className="w-5 h-5 bg-white/10 hover:bg-[#C8962E] text-white rounded text-[10px] flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white/10 cursor-pointer font-bold transition-all"
                  title="Move Left"
                >
                  ◀
                </button>
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => {
                    const newImgs = [...images];
                    const temp = newImgs[idx];
                    newImgs[idx] = newImgs[idx + 1];
                    newImgs[idx + 1] = temp;
                    onChange(newImgs);
                  }}
                  className="w-5 h-5 bg-white/10 hover:bg-[#C8962E] text-white rounded text-[10px] flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white/10 cursor-pointer font-bold transition-all"
                  title="Move Right"
                >
                  ▶
                </button>
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, i) => i !== idx))}
                  className="w-5 h-5 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[10px] flex items-center justify-center cursor-pointer font-bold transition-all"
                  title="Delete Image"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2.5 text-[#4a4a6a] text-xs font-semibold">No images added. Upload up to 10 images. First image = primary photo.</div>
      )}
    </div>
  );
};



/* ═══════════════════════════════════════════════════════════════
   IMAGE COMPRESSOR — Canvas-based, max 1920px, JPEG 85% quality
────────────────────────────────────────────────────────────────── */
const compressImage = (file: File | Blob, maxWidth = 1920, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
      // White background for images with transparency (PNG)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => { if (blob) resolve(blob); else reject(new Error('Canvas toBlob failed')); },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
};

/* ═══════════════════════════════════════════════════════════════
   PDF COMPRESSOR — Re-renders all pages via PDF.js → jsPDF rebuild
   Reduces file size by removing metadata bloat, re-encoding pages
   as JPEG images at 85% quality at 150 DPI equivalent scale
────────────────────────────────────────────────────────────────── */
const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`) && (window as any)['pdfjs-dist/build/pdf']) {
      resolve(); return;
    }
    const el = document.createElement('script');
    el.src = src; el.onload = () => resolve(); el.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(el);
  });

const compressPdf = async (
  file: File,
  onProgress?: (msg: string, pct: number) => void
): Promise<Blob> => {
  // Ensure PDF.js is loaded
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
  const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Ensure jsPDF is loaded
  if (!(window as any).jspdf) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  const { jsPDF } = (window as any).jspdf;

  onProgress?.('Reading PDF pages...', 10);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  // Scale 1.0 = 96 DPI — enough quality, far less canvas data than 1.56x.
  // Lower scale + lower JPEG quality = smaller JPEG chunks inside jsPDF.
  const SCALE = 1.0;
  // 0.68 JPEG quality keeps text readable and images acceptable.
  // jsPDF adds ~5–10% PDF wrapper overhead, so we need JPEG quality low
  // enough that the total output beats the original.
  const JPEG_QUALITY = 0.68;

  let doc: any = null;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const pct = 10 + Math.round((pageNum / totalPages) * 80);
    onProgress?.(`Compressing page ${pageNum} of ${totalPages}...`, pct);

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: SCALE });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgData = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

    // Page dimensions in mm (at 1pt = 0.352778mm, 72pt/inch)
    const widthMm = (viewport.width / SCALE / 72) * 25.4;
    const heightMm = (viewport.height / SCALE / 72) * 25.4;

    if (!doc) {
      doc = new jsPDF({
        orientation: widthMm > heightMm ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [widthMm, heightMm],
        compress: true,
      });
    } else {
      doc.addPage([widthMm, heightMm], widthMm > heightMm ? 'landscape' : 'portrait');
    }
    doc.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');
  }

  onProgress?.('Comparing sizes...', 96);
  const outputBytes = doc.output('arraybuffer');
  const compressedBlob = new Blob([outputBytes], { type: 'application/pdf' });

  // ── Smart guard: if rebuilt PDF is NOT smaller, return the original ──
  // This happens when the source PDF already has well-compressed images
  // (jsPDF adds PDF-structure overhead that can exceed the JPEG savings).
  if (compressedBlob.size >= file.size * 0.97) {
    onProgress?.('Already optimised — using original file.', 98);
    console.info(
      `[PDF compress] Skipped: rebuilt ${(compressedBlob.size / 1024 / 1024).toFixed(1)} MB ≥ original ${(file.size / 1024 / 1024).toFixed(1)} MB`
    );
    return file; // return original unchanged
  }

  return compressedBlob;
};

const extractPdfCover = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const runExtraction = async () => {
      try {
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        // Render at 1.5x scale for high resolution thumbnail
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas export to blob failed'));
        }, 'image/jpeg', 0.85);
      } catch (err) {
        reject(err);
      }
    };

    if ((window as any)['pdfjs-dist/build/pdf']) {
      runExtraction();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        runExtraction();
      };
      script.onerror = () => {
        reject(new Error('Failed to load PDF.js from CDN'));
      };
      document.head.appendChild(script);
    }
  });
};

interface PdfUploaderProps {
  onUploaded: (pdfUrl: string, thumbnailUrl?: string) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [statusMsg, setStatusMsg] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploading(true);
    setProgress(5);
    setStatusMsg('Loading PDF processor...');
    try {
      const coverTimestamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      // Step 1: Extract PDF cover FIRST (from original file, best quality)
      let coverBlob: Blob | null = null;
      try {
        setStatusMsg('Rendering cover page thumbnail...');
        setProgress(10);
        coverBlob = await extractPdfCover(file);
        setProgress(20);
      } catch (coverErr) {
        console.warn('PDF cover extraction failed (will use placeholder):', coverErr);
      }

      // Step 2: Compress cover thumbnail
      let extractedThumbnail = '';
      if (coverBlob) {
        try {
          setStatusMsg('Compressing cover thumbnail...');
          const compressedCover = await compressImage(coverBlob, 1200, 0.88);
          const thumbName = `catalog_cover_${coverTimestamp}.jpg`;
          extractedThumbnail = await uploadDirectToS3(compressedCover, thumbName, 'image/jpeg');
          setProgress(35);
        } catch (thumbErr: any) {
          console.error('Thumbnail upload failed:', thumbErr);
        }
      }

      // Step 3: Compress PDF (re-render pages via PDF.js → jsPDF)
      let pdfToUpload: Blob = file;
      const originalMb = (file.size / 1024 / 1024).toFixed(1);
      try {
        setStatusMsg(`Compressing PDF (${originalMb} MB → optimising pages)...`);
        setProgress(40);
        const compressed = await compressPdf(file, (msg, pct) => {
          setStatusMsg(msg);
          setProgress(40 + Math.round(pct * 0.35)); // 40% → 75%
        });
        pdfToUpload = compressed;
        const compressedMb = (compressed.size / 1024 / 1024).toFixed(1);
        const isOriginal = compressed.size >= file.size * 0.97;
        setStatusMsg(
          isOriginal
            ? `📄 PDF already optimised (${originalMb} MB). Uploading...`
            : `✅ PDF: ${originalMb} MB → ${compressedMb} MB saved. Uploading...`
        );
        setProgress(76);
      } catch (compErr: any) {
        console.warn('PDF compression skipped, uploading original:', compErr.message);
        setStatusMsg('Uploading original PDF to cloud...');
      }

      // Step 4: Upload compressed (or original) PDF to S3
      const cleanName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._()-]/g, '');
      const name = `catalog_${coverTimestamp}_${cleanName}`;
      const publicUrl = await uploadDirectToS3(pdfToUpload as File, name, 'application/pdf', (pct) => {
        setProgress(76 + Math.round(pct * 0.22)); // 76% → 98%
      });

      setProgress(100);
      setStatusMsg('Upload complete!');
      onUploaded(publicUrl, extractedThumbnail);
      showToast('✅ PDF compressed & uploaded with cover thumbnail!');
      setTimeout(() => { setUploading(false); setProgress(0); setStatusMsg(''); }, 800);
    } catch (err: any) {
      showToast('❌ PDF upload failed: ' + (err.message || 'Unknown error'), 'error');
      setUploading(false); setProgress(0); setStatusMsg('');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
          placeholder="Or paste existing catalog PDF link..." className="admin-input flex-1 placeholder-white/20" />
        <button type="button" onClick={() => { if (urlInput.trim()) { onUploaded(urlInput.trim()); setUrlInput(''); showToast('PDF URL linked!'); } }}
          className="btn-accent px-4 py-2 text-xs whitespace-nowrap">Link URL</button>
      </div>
      <label className="upload-zone flex items-center justify-center gap-3 cursor-pointer p-5 border border-dashed border-[#2a2a3a] hover:border-[#C8962E]/50 rounded-2xl bg-white/[0.02]" onClick={() => fileRef.current?.click()}>
        {uploading ? (
          <div className="w-full space-y-2">
            <div className="text-[#C8962E] text-xs font-semibold text-center">{statusMsg || 'Processing PDF...'}</div>
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
            <div className="text-[#8888aa] text-[10px] text-center">{progress}% completed</div>
          </div>
        ) : (
          <>
            <span className="text-3xl">📄</span>
            <div>
              <div className="text-[#e4e4ef] text-sm font-semibold">Upload PDF Document</div>
              <div className="text-[#8888aa] text-xs mt-0.5">Auto-compresses & generates cover thumbnail. Click to browse.</div>
            </div>
          </>
        )}
      </label>
      <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleUpload} />
    </div>
  );
};

interface ProductModalProps {
  product: Partial<ProductRecord> | null;
  categories: CategoryRecord[];
  onClose: () => void;
  onSaved: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product?.id;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: product?.id || '',
    slug: product?.slug || '',
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'marble',
    subcategory: product?.subcategory || '',
    price_range: product?.price_range || '',
    origin: product?.origin || '',
    brand: product?.brand || '',
    model_number: product?.model_number || '',
    material: product?.material || '',
    thickness_options: (product?.thickness_options || []).join(', '),
    size_options: (product?.size_options || []).join(', '),
    finish_options: (product?.finish_options || []).join(', '),
    application: (product?.application || []).join(', '),
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== false,
    images: product?.images || [] as string[],
  });

  const [colorVariations, setColorVariations] = useState<{ hex: string; name: string }[]>(() => {
    const colList = product?.colors || [];
    const nameList = product?.color_names || [];
    const combined = [];
    for (let i = 0; i < Math.max(colList.length, nameList.length); i++) {
      combined.push({
        hex: colList[i] || '#C8962E',
        name: nameList[i] || 'Gold Accent',
      });
    }
    return combined.length > 0 ? combined : [{ hex: '#FFFFFF', name: 'White' }];
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = {
      id: form.id || `prod-${Date.now()}`,
      slug: form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category,
      subcategory: form.subcategory.trim() ? normalizeSubcategory(form.subcategory) : null,
      price_range: form.price_range.trim() || null,
      origin: form.origin.trim() || null,
      brand: form.brand.trim() || null,
      model_number: form.model_number.trim() || null,
      material: form.material.trim() || null,
      thickness_options: form.thickness_options.split(',').map(s => s.trim()).filter(Boolean),
      size_options: form.size_options.split(',').map(s => s.trim()).filter(Boolean),
      finish_options: form.finish_options.split(',').map(s => s.trim()).filter(Boolean),
      colors: colorVariations.map(c => c.hex.trim()).filter(Boolean),
      color_names: colorVariations.map(c => c.name.trim()).filter(Boolean),
      application: form.application.split(',').map(s => s.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_active: form.is_active,
      images: form.images,
    };

    try {
      const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      showToast(isEdit ? 'Product updated!' : 'Product created!');
      onSaved();
      onClose();
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-3xl my-8 rounded-2xl overflow-hidden shadow-2xl" 
        style={{ background: 'linear-gradient(135deg, #181512 0%, #100e0d 100%)', border: '1px solid rgba(200, 150, 46, 0.3)' }}>
        <div className="flex items-center justify-between px-6 py-4" 
          style={{ background: 'linear-gradient(135deg, rgba(200, 150, 46, 0.15) 0%, rgba(28, 58, 107, 0.08) 100%)', borderBottom: '1px solid rgba(200, 150, 46, 0.2)' }}>
          <div>
            <span className="text-[#C8962E] text-[10px] font-black tracking-widest uppercase block mb-1">🏺 PREMIUM SHOWROOM PRODUCT</span>
            <h3 className="text-white font-heading font-bold text-lg">{isEdit ? '✏️ Edit Showroom Product' : '🏺 Add Premium Product'}</h3>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">💡 Basic Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="admin-label">Product Name *</label><input type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Carrara White Marble" className="admin-input" /></div>
              <div><label className="admin-label">URL Slug (auto if empty)</label><input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. carrara-white-marble" className="admin-input" /></div>
              <div>
                <label className="admin-label">Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="admin-select cursor-pointer">
                  {categories.length > 0
                    ? categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    : CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' ')}</option>)
                  }
                </select>
              </div>
              <div><label className="admin-label">Subcategory</label><input type="text" value={form.subcategory} onChange={e => set('subcategory', e.target.value)} placeholder="e.g. natural-stone, faucets-mixers" className="admin-input" /></div>
              <div className="col-span-2"><label className="admin-label">Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe stone veins, aesthetics, finishes, texture..." className="admin-input resize-none" /></div>
            </div>
          </div>

          {/* Specs & Pricing */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">💰 Specifications & Origin</h4>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="admin-label">Price Range</label><input type="text" value={form.price_range} onChange={e => set('price_range', e.target.value)} placeholder="e.g. ₹150–₹350 / sq ft" className="admin-input" /></div>
              <div><label className="admin-label">Origin / Region</label><input type="text" value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="e.g. Italy, Rajasthan" className="admin-input" /></div>
              <div><label className="admin-label">Material Type</label><input type="text" value={form.material} onChange={e => set('material', e.target.value)} placeholder="e.g. Marble, Ceramic" className="admin-input" /></div>
            </div>
          </div>

          {/* Brand & Model */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">🏷️ Branding details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="admin-label">Brand / Manufacturer</label><input type="text" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Kajaria, Jaquar" className="admin-input" /></div>
              <div><label className="admin-label">Model / Code</label><input type="text" value={form.model_number} onChange={e => set('model_number', e.target.value)} placeholder="e.g. TILE-4409-GLOSS" className="admin-input" /></div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">⚙️ Formats & Options</h4>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="admin-label">Thickness (comma-sep)</label><input type="text" value={form.thickness_options} onChange={e => set('thickness_options', e.target.value)} placeholder="16mm, 18mm" className="admin-input" /></div>
              <div><label className="admin-label">Sizes (comma-sep)</label><input type="text" value={form.size_options} onChange={e => set('size_options', e.target.value)} placeholder="8x4 ft, 600x600mm" className="admin-input" /></div>
              <div><label className="admin-label">Finishes (comma-sep)</label><input type="text" value={form.finish_options} onChange={e => set('finish_options', e.target.value)} placeholder="Polished, Honed" className="admin-input" /></div>
            </div>
          </div>

          {/* Dynamic Color Palette Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">🎨 Color Variations & Swatches</h4>
              <button
                type="button"
                onClick={() => setColorVariations(prev => [...prev, { hex: '#C8962E', name: 'New Color' }])}
                className="text-[#C8962E] text-[11px] font-bold border border-[#C8962E]/30 px-2.5 py-1 rounded-lg hover:bg-[#C8962E]/10 transition-all cursor-pointer"
              >
                ＋ Add Color Variation
              </button>
            </div>
            
            {colorVariations.length > 0 ? (
              <div className="space-y-2.5 bg-white/[0.02] p-4 rounded-xl border border-[#2a2a3a]">
                {colorVariations.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={v.hex}
                      onChange={e => {
                        const copy = [...colorVariations];
                        copy[idx].hex = e.target.value;
                        setColorVariations(copy);
                      }}
                      className="w-10 h-8 rounded border border-[#2a2a3a] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      disabled
                      value={v.hex.toUpperCase()}
                      className="w-20 admin-input text-center text-[10px] font-mono opacity-70"
                    />
                    <input
                      type="text"
                      value={v.name}
                      onChange={e => {
                        const copy = [...colorVariations];
                        copy[idx].name = e.target.value;
                        setColorVariations(copy);
                      }}
                      placeholder="e.g. Imperial White"
                      className="admin-input flex-1"
                    />
                    <button
                      type="button"
                      disabled={colorVariations.length === 1}
                      onClick={() => setColorVariations(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-400 text-xs w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#4a4a6a] text-xs">No color swatches configured.</p>
            )}
            <p className="text-[#4a4a6a] text-[10px]">* Select visual colors manually; display names will map corresponding swatches.</p>
          </div>

          {/* Applications */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">🏠 Application Zones (comma-sep)</h4>
            <input
              type="text"
              value={form.application}
              onChange={e => set('application', e.target.value)}
              placeholder="e.g. Floor, Wall, Bathroom, Swimming Pool, Bar & Restaurants"
              className="admin-input"
            />
            <p className="text-[#4a4a6a] text-[10px]">* Enter any application environments manually, separated by commas.</p>
          </div>

          {/* Image Manager */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">
              🖼️ Product Gallery Photos <span className="text-[#4a4a6a] font-normal normal-case">({form.images.length} images uploaded)</span>
            </h4>
            <ImageManager images={form.images} onChange={imgs => set('images', imgs)} />
          </div>

          {/* Visibility & Featured Status */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">Visibility & Featured Status</h4>
            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-xl border border-[#2a2a3a]">
              <div className="flex items-center gap-3">
                <div onClick={() => set('is_active', !form.is_active)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${form.is_active ? 'bg-emerald-500' : 'bg-[#2a2a3a]'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
                </div>
                <div>
                  <span className="text-[#e4e4ef] text-xs font-bold block">Active Showroom Status</span>
                  <span className="text-[#8888aa] text-[10px]">Product is active and visible on the website catalog.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div onClick={() => set('is_featured', !form.is_featured)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${form.is_featured ? 'bg-[#C8962E]' : 'bg-[#2a2a3a]'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_featured ? 'left-5' : 'left-0.5'}`} />
                </div>
                <div>
                  <span className="text-[#e4e4ef] text-xs font-bold block">★ Feature on Homepage</span>
                  <span className="text-[#8888aa] text-[10px]">Product will be showcased in the Featured block on the Home page.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-sm font-semibold hover:border-stone-500 hover:text-white transition-all cursor-pointer bg-transparent">Cancel</button>
            <button type="submit" disabled={saving} className="btn-accent px-7 py-2.5 text-sm disabled:opacity-60">
              {saving ? 'Saving...' : isEdit ? '💾 Update Showroom Product' : '🏺 Add Product to Showroom'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CATALOG MODAL
────────────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════
   CATALOG MODAL (DOCUMENT LIBRARY THEME)
────────────────────────────────────────────────────────────────── */
interface CatalogModalProps {
  catalog: Partial<CatalogRecord> | null;
  onClose: () => void;
  onSaved: () => void;
}

const CatalogModal: React.FC<CatalogModalProps> = ({ catalog, onClose, onSaved }) => {
  const isEdit = !!catalog?.id;
  const [saving, setSaving] = useState(false);
  const [thumbPreviewError, setThumbPreviewError] = useState(false);

  const [form, setForm] = useState({
    id: catalog?.id || '',
    title: catalog?.title || '',
    company: catalog?.company || '',
    description: catalog?.description || '',
    pdf_url: catalog?.pdf_url || '',
    thumbnail_url: catalog?.thumbnail_url || '',
    parent_tab: (catalog as any)?.parent_tab || 'tiles',
    catalog_type: catalog?.catalog_type || '',
    catalog_type_label: (catalog as any)?.catalog_type_label || '',
    tags: (catalog?.tags || []).join(', '),
    application: ((catalog as any)?.application || []).join(', '),
    is_active: catalog?.is_active !== false,
    is_featured: (catalog as any)?.is_featured || false,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  // Parent tab options — the broad page sections
  const PARENT_TABS = [
    { id: 'tiles',            label: '🔲 Tiles',             suggestions: ['floor-tiles', 'wall-tiles', 'bathroom-tiles', 'designer-tiles', 'vitrified', 'outdoor-tiles', 'mosaic-tiles', 'wooden-tiles', 'terrracotta-tiles', 'parking-tiles'] },
    { id: 'sanitary',         label: '🚿 Sanitary Ware',      suggestions: ['water-closets', 'wash-basins', 'faucets', 'bathtubs', 'shower-panels', 'bathroom-accessories'] },
    { id: 'stone',            label: '🪨 Natural Stone',       suggestions: ['natural-cladding-stone', 'slate-tiles', 'quartzite', 'sandstone', 'limestone', 'schist', 'kota-stone'] },
    { id: 'artificial-stone', label: '⚗️ Artificial Stone',   suggestions: ['quartz-slabs', 'engineered-stone', 'composite-stone', 'solid-surface'] },
    { id: 'other',            label: '📦 Other',               suggestions: ['adhesives', 'chemicals', 'grouting', 'waterproofing'] },
  ];

  const currentParentTab = PARENT_TABS.find(p => p.id === form.parent_tab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);

    const payload: any = {
      id: form.id || `cat-${Date.now()}`,
      title: form.title.trim(),
      company: form.company.trim(),
      description: form.description.trim() || null,
      pdf_url: form.pdf_url.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || 'https://placehold.co/400x300/111/C8962E?text=Catalog',
      parent_tab: form.parent_tab,
      catalog_type: form.catalog_type.trim() || form.parent_tab,
      catalog_type_label: form.catalog_type_label.trim() || null,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      application: form.application.split(',').map((s: string) => s.trim()).filter(Boolean),
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    try {
      let { error } = await supabase.from('catalogs').upsert(payload, { onConflict: 'id' });

      // Graceful fallback for older DB schema without new columns
      if (error && (error.message.includes('parent_tab') || error.message.includes('catalog_type_label'))) {
        console.warn('Fallback: saving without new columns (run migration SQL)');
        const { parent_tab, catalog_type_label, ...legacy } = payload;
        const res = await supabase.from('catalogs').upsert(legacy, { onConflict: 'id' });
        error = res.error;
      }
      if (error && error.message.includes('is_featured')) {
        const { is_featured, parent_tab, catalog_type_label, ...minimal } = payload;
        const res = await supabase.from('catalogs').upsert(minimal, { onConflict: 'id' });
        if (res.error) throw res.error;
      } else {
        if (error) throw error;
      }

      showToast(isEdit ? 'Catalog updated!' : 'Catalog created!');
      onSaved();
      onClose();
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-2xl my-8 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #0d131f 0%, #080c14 100%)', border: '1px solid rgba(20, 184, 166, 0.25)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(15,23,42,0.15))', borderBottom: '1px solid rgba(20,184,166,0.15)' }}>
          <div>
            <span className="text-[#14b8a6] text-[10px] font-black tracking-widest uppercase block mb-1">📖 CATALOG PUBLISHER</span>
            <h3 className="text-white font-heading font-bold text-lg">{isEdit ? '✏️ Edit Catalog' : '📖 Publish New Catalog'}</h3>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Row 1: Title + Company */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Catalog Title *</label>
              <input type="text" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Kajaria Floor Collection 2025" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Company / Brand *</label>
              <input type="text" required value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Kajaria, ColorTiles" className="admin-input" />
            </div>
          </div>

          <div>
            <label className="admin-label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Brief catalog description..." className="admin-input resize-none" />
          </div>

          {/* ─── DYNAMIC CATALOG TYPE SYSTEM ─── */}
          <div className="bg-white/[0.03] p-4 rounded-xl border border-[#2a2a3a] space-y-4">
            <h4 className="text-[#14b8a6] text-xs font-black uppercase tracking-wider">🗂️ Catalog Category System</h4>
            <p className="text-[#4a4a6a] text-[10px] leading-relaxed">
              Choose the <strong className="text-[#8888aa]">Parent Section</strong> (main tab on the catalog page), then enter the <strong className="text-[#8888aa]">Specific Sub-type</strong>. Any new sub-type you enter will automatically create a new filter tab on the website.
            </p>

            {/* Parent Tab selector */}
            <div>
              <label className="admin-label">Parent Section (Main Tab) *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PARENT_TABS.map(pt => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => { set('parent_tab', pt.id); set('catalog_type', ''); }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold text-left transition-all border cursor-pointer ${
                      form.parent_tab === pt.id
                        ? 'bg-[#14b8a6]/15 border-[#14b8a6] text-[#14b8a6]'
                        : 'bg-white/[0.02] border-[#2a2a3a] text-[#8888aa] hover:border-[#4a4a6a]'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific sub-type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Specific Sub-type Slug *</label>
                <input
                  type="text"
                  required
                  list="catalog-type-suggestions"
                  value={form.catalog_type}
                  onChange={e => set('catalog_type', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. floor-tiles, wooden-tiles"
                  className="admin-input"
                />
                <datalist id="catalog-type-suggestions">
                  {(currentParentTab?.suggestions || []).map(s => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
                <p className="text-[#4a4a6a] text-[9px] mt-1">Use kebab-case: wooden-tiles, kota-stone</p>
              </div>
              <div>
                <label className="admin-label">Display Label (shown as sub-tab)</label>
                <input
                  type="text"
                  value={form.catalog_type_label}
                  onChange={e => set('catalog_type_label', e.target.value)}
                  placeholder={form.catalog_type ? form.catalog_type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'e.g. Wooden Floor Tiles'}
                  className="admin-input"
                />
                <p className="text-[#4a4a6a] text-[9px] mt-1">Human-readable label shown on the catalog page</p>
              </div>
            </div>
          </div>

          {/* ─── Thumbnail ─── */}
          <div>
            <label className="admin-label">Cover Image / Thumbnail URL</label>
            <input type="text" value={form.thumbnail_url}
              onChange={e => { set('thumbnail_url', e.target.value); setThumbPreviewError(false); }}
              placeholder="Auto-fills on PDF upload, or paste image URL..."
              className="admin-input" />
            {/* Live thumbnail preview */}
            {form.thumbnail_url && !thumbPreviewError && (
              <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-[#2a2a3a] bg-[#0d0d16]">
                <img
                  src={form.thumbnail_url}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={() => setThumbPreviewError(true)}
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Tags + Application */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Tags / Keywords (comma-sep)</label>
              <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Glossy, Ceramic, Bathroom" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Application Zones (comma-sep)</label>
              <input type="text" value={form.application} onChange={e => set('application', e.target.value)} placeholder="Floor, Wall, Bathroom, Pool" className="admin-input" />
            </div>
          </div>

          {/* ─── PDF File ─── */}
          <div>
            <h4 className="text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-2">📄 PDF Catalog File</h4>
            {form.pdf_url && (
              <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 text-xs font-bold">✅</span>
                <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[#14b8a6] text-xs underline truncate flex-1">{form.pdf_url}</a>
                <button type="button" onClick={() => set('pdf_url', '')} className="text-red-400 text-xs hover:text-red-300">✕ Remove</button>
              </div>
            )}
            <PdfUploader onUploaded={(url, thumb) => {
              set('pdf_url', url);
              if (thumb) { set('thumbnail_url', thumb); setThumbPreviewError(false); }
            }} />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-xl border border-[#2a2a3a]">
            <div className="flex items-center gap-3">
              <div onClick={() => set('is_active', !form.is_active)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${form.is_active ? 'bg-emerald-500' : 'bg-[#2a2a3a]'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
              </div>
              <div>
                <span className="text-[#e4e4ef] text-xs font-bold block">Publish immediately</span>
                <span className="text-[#8888aa] text-[10px]">Visible on catalog page.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div onClick={() => set('is_featured', !form.is_featured)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${form.is_featured ? 'bg-[#C8962E]' : 'bg-[#2a2a3a]'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_featured ? 'left-5' : 'left-0.5'}`} />
              </div>
              <div>
                <span className="text-[#e4e4ef] text-xs font-bold block">★ Feature on Homepage</span>
                <span className="text-[#8888aa] text-[10px]">Shown in homepage catalogs.</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-sm font-semibold hover:border-stone-500 hover:text-white transition-all cursor-pointer bg-transparent">Cancel</button>
            <button type="submit" disabled={saving} className="btn-accent px-7 py-2.5 text-sm disabled:opacity-60">
              {saving ? 'Saving...' : isEdit ? 'Update Catalog' : 'Create & Publish Catalog'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

              </div>
            )}
            <PdfUploader onUploaded={(url, thumb) => {
              set('pdf_url', url);
              if (thumb) set('thumbnail_url', thumb);
            }} />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-xl border border-[#2a2a3a]">
            <div className="flex items-center gap-3">
              <div onClick={() => set('is_active', !form.is_active)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${form.is_active ? 'bg-emerald-500' : 'bg-[#2a2a3a]'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
              </div>
              <div>
                <span className="text-[#e4e4ef] text-xs font-bold block">Publish immediately</span>
                <span className="text-[#8888aa] text-[10px]">Visible on PDF catalogs page.</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div onClick={() => set('is_featured', !form.is_featured)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${form.is_featured ? 'bg-[#C8962E]' : 'bg-[#2a2a3a]'}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_featured ? 'left-5' : 'left-0.5'}`} />
              </div>
              <div>
                <span className="text-[#e4e4ef] text-xs font-bold block">★ Feature on Homepage</span>
                <span className="text-[#8888aa] text-[10px]">Catalogue featured on Home.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-sm font-semibold hover:border-stone-500 hover:text-white transition-all cursor-pointer bg-transparent">Cancel</button>
            <button type="submit" disabled={saving} className="btn-accent px-7 py-2.5 text-sm disabled:opacity-60">
              {saving ? 'Saving...' : isEdit ? 'Update Document' : 'Create & Publish Catalog'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CATEGORY COVER UPLOADER
────────────────────────────────────────────────────────────────── */
const CategoryCoverUploader: React.FC<{ onUploaded: (url: string) => void }> = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const [statusMsg, setStatusMsg] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setUploading(true);
    setProgress(10);
    setStatusMsg('Preparing image...');
    try {
      let fileToUpload: Blob = file;
      const originalKb = Math.round(file.size / 1024);
      // Compress if it's not SVG/GIF
      const lname = file.name.toLowerCase();
      if (!lname.endsWith('.svg') && !lname.endsWith('.gif')) {
        try {
          setStatusMsg(`Compressing (${originalKb} KB)...`);
          setProgress(20);
          const compressed = await compressImage(file, 1600, 0.88);
          const compressedKb = Math.round(compressed.size / 1024);
          fileToUpload = compressed;
          setStatusMsg(`✅ ${originalKb} KB → ${compressedKb} KB. Uploading...`);
          setProgress(40);
        } catch { /* skip compression, use original */ }
      }

      const name = `cat_${Date.now()}.jpg`;
      const publicUrl = await uploadDirectToS3(fileToUpload as File, name, 'image/jpeg', (pct) => {
        setProgress(40 + Math.round(pct * 0.6));
      });

      setProgress(100);
      onUploaded(publicUrl);
      showToast('Cover photo compressed & uploaded!');
      setTimeout(() => { setUploading(false); setProgress(0); setStatusMsg(''); }, 500);
    } catch (err: any) {
      showToast('Cover upload failed: ' + err.message, 'error');
      setUploading(false);
      setProgress(0);
      setStatusMsg('');
    }
  };

  return (
    <div>
      <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 cursor-pointer mt-1">
        {uploading ? (statusMsg || `Uploading (${progress}%)`) : '📤 Upload Cover Photo File'}
      </button>
      {uploading && (
        <div className="mt-2 space-y-1">
          <div className="progress-bar-track" style={{ height: 6, borderRadius: 4, background: '#1e1e2e' }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#C8962E,#e8b84b)', transition: 'width 0.3s ease' }} />
          </div>
          <div className="text-[#8888aa] text-[10px]">{progress}% — {statusMsg}</div>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  );
};
/* ═══════════════════════════════════════════════════════════════
   CATEGORY MODAL (LAYOUT CANVAS THEME)
────────────────────────────────────────────────────────────────── */
interface CategoryModalProps {
  category: CategoryRecord | null;
  onClose: () => void;
  onSaved: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ category, onClose, onSaved }) => {
  const isEdit = !!category?.id;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: category?.id || '',
    slug: category?.slug || '',
    name: category?.name || '',
    description: category?.description || '',
    long_description: category?.long_description || '',
    emoji: category?.emoji || '',
    accent_color: category?.accent_color || '#C8962E',
    image: category?.image || '',
    is_active: category?.is_active !== false,
    group_name: (category as any)?.group_name || 'Natural Stone',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleNameChange = (val: string) => {
    setForm(f => {
      const generated = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return {
        ...f,
        name: val,
        id: isEdit ? f.id : generated,
        slug: isEdit ? f.slug : generated,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!form.id) {
      showToast('Category ID is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        id: form.id,
        slug: form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: form.name.trim(),
        description: form.description.trim(),
        long_description: form.long_description.trim() || null,
        emoji: form.emoji.trim() || null,
        color: 'amber', // Default style prefix
        accent_color: form.accent_color.trim() || null,
        image: form.image.trim(),
        route: `/category/${form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        is_active: form.is_active,
        group_name: form.group_name,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase
        .from('categories')
        .upsert(payload, { onConflict: 'id' });

      // Gracefully fall back if group_name column doesn't exist in Supabase yet
      if (error && (error.message.includes('group_name') || error.code === 'PGRST116')) {
        console.warn('Fallback: saving category without group_name column');
        const { group_name, ...payloadWithoutGroup } = payload;
        const res = await supabase
          .from('categories')
          .upsert(payloadWithoutGroup, { onConflict: 'id' });
        error = res.error;
      }

      if (error) throw error;

      showToast(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
      onSaved();
      onClose();
    } catch (err: any) {
      showToast('Error saving category: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-xl my-8 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #140d24 0%, #0d0818 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(244, 63, 94, 0.06) 100%)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div>
            <span className="text-[#a5b4fc] text-[10px] font-black tracking-widest uppercase block mb-1">🎨 HOMEPAGE CANVAS LAYOUT MANAGER</span>
            <h3 className="text-white font-heading font-bold text-lg">{isEdit ? `✏️ Edit Category Design: ${category?.name}` : '➕ Add Custom Category Page'}</h3>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Category Name *</label>
              <input type="text" required value={form.name} onChange={e => isEdit ? set('name', e.target.value) : handleNameChange(e.target.value)} className="admin-input" placeholder="e.g. Wooden Planks" />
            </div>
            <div>
              <label className="admin-label">Emoji *</label>
              <input type="text" required value={form.emoji} onChange={e => set('emoji', e.target.value)} className="admin-input" placeholder="e.g. 🪵" />
            </div>
          </div>

          <div>
            <label className="admin-label">Short Description *</label>
            <input type="text" required value={form.description} onChange={e => set('description', e.target.value)} className="admin-input" placeholder="Premium Italian & Indian marble" />
          </div>

          <div>
            <label className="admin-label">Long Description</label>
            <textarea value={form.long_description} onChange={e => set('long_description', e.target.value)} rows={3} className="admin-input resize-none" placeholder="Detailed details shown on category collections page..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Accent Color (Hex)</label>
              <input type="text" value={form.accent_color} onChange={e => set('accent_color', e.target.value)} className="admin-input" placeholder="e.g. #C8962E" />
            </div>
            <div>
              <label className="admin-label">Slug (URL segment)</label>
              <input type="text" required disabled value={form.slug} className="admin-input opacity-60" />
            </div>
          </div>

          <div>
            <label className="admin-label">Parent Group (Grouping in Navbar)</label>
            <select
              value={form.group_name}
              onChange={e => set('group_name', e.target.value)}
              className="admin-input"
            >
              <option value="Natural Stone">Natural Stone</option>
              <option value="Chemicals">Chemicals</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider mb-2">📸 Cover Photo Background</h4>

            <div className="flex gap-4 items-center mb-2">
              {form.image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#1e1e2e] flex-shrink-0 bg-black">
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <input type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="Paste image cover URL here..." className="admin-input flex-1" />
            </div>

            <CategoryCoverUploader onUploaded={url => set('image', url)} />
          </div>

          <div className="flex items-center gap-3 py-2">
            <div onClick={() => set('is_active', !form.is_active)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${form.is_active ? 'bg-emerald-500' : 'bg-[#2a2a3a]'}`}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-[#e4e4ef] text-sm font-semibold">Category is active and visible on Homepage</span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-sm font-semibold hover:border-[#444] hover:text-white transition-all cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="btn-accent px-7 py-2.5 text-sm disabled:opacity-60">
              {saving ? 'Saving...' : 'Update Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN COMPONENT
────────────────────────────────────────────────────────────────── */
const Admin: React.FC = () => {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [catalogs, setCatalogs] = useState<CatalogRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogTypeFilter, setCatalogTypeFilter] = useState('all');
  const [catalogSort, setCatalogSort] = useState<'newest' | 'az'>('newest');

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductRecord> | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Partial<CatalogRecord> | null>(null);

  // Connection Status
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbErrorMessage, setDbErrorMessage] = useState('');

  // Fetch Database Data from Supabase (products, catalogs, categories only)
  const fetchData = useCallback(async () => {
    if (!supabase) {
      setDbStatus('error');
      setDbErrorMessage('Supabase client is not configured.');
      return;
    }
    setFetchLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('catalogs').select('*').order('created_at', { ascending: false }),
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;

      setProducts(prodRes.data || []);
      setCatalogs(catRes.data || []);

      // Fetch categories separately to be resilient if categories table is not created yet
      try {
        const { data: catgData, error: catgError } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: true });

        if (!catgError && catgData) {
          setCategories(catgData);
        }
      } catch (catgErr) {
        console.warn('Categories table not initialized:', catgErr);
      }

      setDbStatus('connected');
    } catch (err: any) {
      console.error(err.message);
      setDbStatus('error');
      setDbErrorMessage(err.message);
      showToast('Database connection error: ' + err.message, 'error');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setSessionUser(session.user); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSessionUser(s?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  // Trigger data fetch after login state changes
  useEffect(() => {
    if (sessionUser) {
      const timer = setTimeout(() => {
        fetchData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [sessionUser, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { setLoginError('Supabase not configured. Check configuration keys.'); return; }
    loading || setLoading(true);
    setLoginError('');

    const normalized = phone.replace(/\s/g, '').replace(/^\+91/, '');
    if (!['7778803008'].includes(normalized)) {
      setLoginError('Unauthorized Admin phone credentials.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setLoginError(error.message);
      else setSessionUser(data.user);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setSessionUser(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!supabase || !confirm('Permanently delete this product from storage?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Product deleted successfully.');
    fetchData();
  };

  const handleDeleteCatalog = async (id: string) => {
    if (!supabase || !confirm('Delete this catalog document?')) return;
    const { error } = await supabase.from('catalogs').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Catalog deleted successfully.');
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!supabase || !confirm('Permanently delete this category? All products under this category will lose their category grouping.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Category deleted successfully.');
    fetchData();
  };


  /* ─── PREMIUM NEON-3D ADMIN LOGIN VIEW ─── */
  if (!sessionUser) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #08060f 0%, #020205 60%, #000 100%)' }}>
        <div className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{ top: '-15%', right: '10%', background: 'radial-gradient(circle,#1C3A6B22,transparent)', filter: 'blur(90px)' }} />
        <div className="absolute w-80 h-80 rounded-full pointer-events-none"
          style={{ bottom: '-10%', left: '5%', background: 'radial-gradient(circle,#C8962E15,transparent)', filter: 'blur(90px)' }} />
        <div className="grain-overlay" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md mx-4">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
              className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg,#1C3A6B,#C8962E)', boxShadow: '0 0 35px rgba(200,150,46,0.3)' }}>🏛️</motion.div>
            <h1 className="text-white font-heading font-black text-3xl tracking-tight uppercase">Nilkanth Marble</h1>
            <p className="text-[#C8962E] text-[10px] font-bold tracking-[0.25em] uppercase mt-1">Authorized Admin Access</p>
          </div>

          {/* 3D Dashboard box */}
          <div className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(15,15,22,0.95)', border: '1px solid rgba(200,150,46,0.25)', boxShadow: '0 0 50px rgba(200,150,46,0.06), 0 20px 40px rgba(0,0,0,0.8)' }}>
            <div className="px-6 py-3 border-b border-[#1c1c2b]" style={{ background: 'linear-gradient(90deg,#1C3A6B22,transparent)' }}>
              <p className="text-[#8888aa] text-[10px] font-bold text-center uppercase tracking-widest">Secure Credentials Area</p>
            </div>

            <form onSubmit={handleLogin} className="p-7 space-y-5">
              {loginError && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-red-900/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 flex items-start gap-2">
                  <span>⚠️</span><span>{loginError}</span>
                </motion.div>
              )}

              <div>
                <label className="admin-label">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="admin-input shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_12px_rgba(200,150,46,0.15)] focus:border-[#C8962E] placeholder-white/10"
                />
              </div>

              <div>
                <label className="admin-label">Registered Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter phone number..."
                  className="admin-input shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_12px_rgba(200,150,46,0.15)] focus:border-[#C8962E] placeholder-white/10"
                />
              </div>

              <div>
                <label className="admin-label">Admin Security Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="admin-input pr-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_12px_rgba(200,150,46,0.15)] focus:border-[#C8962E] placeholder-white/10"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a6a] hover:text-[#8888aa] transition-colors text-sm cursor-pointer">{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-accent py-3.5 justify-center text-xs font-bold disabled:opacity-60 mt-4 shadow-lg cursor-pointer">
                {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying credentials...</span> : '🔐 Sign In to Console'}
              </button>
            </form>

            <div className="px-7 py-4 border-t border-[#1c1c2b] flex items-center justify-between">
              <p className="text-[#4a4a6a] text-xs font-semibold">Secure connection established</p>
              <a href="/" className="text-[#C8962E] text-xs hover:underline font-bold">← Homepage</a>
            </div>
          </div>
          <p className="text-center text-[#4a4a6a] text-[10px] font-bold mt-6 tracking-wide">Nilkanth Marble & Tiles · Nadiad, Gujarat</p>
        </motion.div>
      </div>
    );
  }

  // Restrict access to designated administrator email
  if (sessionUser.email !== 'harshpra1624@gmail.com') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#05050a' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-white font-heading font-black text-2xl mb-2">Access Restrained</h1>
          <p className="text-[#8888aa] text-sm mb-6">Your logged-in account does not possess administrator clearances.</p>
          <button onClick={handleLogout} className="btn-accent px-6 py-2.5 text-xs font-bold cursor-pointer">← Sign Out & Retry</button>
        </div>
      </div>
    );
  }

  /* ─── DASHBOARD LAYOUT ─── */
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>

      {/* Sidebar navigation */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-[#1e1e2e] sticky top-0 h-screen overflow-y-auto" style={{ background: '#0d0d16' }}>
        <div className="p-5 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#1C3A6B,#C8962E)' }}>🏛️</div>
            <div>
              <div className="text-white font-heading font-black text-sm leading-none">NILKANTH</div>
              <div className="text-[#C8962E] text-[9px] font-black tracking-widest uppercase mt-1">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[#4a4a6a] text-[9px] font-black uppercase tracking-widest px-4 pb-2 pt-1">Menu Sections</p>
          <NavItem id="dashboard" label="Dashboard" icon="📊" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />

          <NavItem id="products" label="Products" icon="💎" count={products.length} active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <NavItem id="catalogs" label="PDF Catalogs Manager" icon="📚" count={catalogs.length} active={activeTab === 'catalogs'} onClick={() => setActiveTab('catalogs')} />
          <NavItem id="categories" label="Categories Manager" icon="🏷️" count={categories.length} active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
        </nav>

        <div className="p-4 border-t border-[#1e1e2e] space-y-3">
          <div className="text-[#8888aa] text-xs truncate font-medium">{sessionUser?.email}</div>
          <button onClick={handleLogout} className="btn-danger w-full py-2.5 justify-center text-xs font-bold cursor-pointer">Sign Out</button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]"
          style={{ background: 'rgba(10,10,15,0.96)', backdropFilter: 'blur(12px)' }}>
          <div>
            <h2 className="text-white font-heading font-black text-lg">
              {activeTab === 'dashboard' ? '📊 Dashboard Overview' : activeTab === 'products' ? '💎 Product Catalogue' : activeTab === 'catalogs' ? '📚 PDF Catalogs Manager' : '🏷️ Homepage Categories'}
            </h2>
            <p className="text-[#8888aa] text-xs font-medium mt-0.5">
              {activeTab === 'dashboard' ? 'Real-time overview of database records' : activeTab === 'products' ? `${products.length} items listed` : activeTab === 'catalogs' ? `${catalogs.length} catalogs uploaded` : `${categories.length} categories on homepage`}
            </p>
          </div>
          <div className="text-[#4a4a6a] text-xs text-right font-medium">
            <div className="text-[#e4e4ef] font-bold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            <div className="mt-0.5">Nilkanth Admin Area</div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {fetchLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 rounded-full border-4 border-[#1e1e2e] border-t-[#C8962E] animate-spin mb-4" />
                <p className="text-[#8888aa] text-sm font-semibold">Loading data from Supabase...</p>
              </motion.div>
            ) : activeTab === 'dashboard' ? (
              <motion.div key="dash" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Connection Status Banner */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${dbStatus === 'connected' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                    dbStatus === 'checking' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                      'bg-rose-500/5 border-rose-500/20 text-rose-400'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
                        dbStatus === 'checking' ? 'bg-amber-500 animate-pulse' :
                          'bg-rose-500'
                      }`} />
                    <div className="text-xs font-semibold">
                      {dbStatus === 'connected' ? 'Database securely connected · RLS verification passed' :
                        dbStatus === 'checking' ? 'Verifying secure database link...' :
                          `Database Connection Error: ${dbErrorMessage}`}
                    </div>
                  </div>
                  {dbStatus === 'error' && (
                    <div className="text-[10px] bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30 font-bold uppercase tracking-wider">
                      Requires SQL Setup
                    </div>
                  )}
                  <button onClick={fetchData} className="text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10 cursor-pointer">🔄 Refresh Link</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard label="Total Products" value={products.length} icon="💎" color="#1C3A6B" sub={`${products.filter(p => p.is_active).length} visible items`} />
                  <StatCard label="Featured Stones" value={products.filter(p => p.is_featured).length} icon="⭐" color="#C8962E" sub="Featured on homepage" />
                  <StatCard label="PDF Catalogs" value={catalogs.length} icon="📄" color="#1C3A6B" sub={`${catalogs.filter(c => c.is_active).length} active`} />
                </div>

                {/* Info Cards Grid */}
                <div className="admin-card p-5">
                  <h3 className="text-white font-bold text-sm mb-3">Database Verification</h3>
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</span>
                      <div>
                        <div className="text-[#e4e4ef] text-xs font-bold">Row-Level Security (RLS)</div>
                        <div className="text-[#8888aa] text-[10px] mt-0.5">Enabled on all backend tables.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#C8962E]/10 text-[#C8962E] flex items-center justify-center text-xs font-bold">☁</span>
                      <div>
                        <div className="text-[#e4e4ef] text-xs font-bold">File Storage</div>
                        <div className="text-[#8888aa] text-[10px] mt-0.5">All files hosted on Datnass GDX Cloud.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">🔒</span>
                      <div>
                        <div className="text-[#e4e4ef] text-xs font-bold">Access Level</div>
                        <div className="text-[#8888aa] text-[10px] mt-0.5">Admin CRUD authorization enabled.</div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#1e1e2e] mt-4 flex items-center justify-between text-[11px] text-[#4a4a6a]">
                    <span className="font-bold">Project Ref:</span>
                    <span className="text-white/50 select-all font-mono font-black">nbmvvwvhjiubedlyfuyb</span>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'products' ? (
              <motion.div key="prod" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <input type="search" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="🔍 Search products by name, brand, category..." className="admin-input max-w-sm placeholder-white/20" />
                  <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }} className="btn-accent text-xs font-bold px-5 py-3 shadow-md shadow-[#C8962E]/10 cursor-pointer">➕ Add New Product</button>
                </div>
                <div className="admin-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead style={{ background: '#0d0d16' }}>
                        <tr>{['Product details', 'Category', 'Price details', 'Brand / Code / Swatches', 'Gallery Preview', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3.5 text-left text-[9px] font-bold text-[#4a4a6a] uppercase tracking-wider">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e2e]">
                        {filteredProducts.map(prod => (
                          <tr key={prod.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#2a2a3a]">
                                  {prod.images?.[0]
                                    ? <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full bg-[#1e1e2e] flex items-center justify-center text-[#4a4a6a] text-lg font-bold">💎</div>}
                                </div>
                                <div>
                                  <div className="text-[#e4e4ef] font-bold text-xs">{prod.name}</div>
                                  <div className="text-[#4a4a6a] text-[10px] mt-0.5 font-semibold">{prod.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4"><span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold capitalize" style={{ background: '#1C3A6B22', color: '#6ba3f5' }}>{prod.category.replace(/-/g, ' ')}</span></td>
                            <td className="px-5 py-4 text-[#e4e4ef] text-xs font-bold">{prod.price_range || '—'}</td>
                            <td className="px-5 py-4">
                              {prod.brand && <div className="text-[#e4e4ef] text-xs font-bold">{prod.brand}</div>}
                              {prod.model_number && <div className="text-[#4a4a6a] text-[10px] mt-0.5 font-bold">{prod.model_number}</div>}
                              {/* Color Swatch Previews */}
                              {prod.colors && prod.colors.length > 0 && (
                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                  {prod.colors.map((c, i) => (
                                    <div
                                      key={i}
                                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                                      style={{ backgroundColor: c }}
                                      title={prod.color_names?.[i] || c}
                                    />
                                  ))}
                                </div>
                              )}
                              {!prod.brand && !prod.model_number && (!prod.colors || prod.colors.length === 0) && <span className="text-[#4a4a6a]">—</span>}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-1 flex-wrap max-w-[130px]">
                                {(prod.images || []).slice(0, 3).map((img, i) => (
                                  <div key={i} className="w-7 h-7 rounded border border-[#2a2a3a] overflow-hidden bg-[#1e1e2e]">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                {(prod.images || []).length === 0 && <span className="text-[#4a4a6a] text-[10px] font-bold">No images</span>}
                                {(prod.images || []).length > 3 && <div className="w-7 h-7 rounded border border-[#2a2a3a] bg-[#1e1e2e] flex items-center justify-center text-[#8888aa] text-[9px] font-black">+{prod.images.length - 3}</div>}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col gap-1">
                                {prod.is_active ? <span className="status-active">● Active</span> : <span className="status-draft">● Draft</span>}
                                {prod.is_featured && <span className="status-featured">★ Featured</span>}
                              </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={async () => {
                                    if (!supabase) return;
                                    const { data } = await supabase.from('products').select('*').eq('id', prod.id).single();
                                    setEditingProduct(data);
                                    setShowProductModal(true);
                                  }}
                                  className="btn-icon bg-[#1C3A6B]/20 text-blue-400 hover:bg-[#1C3A6B]/40 p-1.5 rounded-lg cursor-pointer">✏️</button>
                                <button onClick={() => handleDeleteProduct(prod.id)} className="btn-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 p-1.5 rounded-lg cursor-pointer">🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && <tr><td colSpan={7} className="text-center py-16 text-[#4a4a6a] text-xs font-semibold">No catalogue products match current filters.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="cat" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="admin-card p-5 mb-5 border border-[#C8962E]/20" style={{ background: 'linear-gradient(135deg,#C8962E08,transparent)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="text-[#C8962E] font-bold text-sm mb-1">PDF Catalog Storage strategy</h4>
                      <p className="text-[#8888aa] text-xs leading-relaxed font-medium">
                        Average PDF size range is 5-15MB. To prevent bucket space exhaustion, utilize multiple storage buckets on the Supabase console. Set them to Public read permissions to facilitate customer downloads.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Catalog Toolbar: Search + Filter + Sort ── */}
                <div className="flex flex-wrap gap-3 mb-5 items-center">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a6a] text-xs pointer-events-none">🔍</span>
                    <input
                      type="search"
                      value={catalogSearch}
                      onChange={e => setCatalogSearch(e.target.value)}
                      placeholder="Search catalogs by title or company..."
                      className="admin-input pl-8 placeholder-white/20 text-xs"
                    />
                    {catalogSearch && (
                      <button
                        onClick={() => setCatalogSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a6a] hover:text-white text-[10px] font-bold transition-colors"
                      >✕</button>
                    )}
                  </div>

                  {/* Type Filter */}
                  <select
                    value={catalogTypeFilter}
                    onChange={e => setCatalogTypeFilter(e.target.value)}
                    className="admin-select text-xs cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="floor-tiles">🔲 Floor Tiles</option>
                    <option value="wall-tiles">🔳 Wall Tiles</option>
                    <option value="bathroom-tiles">🛁 Bathroom Tiles</option>
                    <option value="designer-tiles">🎨 Designer Tiles</option>
                    <option value="vitrified">✨ Vitrified</option>
                    <option value="sanitary">🚿 Sanitary Ware</option>
                    <option value="artificial-stone">⚗️ Artificial Stone</option>
                    <option value="natural-cladding-stone">🪨 Natural Cladding Stone</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={catalogSort}
                    onChange={e => setCatalogSort(e.target.value as 'newest' | 'az')}
                    className="admin-select text-xs cursor-pointer"
                  >
                    <option value="newest">🕐 Newest First</option>
                    <option value="az">🔤 A – Z</option>
                  </select>

                  {/* Add button */}
                  <button
                    onClick={() => { setEditingCatalog(null); setShowCatalogModal(true); }}
                    className="btn-accent text-xs font-bold px-5 py-3 shadow-md shadow-[#C8962E]/10 cursor-pointer whitespace-nowrap ml-auto"
                  >➕ Add New Catalog</button>
                </div>

                {/* Result count pill */}
                {(() => {
                  const q = catalogSearch.toLowerCase();
                  const filtered = catalogs
                    .filter(c =>
                      (!q || c.title.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)) &&
                      (catalogTypeFilter === 'all' || c.catalog_type?.split(',').map((s: string) => s.trim()).includes(catalogTypeFilter))
                    )
                    .sort((a, b) => catalogSort === 'az' ? a.title.localeCompare(b.title) : 0);

                  return (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-[#C8962E]/10 border border-[#C8962E]/20 text-[#C8962E] text-[10px] font-bold px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C8962E] inline-block" />
                          {filtered.length} catalog{filtered.length !== 1 ? 's' : ''}
                        </span>
                        {(catalogSearch || catalogTypeFilter !== 'all' || catalogSort !== 'newest') && (
                          <button
                            onClick={() => { setCatalogSearch(''); setCatalogTypeFilter('all'); setCatalogSort('newest'); }}
                            className="text-[10px] text-[#4a4a6a] hover:text-[#C8962E] transition-colors font-bold underline underline-offset-2"
                          >Clear filters</button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(cat => (
                          <div key={cat.id} className="admin-card overflow-hidden group border border-[#1e1e2e]/85">
                            <div className="aspect-[4/3] relative overflow-hidden bg-[#0d0d16]">
                              <img src={cat.thumbnail_url || ''} alt={cat.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute top-3 right-3">{cat.is_active ? <span className="status-active">● Active</span> : <span className="status-draft">● Draft</span>}</div>
                              {/* Type badge */}
                              {cat.catalog_type?.includes('natural-cladding-stone') && (
                                <div className="absolute top-3 left-3">
                                  <span className="bg-amber-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded">🪨 Cladding</span>
                                </div>
                              )}
                              {cat.pdf_url && (
                                <a href={cat.pdf_url} target="_blank" rel="noopener noreferrer"
                                  className="absolute bottom-3 left-3 bg-[#C8962E] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-[#b08226] transition-colors shadow-md">📄 View PDF Document</a>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-[#e4e4ef] font-bold text-sm truncate">{cat.title}</h3>
                              <p className="text-[#8888aa] text-xs mt-0.5">{cat.company} · <span className="text-[#4a4a6a]">{cat.catalog_type}</span></p>
                              <div className="flex gap-2 mt-4">
                                <button onClick={() => { setEditingCatalog(cat); setShowCatalogModal(true); }}
                                  className="flex-1 py-2 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-xs font-semibold hover:border-[#C8962E] hover:text-[#C8962E] transition-all cursor-pointer">✏️ Edit Catalog</button>
                                <button onClick={() => handleDeleteCatalog(cat.id)} className="btn-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2 rounded-xl cursor-pointer">🗑️</button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filtered.length === 0 && (
                          <div className="col-span-3 text-center py-20 text-[#4a4a6a]">
                            <div className="text-5xl mb-3">{catalogSearch ? '🔍' : '📚'}</div>
                            <p className="text-xs font-bold">
                              {catalogSearch ? `No catalogs match "${catalogSearch}"` : 'No catalogs listed in the database. Add your first PDF file above.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div key="categories" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="space-y-6">

                {/* Information Callout */}
                <div className="bg-[#C8962E]/5 border border-[#C8962E]/25 rounded-2xl p-5 flex gap-4 cursor-default">
                  <span className="text-2xl mt-0.5 flex-shrink-0">🏷️</span>
                  <div>
                    <h3 className="text-white font-bold text-sm">Dynamic Categories & "What We Offer" Manager</h3>
                    <p className="text-[#8888aa] text-xs mt-1 leading-relaxed">
                      Customize the five category cards displayed on your homepage. You can edit names, emojis, cover photos, and toggle their visibility.
                      Uploading a background image here will dynamically update the homepage category background.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mb-4">
                  <button onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }} className="btn-accent text-xs font-bold px-5 py-3 shadow-md shadow-[#C8962E]/10 cursor-pointer">➕ Add New Category</button>
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-dashed border-[#1e1e2e]">
                    <div className="text-5xl mb-3">⚠️</div>
                    <p className="text-[#8888aa] text-sm font-semibold">No categories found in Supabase.</p>
                    <p className="text-[#4a4a6a] text-xs mt-2 max-w-sm mx-auto">
                      Please copy the SQL query from <code>categories_setup.sql</code> and execute it in your Supabase SQL editor, then run the database seeder to populate them.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categories.map((cat) => {
                    const count = cat.id === 'tiles-catalog'
                      ? catalogs.length
                      : products.filter(p => p.category === cat.id).length;

                    return (
                      <div key={cat.id} className="admin-card overflow-hidden group border border-[#1e1e2e]/85">
                        <div className="aspect-[16/9] relative overflow-hidden bg-[#0d0d16]">
                          {cat.image && (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-all duration-300" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                          <div className="absolute top-3 right-3">
                            {cat.is_active ? <span className="status-active">● Visible</span> : <span className="status-draft">● Hidden</span>}
                          </div>
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <span className="text-xl bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">{cat.emoji}</span>
                            <div>
                              <h4 className="text-white font-bold text-sm leading-none">{cat.name}</h4>
                              <span className="text-[10px] text-[#C8962E] font-bold mt-1.5 block">{count} Active Items</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-[#8888aa] text-xs line-clamp-2 min-h-[2rem]">{cat.description}</p>
                          <div className="flex gap-2 mt-4 pt-3 border-t border-[#1e1e2e]/50">
                            <button onClick={() => { setEditingCategory(cat); setShowCategoryModal(true); }}
                              className="flex-1 py-2 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-xs font-semibold hover:border-[#C8962E] hover:text-[#C8962E] hover:bg-[#C8962E]/5 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                              ✏️ Edit Design
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="btn-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2 rounded-xl cursor-pointer">🗑️</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showProductModal && <ProductModal product={editingProduct} categories={categories} onClose={() => { setShowProductModal(false); setEditingProduct(null); }} onSaved={fetchData} />}
        {showCatalogModal && <CatalogModal catalog={editingCatalog} onClose={() => { setShowCatalogModal(false); setEditingCatalog(null); }} onSaved={fetchData} />}
        {showCategoryModal && <CategoryModal category={editingCategory} onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }} onSaved={fetchData} />}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
