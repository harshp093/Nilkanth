/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg('Supabase is not configured.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Strict Admin Email and Phone Validation Check
    if (email.trim().toLowerCase() !== 'harshpra1624@gmail.com') {
      setErrorMsg('Unauthorized: Email is not in the administrator access list.');
      setLoading(false);
      return;
    }

    const normalizedPhone = phone.replace(/\s/g, '').replace(/^\+91/, '');
    const allowedPhones = ['7778803008', '917778803008', '+917778803008'];

    if (!allowedPhones.includes(normalizedPhone)) {
      setErrorMsg('Unauthorized: Phone number is not in the allowed admin list.');
      setLoading(false);
      return;
    }

    try {
      // Sign In with Supabase Auth (removed unused data variable)
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Authorization successful!');
        setTimeout(() => {
          onClose();
          navigate('/admin');
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black/60 border border-white/15 w-full max-w-md rounded-2xl shadow-[0_0_60px_rgba(200,150,46,0.15)] overflow-hidden text-white backdrop-blur-lg"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-black/40 via-black/60 to-black/40 flex items-center justify-between border-b border-white/10">
            <h3 className="font-heading font-black text-lg tracking-wide text-gradient-gold">
              🏛️ Admin Portal Sign In
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer text-base"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 font-medium"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-950/40 border border-green-500/40 rounded-xl p-3 text-xs text-green-300 font-medium"
              >
                ✅ {successMsg}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-[10px] font-bold text-[#C8962E] uppercase tracking-widest mb-2 font-outfit">
                Gmail / Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter admin email..."
                style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-[#C8962E] rounded-xl text-sm text-white focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[0_0_15px_rgba(200,150,46,0.25)] placeholder-white/30"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-[10px] font-bold text-[#C8962E] uppercase tracking-widest mb-2 font-outfit">
                Authorized Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter phone number..."
                style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-[#C8962E] rounded-xl text-sm text-white focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[0_0_15px_rgba(200,150,46,0.25)] placeholder-white/30"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-[10px] font-bold text-[#C8962E] uppercase tracking-widest mb-2 font-outfit">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:border-[#C8962E] rounded-xl text-sm text-white focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[0_0_15px_rgba(200,150,46,0.25)] placeholder-white/30"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-xs font-bold text-black bg-[#C8962E] hover:bg-yellow-600 focus:outline-none transition-all disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? 'Processing...' : '🔐 Sign In'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminAuthModal;
