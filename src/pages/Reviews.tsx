/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import useSEO from '../hooks/useSEO';

interface Review {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  city?: string;
  is_approved?: boolean;
  created_at?: string;
}

// Fallback reviews shown when Supabase is unavailable (mirrors seedReviews.cjs)
const FALLBACK_REVIEWS: Review[] = [
  { name: 'Sandip Patel', rating: 5, city: 'Nadiad', comment: 'Best quality Italian marble and granite collection in Nadiad. The team is very professional, rates are reasonable and delivery is on time. Highly recommended!' },
  { name: 'Dr. Amit Shah', rating: 5, city: 'Anand', comment: 'Sourced vitrified tiles and kitchen granite for my new clinic. Amazing variety and genuine guidance about the right thickness and materials.' },
  { name: 'Karan Vaghela', rating: 5, city: 'Ahmedabad', comment: 'Huge showroom at Piplag Chokdi. Sourced Kota stone and cladding tiles for my farmhouse. Delivery was prompt and material quality is excellent.' },
  { name: 'Ramesh Bhai Prajapati', rating: 5, city: 'Nadiad', comment: 'Perfect place for all flooring needs. Huge stock of natural stones, marble, granite, and tiles. Genuine rates and no dummy commitments.' },
  { name: 'Snehal Desai', rating: 4, city: 'Vadodara', comment: 'Excellent collection of sanitary ware and brand tiles. Visited after checking their catalog online. Excellent service!' },
  { name: 'Vijay Chavda', rating: 5, city: 'Nadiad', comment: 'Good options for steps tile and parking tiles. Staff is cooperative and helpful in choosing colors. Quality stone supplier.' },
];

const StarRating: React.FC<{ value: number; size?: number; onSelect?: (v: number) => void }> = ({ value, size = 16, onSelect }) => (
  <div className="flex items-center gap-0.5" role={onSelect ? 'radiogroup' : undefined} aria-label="Rating">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        disabled={!onSelect}
        onClick={() => onSelect?.(star)}
        aria-label={`${star} star${star > 1 ? 's' : ''}`}
        className={onSelect ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill={star <= value ? '#C8962E' : 'none'} stroke="#C8962E" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    ))}
  </div>
);

const Reviews: React.FC = () => {
  useSEO({
    title: 'Customer Reviews | Nilkanth Marble — Nadiad, Gujarat',
    description: 'Read genuine customer reviews for Nilkanth Marble in Nadiad, Gujarat, and share your own experience with our marble, granite and tiles.',
    url: '/reviews',
    keywords: 'Nilkanth Marble reviews, customer feedback marble Nadiad, granite dealer ratings Gujarat',
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Submission form state
  const [form, setForm] = useState<{ name: string; city: string; rating: number; comment: string }>({
    name: '', city: '', rating: 5, comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitError, setSubmitError] = useState('');

  const loadReviews = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setReviews(data as Review[]);
          return;
        }
        // No rows yet — show fallback so the page isn't empty
        setReviews(FALLBACK_REVIEWS);
        return;
      } catch (err) {
        console.warn('Supabase reviews fetch failed, using fallback:', err);
      }
    }
    setReviews(FALLBACK_REVIEWS);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      await loadReviews();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitMsg('');

    if (!form.name.trim() || !form.comment.trim()) {
      setSubmitError('Please enter your name and a short comment.');
      return;
    }
    if (form.rating < 1 || form.rating > 5) {
      setSubmitError('Please select a rating between 1 and 5 stars.');
      return;
    }

    if (!supabase) {
      setSubmitError('Review submission is temporarily unavailable. Please contact us via WhatsApp.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim().slice(0, 120),
        city: form.city.trim().slice(0, 80) || null,
        rating: form.rating,
        comment: form.comment.trim().slice(0, 1000),
        is_approved: true,
      };
      const { error } = await supabase.from('reviews').insert(payload);
      if (error) throw error;

      setSubmitMsg('Thank you! Your review has been posted.');
      setForm({ name: '', city: '', rating: 5, comment: '' });
      await loadReviews();
    } catch (err: any) {
      setSubmitError(err?.message || 'Could not submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Customer Reviews</span>
          </nav>
          <h1 className="text-3xl font-heading font-black text-gray-900">Customer Reviews</h1>
          <p className="text-gray-500 mt-1">What our customers say about Nilkanth Marble</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2">
            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center gap-5">
              <div className="text-center">
                <div className="text-4xl font-heading font-black text-accent leading-none">{averageRating || '—'}</div>
                <div className="mt-2 flex justify-center"><StarRating value={Math.round(averageRating)} /></div>
                <div className="text-xs text-gray-500 mt-1.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed border-l border-gray-100 pl-5">
                Genuine feedback from customers across Gujarat who trust us for premium marble, granite, kota stone and tiles.
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
                <p className="text-gray-500 text-sm">Loading reviews...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <motion.div
                    key={r.id || `${r.name}-${i}`}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-black">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-gray-900 text-sm">{r.name}</p>
                          {r.city && <p className="text-gray-400 text-xs">📍 {r.city}</p>}
                        </div>
                      </div>
                      <StarRating value={r.rating} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mt-3">{r.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Submit review form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-heading font-black text-gray-900 mb-1">Write a Review</h2>
              <div className="section-divider mb-5" />

              {submitMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm mb-4">✅ {submitMsg}</div>
              )}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm mb-4">⚠️ {submitError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Sandip Patel"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">City (optional)</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="e.g. Nadiad"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Your Rating</label>
                  <StarRating value={form.rating} size={26} onSelect={v => setForm(f => ({ ...f, rating: v }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Your Review</label>
                  <textarea
                    required
                    rows={4}
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with our products and service..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent w-full justify-center py-3 text-sm font-bold disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
