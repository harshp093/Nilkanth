import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../utils/supabase';


interface InquiryFormProps {
  productName?: string;
  productSlug?: string;
  catalogTitle?: string;
  className?: string;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  city: string;
  product: string;
  type: 'single' | 'bulk' | 'sample';
  message: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({
  productName = '',
  catalogTitle,
  className = '',
}) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    city: '',
    product: productName || catalogTitle || '',
    type: 'single',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '').replace(/^\+91/, '')))
      errs.phone = 'Enter valid 10-digit Indian mobile number';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);

    let supabaseSaved = false;

    // 1. Try saving to Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .insert({
            name: form.name,
            phone: form.phone,
            email: form.email || null,
            city: form.city || null,
            product: form.product || null,
            requirement_type: form.type,
            message: form.message || null,
          });

        if (!error) {
          supabaseSaved = true;
        } else {
          console.warn('Failed to insert inquiry to Supabase, saving locally:', error.message);
        }
      } catch (err) {
        console.error('Failed to communicate with Supabase:', err);
      }
    }

    // 2. Local fallback if Supabase is offline or not configured
    if (!supabaseSaved) {
      const inquiries = JSON.parse(localStorage.getItem('nm_inquiries') || '[]');
      inquiries.push({ ...form, createdAt: new Date().toISOString(), id: Date.now().toString() });
      localStorage.setItem('nm_inquiries', JSON.stringify(inquiries));
    }

    setLoading(false);
    setSubmitted(true);

    // Redirect to WhatsApp with inquiry details
    const waNumber = '919974142777';
    const reqLabels: Record<string, string> = {
      single: 'Single Purchase 🏠',
      bulk: 'Bulk Order 📦',
      sample: 'Sample Request 🔍',
    };
    const waText = `Hi Hitesh Shah,

I would like to make an inquiry from the website:
• *Name:* ${form.name}
• *Phone:* +91 ${form.phone}
${form.email ? `• *Email:* ${form.email}\n` : ''}${form.city ? `• *City:* ${form.city}\n` : ''}${form.product ? `• *Interest:* ${form.product}\n` : ''}• *Type:* ${reqLabels[form.type] || form.type}
${form.message ? `• *Details:* ${form.message}` : ''}`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`, '_blank', 'noopener,noreferrer');
  };

  const update = (field: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-green-50 border border-green-200 rounded-xl p-8 text-center ${className}`}
      >
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-heading font-bold text-green-800 text-xl mb-2">
          Inquiry Sent Successfully!
        </h3>
        <p className="text-green-700 text-sm mb-6">
          We'll contact you within 24 hours. You can also reach us directly:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/919974142777?text=Hi! I just submitted an inquiry on your website."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
          <a href="tel:+919974142777" className="btn-primary text-sm">
            📞 Call +91 99741 42777
          </a>
        </div>
        <button
          onClick={() => { setSubmitted(false); setForm(f => ({ ...f, message: '' })); }}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Your name"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500 font-medium">
              +91
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="99741 42777"
              className={`flex-1 px-3.5 py-2.5 border rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
          <input
            type="text"
            value={form.city}
            onChange={e => update('city', e.target.value)}
            placeholder="Your city"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Product */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Product / Interest
        </label>
        <input
          type="text"
          value={form.product}
          onChange={e => update('product', e.target.value)}
          placeholder="Which product are you interested in?"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Requirement Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Requirement Type
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'single', label: '🏠 Single Purchase' },
            { value: 'bulk', label: '📦 Bulk Order' },
            { value: 'sample', label: '🔍 Sample Request' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('type', opt.value)}
              className={`filter-chip ${form.type === opt.value ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Your Requirements
        </label>
        <textarea
          value={form.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Tell us about your project — area size, usage, timeline, any specific requirements…"
          rows={3}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary justify-center py-3 text-base"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
            </svg>
            Sending…
          </span>
        ) : (
          '📋 Send Inquiry'
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        We'll respond within 24 hours. No spam, ever.
      </p>
    </form>
  );
};

export default InquiryForm;
