/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import * as tus from 'tus-js-client';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   (Typed structures matching the Postgres schemas)
────────────────────────────────────────────────────────────────── */
interface InquiryRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  product: string | null;
  requirement_type: string | null;
  message: string | null;
  created_at: string;
  status?: string;
}

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

type ActiveTab = 'dashboard' | 'inquiries' | 'products' | 'catalogs' | 'categories';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
────────────────────────────────────────────────────────────────── */
const CATALOG_BUCKETS = ['tile-catalogs', 'tile-catalogs-b', 'tile-catalogs-c', 'tile-catalogs-kajaria', 'tile-catalogs-somany', 'tile-catalogs-johnson'];
const CATEGORY_OPTIONS = ['marble', 'granite', 'kota-stone', 'cladding-stone', 'adhesives-chemicals'];
const APPLICATION_OPTIONS = ['Floor', 'Wall', 'Outdoor', 'Kitchen', 'Bathroom', 'Living Room', 'Elevation', 'Staircase', 'Swimming Pool'];

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

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

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
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group cursor-pointer ${
      active ? 'bg-gradient-to-r from-[#C8962E]/20 to-transparent text-[#C8962E] border border-[#C8962E]/30 shadow-md shadow-[#C8962E]/5'
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

    let fileToUpload = file;

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

    try {
      setConversionState('Uploading to Supabase...');
      const ext = fileToUpload.name.split('.').pop() || 'jpg';
      const name = `prod_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      
      const { data, error } = await supabase.storage.from('product-images').upload(name, fileToUpload, { 
        cacheControl: '3600', 
        upsert: false,
        onUploadProgress: (progressEvent: any) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setProgress(Math.min(95, percent));
        }
      } as any);
      
      if (error) throw error;

      setProgress(98);
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
      onChange([...images, publicUrl]);
      setProgress(100);
      showToast('Image uploaded successfully!');
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
            <div className="text-[#C8962E] text-xs font-semibold text-center">{conversionState || 'Uploading to Supabase...'}</div>
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
   PDF UPLOADER
────────────────────────────────────────────────────────────────── */
interface PdfUploaderProps {
  onUploaded: (url: string) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onUploaded }) => {
  const [bucket, setBucket] = useState(CATALOG_BUCKETS[0]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const client = supabase;
    if (!file || !client) return;
    setUploading(true);
    setProgress(5);
    try {
      const cleanName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._()-]/g, '');
      const name = `catalog_${Date.now()}_${cleanName}`;
      
      const { data: { session } } = await client.auth.getSession();
      const token = session?.access_token || '';

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const projectIdMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase/);
      const projectId = projectIdMatch ? projectIdMatch[1] : '';
      const endpoint = projectId
        ? `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`
        : `${supabaseUrl}/storage/v1/upload/resumable`;

      const upload = new tus.Upload(file, {
        endpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${token}`,
          'x-upsert': 'true',
        },
        metadata: {
          bucketName: bucket,
          objectName: name,
          contentType: 'application/pdf',
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024, // 6MB chunks
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        onProgress: (bytesUploaded, bytesTotal) => {
          const percent = Math.round((bytesUploaded / bytesTotal) * 100);
          setProgress(Math.min(99, percent));
        },
        onSuccess: () => {
          const { data: { publicUrl } } = client.storage.from(bucket).getPublicUrl(name);
          setProgress(100);
          onUploaded(publicUrl);
          showToast(`PDF catalog uploaded to "${bucket}"!`);
          setTimeout(() => { setUploading(false); setProgress(0); }, 800);
        },
        onError: (err) => {
          showToast('PDF upload failed: ' + err.message, 'error');
          setUploading(false); setProgress(0);
        }
      });

      upload.start();
    } catch (err: any) {
      showToast('PDF upload failed: ' + err.message, 'error');
      setUploading(false); setProgress(0);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="admin-label">Target Storage Bucket</label>
        <select value={bucket} onChange={e => setBucket(e.target.value)} className="admin-select cursor-pointer">
          {CATALOG_BUCKETS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
          placeholder="Or paste existing catalog PDF link..." className="admin-input flex-1 placeholder-white/20" />
        <button type="button" onClick={() => { if (urlInput.trim()) { onUploaded(urlInput.trim()); setUrlInput(''); showToast('PDF URL linked!'); } }}
          className="btn-accent px-4 py-2 text-xs whitespace-nowrap">Link URL</button>
      </div>
      <label className="upload-zone flex items-center justify-center gap-3 cursor-pointer p-5 border border-dashed border-[#2a2a3a] hover:border-[#C8962E]/50 rounded-2xl bg-white/[0.02]" onClick={() => fileRef.current?.click()}>
        {uploading ? (
          <div className="w-full space-y-2">
            <div className="text-[#C8962E] text-xs font-semibold text-center">Uploading PDF...</div>
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
            <div className="text-[#8888aa] text-[10px] text-center">{progress}% completed</div>
          </div>
        ) : (
          <>
            <span className="text-3xl">📄</span>
            <div>
              <div className="text-[#e4e4ef] text-sm font-semibold">Upload PDF Document</div>
              <div className="text-[#8888aa] text-xs mt-0.5">Click to browse .pdf files locally</div>
            </div>
          </>
        )}
      </label>
      <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleUpload} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PRODUCT MODAL
────────────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════
   PRODUCT MODAL (LUXURY SHOWROOM THEME)
────────────────────────────────────────────────────────────────── */
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
    colors: (product?.colors || []).join(', '),
    color_names: (product?.color_names || []).join(', '),
    application: product?.application || [] as string[],
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== false,
    images: product?.images || [] as string[],
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggleApp = (app: string) =>
    setForm(f => ({
      ...f,
      application: f.application.includes(app)
        ? f.application.filter(a => a !== app)
        : [...f.application, app]
    }));

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
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      color_names: form.color_names.split(',').map(s => s.trim()).filter(Boolean),
      application: form.application,
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

          {/* Colors Sync Synced Swatch options */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">🎨 Color variations (Slide synched)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="admin-label">Hex Colors (comma-sep)</label>
                <input type="text" value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="e.g. #FFFFFF, #C8962E, #333333" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Color Names (comma-sep)</label>
                <input type="text" value={form.color_names} onChange={e => set('color_names', e.target.value)} placeholder="e.g. White, Gold, Black" className="admin-input" />
              </div>
            </div>
            <p className="text-[#4a4a6a] text-[10px]">*Provide hex colors and names in corresponding order to link them with the uploaded slide images.</p>
          </div>

          {/* Applications */}
          <div className="space-y-3">
            <h4 className="text-[#C8962E] text-xs font-bold uppercase tracking-wider">🏠 Application Zones</h4>
            <div className="flex flex-wrap gap-2">
              {APPLICATION_OPTIONS.map(app => (
                <button type="button" key={app} onClick={() => toggleApp(app)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    form.application.includes(app) ? 'bg-[#C8962E] text-white border-[#C8962E]' : 'bg-transparent text-[#8888aa] border-[#2a2a3a] hover:border-[#C8962E]/50'
                  }`}>{app}</button>
              ))}
            </div>
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
  const [form, setForm] = useState({
    id: catalog?.id || '',
    title: catalog?.title || '',
    company: catalog?.company || '',
    description: catalog?.description || '',
    pdf_url: catalog?.pdf_url || '',
    thumbnail_url: catalog?.thumbnail_url || '',
    catalog_type: catalog?.catalog_type || 'tiles',
    tags: (catalog?.tags || []).join(', '),
    is_active: catalog?.is_active !== false,
    is_featured: (catalog as any)?.is_featured || false,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

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
      catalog_type: form.catalog_type,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      is_active: form.is_active,
      is_featured: form.is_featured,
    };
    try {
      let { error } = await supabase.from('catalogs').upsert(payload, { onConflict: 'id' });
      
      // Graceful fallback if is_featured column doesn't exist in Supabase catalogs table yet
      if (error && (error.message.includes('is_featured') || error.code === 'PGRST116')) {
        console.warn('Fallback: saving catalog without is_featured column');
        const { is_featured, ...payloadWithoutFeatured } = payload;
        const res = await supabase.from('catalogs').upsert(payloadWithoutFeatured, { onConflict: 'id' });
        error = res.error;
      }

      if (error) throw error;
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-xl my-8 rounded-2xl overflow-hidden shadow-2xl" 
        style={{ background: 'linear-gradient(135deg, #0d131f 0%, #080c14 100%)', border: '1px solid rgba(20, 184, 166, 0.25)' }}>
        <div className="flex items-center justify-between px-6 py-4" 
          style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(15, 23, 42, 0.15) 100%)', borderBottom: '1px solid rgba(20, 184, 166, 0.15)' }}>
          <div>
            <span className="text-[#14b8a6] text-[10px] font-black tracking-widest uppercase block mb-1">📖 DOCUMENT ARCHIVE PUBLISHER</span>
            <h3 className="text-white font-heading font-bold text-lg">{isEdit ? '✏️ Edit Catalog Document' : '📖 Publish New Catalog'}</h3>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all cursor-pointer">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div><label className="admin-label">Catalog Title *</label><input type="text" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Kajaria Glossy floor catalog" className="admin-input" /></div>
          <div><label className="admin-label">Company / Brand *</label><input type="text" required value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Kajaria, ColorTiles" className="admin-input" /></div>
          <div><label className="admin-label">Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Brief catalog description..." className="admin-input resize-none" /></div>
          <div>
            <label className="admin-label">Catalog Type *</label>
            <select
              value={form.catalog_type}
              onChange={e => set('catalog_type', e.target.value)}
              className="admin-input"
            >
              <optgroup label="Tiles">
                <option value="floor-tiles">🔲 Floor Tiles</option>
                <option value="wall-tiles">🔳 Wall Tiles</option>
                <option value="bathroom-tiles">🛁 Bathroom Tiles</option>
                <option value="designer-tiles">🎨 Designer Tiles</option>
                <option value="vitrified">✨ Vitrified Tiles</option>
              </optgroup>
              <optgroup label="Other Catalogs">
                <option value="sanitary">🚿 Sanitary Ware</option>
                <option value="artificial-stone">⚗️ Artificial Stone</option>
              </optgroup>
            </select>
          </div>
          <div><label className="admin-label">Cover Image Thumbnail URL</label><input type="text" value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} placeholder="Paste photo link..." className="admin-input" /></div>
          <div><label className="admin-label">Tags / Keywords (comma-sep)</label><input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Glossy, Ceramic, Bathroom" className="admin-input" /></div>
 
          <div>
            <h4 className="text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-2">📄 PDF Catalog File</h4>
            {form.pdf_url && (
              <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 text-xs font-semibold">✅ Linked:</span>
                <a href={form.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[#14b8a6] text-xs underline truncate flex-1">{form.pdf_url}</a>
                <button type="button" onClick={() => set('pdf_url', '')} className="text-red-400 text-xs hover:text-red-300">✕</button>
              </div>
            )}
            <PdfUploader onUploaded={url => set('pdf_url', url)} />
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    
    setUploading(true);
    setProgress(10);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const name = `cat_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('product-images').upload(name, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progressEvent: any) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setProgress(Math.min(95, percent));
        }
      } as any);

      if (error) throw error;
      setProgress(98);
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
      onUploaded(publicUrl);
      setProgress(100);
      showToast('Cover photo uploaded successfully!');
      setTimeout(() => { setUploading(false); setProgress(0); }, 500);
    } catch (err: any) {
      showToast('Cover upload failed: ' + err.message, 'error');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline px-4 py-2 text-xs flex items-center gap-2 cursor-pointer mt-1">
        {uploading ? `Uploading (${progress}%)` : '📤 Upload Cover Photo File'}
      </button>
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

/* ═══════════════════════════════════════════════════════════════
   INQUIRY DETAIL MODAL
────────────────────────────────────────────────────────────────── */
interface InquiryModalProps {
  inquiry: InquiryRecord;
  onClose: () => void;
  onStatusChanged: (status: string) => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ inquiry, onClose, onStatusChanged }) => {
  const whatsappLink = `https://wa.me/${inquiry.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inquiry.name)}%2C%20thank%20you%20for%20writing%20to%20Nilkanth%20Marble!`;
  const emailLink = inquiry.email ? `mailto:${inquiry.email}?subject=Nilkanth%20Marble%20-%20Inquiry%20Response&body=Hi%20${encodeURIComponent(inquiry.name)}%2C` : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-lg my-8 rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]" style={{ background: 'linear-gradient(135deg,#1C3A6B22,#C8962E11)' }}>
          <div>
            <h3 className="text-white font-heading font-bold text-lg">📥 Inquiry Details</h3>
            <p className="text-[#8888aa] text-xs mt-0.5">Received on {formatDate(inquiry.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-[#8888aa] hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all cursor-pointer">✕</button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Customer Name</label>
              <div className="text-white text-sm font-bold bg-[#171725] p-3 rounded-xl border border-[#1e1e2e]">{inquiry.name}</div>
            </div>
            <div>
              <label className="admin-label">Phone Number</label>
              <div className="text-white text-sm font-bold bg-[#171725] p-3 rounded-xl border border-[#1e1e2e]">{inquiry.phone}</div>
            </div>
            <div>
              <label className="admin-label">Email Address</label>
              <div className="text-white text-sm font-bold bg-[#171725] p-3 rounded-xl border border-[#1e1e2e] truncate">{inquiry.email || '—'}</div>
            </div>
            <div>
              <label className="admin-label">Location / City</label>
              <div className="text-white text-sm font-bold bg-[#171725] p-3 rounded-xl border border-[#1e1e2e]">{inquiry.city || '—'}</div>
            </div>
            <div>
              <label className="admin-label">Interested Product</label>
              <div className="text-white text-sm font-bold bg-[#171725] p-3 rounded-xl border border-[#1e1e2e]">{inquiry.product || 'General Enquiry'}</div>
            </div>
            <div>
              <label className="admin-label">Requirement Type</label>
              <div className="text-[#C8962E] text-sm font-bold bg-[#171725] p-3 rounded-xl border border-[#1e1e2e] capitalize">{inquiry.requirement_type || '—'}</div>
            </div>
          </div>

          <div>
            <label className="admin-label">Message Content</label>
            <div className="text-white text-sm bg-[#171725] p-3 rounded-xl border border-[#1e1e2e] min-h-[80px] whitespace-pre-wrap leading-relaxed">{inquiry.message || '—'}</div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <span className="text-[#8888aa] text-xs font-bold uppercase tracking-wider">Status:</span>
            <div className="flex gap-1.5 flex-1">
              {['unread', 'read', 'in_progress', 'replied'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChanged(st)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer capitalize flex-1 text-center ${
                    inquiry.status === st
                      ? st === 'unread' ? 'bg-rose-500/20 text-rose-400 border-rose-500' :
                        st === 'read' ? 'bg-amber-500/20 text-amber-400 border-amber-500' :
                        st === 'in_progress' ? 'bg-sky-500/20 text-sky-400 border-sky-500' :
                        'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                      : 'bg-transparent text-[#4a4a6a] border-[#1e1e2e] hover:border-[#8888aa]/30'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t border-[#1e1e2e]">
            <div className="flex gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-success px-4 py-2 text-xs font-bold shadow-sm">WhatsApp Reply</a>
              {emailLink && (
                <a href={emailLink} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-xl shadow-sm flex items-center justify-center transition-all">
                  Email Reply
                </a>
              )}
            </div>
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-xs font-semibold hover:border-[#444] hover:text-white transition-all cursor-pointer">Close</button>
          </div>
        </div>
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
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [catalogs, setCatalogs] = useState<CatalogRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductRecord> | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Partial<CatalogRecord> | null>(null);

  // Connection & Detail Status
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbErrorMessage, setDbErrorMessage] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);

  // Fetch Database Data from Supabase
  const fetchData = useCallback(async () => {
    if (!supabase) {
      setDbStatus('error');
      setDbErrorMessage('Supabase client is not configured.');
      return;
    }
    setFetchLoading(true);
    try {
      const [inqRes, prodRes, catRes] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('catalogs').select('*').order('created_at', { ascending: false }),
      ]);
      
      if (inqRes.error) throw inqRes.error;
      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;

      setInquiries(inqRes.data || []);
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

  const handleDeleteInquiry = async (id: string) => {
    if (!supabase || !confirm('Delete customer inquiry record?')) return;
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    showToast('Inquiry deleted successfully.');
    fetchData();
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
    if (error) {
      showToast('Failed to update status: ' + error.message, 'error');
      return;
    }
    showToast('Status updated!');
    fetchData();
  };

  const getInquiriesLast7Days = () => {
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      days.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }));
      
      const count = inquiries.filter(inq => {
        const inqDate = new Date(inq.created_at);
        return inqDate.toDateString() === dateStr;
      }).length;
      counts.push(count);
    }
    return { days, counts };
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
  const filteredInquiries = inquiries.filter(i =>
    i.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
    i.phone.includes(inquirySearch) ||
    (i.product || '').toLowerCase().includes(inquirySearch.toLowerCase())
  );

  // SVG Chart Computations
  const chartData = getInquiriesLast7Days();
  const maxVal = Math.max(3, ...chartData.counts);
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 25;
  const points = chartData.counts.map((c, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / 6;
    const y = chartHeight - padding - (c * (chartHeight - padding * 2)) / maxVal;
    return { x, y, val: c };
  });
  
  const pathD = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

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
          <NavItem id="inquiries" label="Inquiries" icon="📥" count={inquiries.filter(i => i.status === 'unread' || !i.status).length} active={activeTab === 'inquiries'} onClick={() => setActiveTab('inquiries')} />
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
              {activeTab === 'dashboard' ? '📊 Dashboard Overview' : activeTab === 'inquiries' ? '📥 Customer Inquiries' : activeTab === 'products' ? '💎 Product Catalogue' : activeTab === 'catalogs' ? '📚 PDF Catalogs Manager' : '🏷️ Homepage Categories'}
            </h2>
            <p className="text-[#8888aa] text-xs font-medium mt-0.5">
              {activeTab === 'dashboard' ? 'Real-time overview of database records' : activeTab === 'inquiries' ? `${inquiries.length} queries received` : activeTab === 'products' ? `${products.length} items listed` : activeTab === 'catalogs' ? `${catalogs.length} catalogs uploaded` : `${categories.length} categories on homepage`}
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
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                  dbStatus === 'connected' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                  dbStatus === 'checking' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                  'bg-rose-500/5 border-rose-500/20 text-rose-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Products" value={products.length} icon="💎" color="#1C3A6B" sub={`${products.filter(p => p.is_active).length} visible items`} />
                  <StatCard label="Customer Queries" value={inquiries.length} icon="📥" color="#C8962E" sub={`${inquiries.filter(i => i.status === 'unread' || !i.status).length} unread leads`} />
                  <StatCard label="Featured Stones" value={products.filter(p => p.is_featured).length} icon="⭐" color="#C8962E" sub="Featured on homepage" />
                  <StatCard label="PDF Catalogs" value={catalogs.length} icon="📄" color="#1C3A6B" sub={`${catalogs.filter(c => c.is_active).length} active`} />
                </div>

                {/* SVG Chart & Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visual Chart Card */}
                  <div className="admin-card p-5 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold text-sm">Customer Lead Analytics</h3>
                        <p className="text-[#8888aa] text-xs mt-0.5">Inquiries submitted over the last 7 days</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-[#C8962E] font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C8962E]" /> Leads
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      {inquiries.length > 0 ? (
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C8962E" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#C8962E" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          {[0, 0.5, 1].map((r, idx) => {
                            const y = padding + r * (chartHeight - padding * 2);
                            return (
                              <line key={idx} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#1e1e2e" strokeWidth="1" strokeDasharray="4 4" />
                            );
                          })}
                          {/* Area under the curve */}
                          {areaD && <path d={areaD} fill="url(#chartGrad)" />}
                          {/* Main Line */}
                          {pathD && <path d={pathD} fill="none" stroke="#C8962E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                          {/* Interactive dots */}
                          {points.map((p, idx) => (
                            <g key={idx} className="group/dot cursor-pointer">
                              <circle cx={p.x} cy={p.y} r="5" fill="#111118" stroke="#C8962E" strokeWidth="3" />
                              <circle cx={p.x} cy={p.y} r="10" fill="#C8962E" className="opacity-0 group-hover/dot:opacity-20 transition-opacity" />
                              {/* Tooltip */}
                              <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#fff" className="text-[10px] font-black opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                                {p.val}
                              </text>
                            </g>
                          ))}
                          {/* X-axis labels */}
                          {chartData.days.map((day, idx) => {
                            const x = padding + (idx * (chartWidth - padding * 2)) / 6;
                            return (
                              <text key={idx} x={x} y={chartHeight - 4} textAnchor="middle" fill="#4a4a6a" className="text-[9px] font-bold">
                                {day}
                              </text>
                            );
                          })}
                        </svg>
                      ) : (
                        <div className="h-[120px] flex items-center justify-center text-[#4a4a6a] text-xs font-semibold">No lead data to display</div>
                      )}
                    </div>
                  </div>

                  {/* Quick Info / Tips Card */}
                  <div className="admin-card p-5 flex flex-col justify-between">
                    <div>
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
                          <span className="w-6 h-6 rounded-lg bg-[#C8962E]/10 text-[#C8962E] flex items-center justify-center text-xs font-bold">ℹ</span>
                          <div>
                            <div className="text-[#e4e4ef] text-xs font-bold">Sync Action Plan</div>
                            <div className="text-[#8888aa] text-[10px] mt-0.5">Run "admin_setup.sql" to reset policies.</div>
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
                    </div>
                    <div className="pt-4 border-t border-[#1e1e2e] mt-4 flex items-center justify-between text-[11px] text-[#4a4a6a]">
                      <span className="font-bold">Project Ref:</span>
                      <span className="text-white/50 select-all font-mono font-black">nbmvvwvhjiubedlyfuyb</span>
                    </div>
                  </div>
                </div>
                
                {/* Recent Inquiries */}
                <div className="admin-card">
                  <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">Recent Inquiries</h3>
                    <button onClick={() => setActiveTab('inquiries')} className="text-[#C8962E] text-xs hover:underline font-bold cursor-pointer">View All →</button>
                  </div>
                  <div className="divide-y divide-[#1e1e2e]">
                    {inquiries.slice(0, 5).map(inq => (
                      <div key={inq.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.015] transition-colors cursor-pointer" onClick={() => setSelectedInquiry(inq)}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1C3A6B] to-[#C8962E] flex items-center justify-center text-white font-black text-xs flex-shrink-0">{inq.name.charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[#e4e4ef] text-sm font-bold flex items-center gap-2">
                            {inq.name}
                            {(inq.status === 'unread' || !inq.status) && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" title="Unread Lead" />
                            )}
                          </div>
                          <div className="text-[#8888aa] text-xs mt-0.5">{inq.product || 'General Enquiry'} · {inq.city || 'Location unprovided'}</div>
                        </div>
                        <div className="text-[#4a4a6a] text-xs font-bold">{formatDate(inq.created_at)}</div>
                      </div>
                    ))}
                    {inquiries.length === 0 && <div className="px-5 py-10 text-center text-[#4a4a6a] text-xs font-semibold">No inquiries received yet</div>}
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'inquiries' ? (
              <motion.div key="inq" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-4"><input type="search" value={inquirySearch} onChange={e => setInquirySearch(e.target.value)} placeholder="🔍 Search queries by customer name, phone, product..." className="admin-input max-w-sm placeholder-white/20" /></div>
                <div className="admin-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead style={{ background: '#0d0d16' }}>
                        <tr>{['Date', 'Customer', 'Contact details', 'Product', 'Message Text', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3.5 text-left text-[9px] font-bold text-[#4a4a6a] uppercase tracking-wider">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e2e]">
                        {filteredInquiries.map(inq => (
                          <tr key={inq.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-5 py-4 text-[#4a4a6a] text-xs font-bold whitespace-nowrap">{formatDate(inq.created_at)}</td>
                            <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedInquiry(inq)}>
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1C3A6B] to-[#C8962E] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{inq.name.charAt(0).toUpperCase()}</div>
                                <div className="font-bold text-[#e4e4ef] text-xs">{inq.name}</div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-[#e4e4ef] text-xs font-bold">📞 {inq.phone}</div>
                              {inq.email && <div className="text-[#8888aa] text-xs mt-0.5">✉️ {inq.email}</div>}
                              {inq.city && <div className="text-[#8888aa] text-xs mt-0.5">📍 {inq.city}</div>}
                            </td>
                            <td className="px-5 py-4"><span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: '#1C3A6B22', color: '#6ba3f5' }}>{inq.product || 'General'}</span></td>
                            <td className="px-5 py-4 max-w-[200px] cursor-pointer" onClick={() => setSelectedInquiry(inq)}>
                              <div className="text-[#8888aa] text-xs truncate hover:text-[#C8962E] transition-colors">{inq.message || '—'}</div>
                            </td>
                            <td className="px-5 py-4">
                              <select
                                value={inq.status || 'unread'}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                className={`px-2 py-1 rounded-lg text-xs font-bold border bg-[#111118] cursor-pointer transition-all ${
                                  inq.status === 'unread' ? 'text-rose-400 border-rose-500/30 bg-rose-500/5' :
                                  inq.status === 'read' ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' :
                                  inq.status === 'in_progress' ? 'text-sky-400 border-sky-500/30 bg-sky-500/5' :
                                  'text-emerald-400 border-emerald-500/30 bg-emerald-500/5'
                                }`}
                              >
                                <option value="unread" className="bg-[#0f0f16] text-rose-400 font-bold">🔴 Unread</option>
                                <option value="read" className="bg-[#0f0f16] text-amber-400 font-bold">🟡 Read</option>
                                <option value="in_progress" className="bg-[#0f0f16] text-sky-400 font-bold">🔵 In Progress</option>
                                <option value="replied" className="bg-[#0f0f16] text-emerald-400 font-bold">🟢 Replied</option>
                              </select>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <a href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inq.name)}%2C%20thank%20you%20for%20writing%20to%20Nilkanth%20Marble!`}
                                  target="_blank" rel="noopener noreferrer" className="btn-success py-1.5 px-3 text-xs font-bold rounded-lg shadow-sm">WhatsApp</a>
                                <button onClick={() => handleDeleteInquiry(inq.id)} className="btn-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 p-1.5 rounded-lg">🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredInquiries.length === 0 && <tr><td colSpan={7} className="text-center py-16 text-[#4a4a6a] text-xs font-semibold">No inquiries match search metrics.</td></tr>}
                      </tbody>
                    </table>
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
                <div className="flex justify-end mb-4">
                  <button onClick={() => { setEditingCatalog(null); setShowCatalogModal(true); }} className="btn-accent text-xs font-bold px-5 py-3 shadow-md shadow-[#C8962E]/10 cursor-pointer">➕ Add New Catalog</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogs.map(cat => (
                    <div key={cat.id} className="admin-card overflow-hidden group border border-[#1e1e2e]/85">
                      <div className="aspect-[4/3] relative overflow-hidden bg-[#0d0d16]">
                        <img src={cat.thumbnail_url || ''} alt={cat.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3">{cat.is_active ? <span className="status-active">● Active</span> : <span className="status-draft">● Draft</span>}</div>
                        {cat.pdf_url && (
                          <a href={cat.pdf_url} target="_blank" rel="noopener noreferrer"
                            className="absolute bottom-3 left-3 bg-[#C8962E] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-[#b08226] transition-colors shadow-md">📄 View PDF Document</a>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#e4e4ef] font-bold text-sm truncate">{cat.title}</h3>
                        <p className="text-[#8888aa] text-xs mt-0.5">{cat.company} · {cat.catalog_type}</p>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => { setEditingCatalog(cat); setShowCatalogModal(true); }}
                            className="flex-1 py-2 rounded-xl border border-[#2a2a3a] text-[#8888aa] text-xs font-semibold hover:border-[#C8962E] hover:text-[#C8962E] transition-all cursor-pointer">✏️ Edit Catalog</button>
                          <button onClick={() => handleDeleteCatalog(cat.id)} className="btn-icon bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2 rounded-xl cursor-pointer">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {catalogs.length === 0 && (
                    <div className="col-span-3 text-center py-20 text-[#4a4a6a]">
                      <div className="text-5xl mb-3">📚</div>
                      <p className="text-xs font-bold">No catalogs listed in the database. Add your first PDF file above.</p>
                    </div>
                  )}
                </div>
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
        {selectedInquiry && (
          <InquiryModal
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            onStatusChanged={(status) => handleUpdateInquiryStatus(selectedInquiry.id, status)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
