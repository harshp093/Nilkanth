import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * A subtle "Back" navigation bar shown below the navbar on every page
 * except the homepage. Uses browser history when available and falls
 * back to the homepage so the button is never a dead end.
 */
const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Never show on the homepage
  if (location.pathname === '/') return null;

  const handleBack = () => {
    // If there is history to go back to, use it; otherwise go home.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-bg/80 backdrop-blur-sm border-b border-border/40 transition-colors">
      <div className="max-w-7xl 2xl:max-w-[1500px] 3xl:max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          type="button"
          onClick={handleBack}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Go back to the previous page"
          className="group my-2.5 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-dark/70 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer min-h-[40px]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </motion.button>
      </div>
    </div>
  );
};

export default BackButton;
