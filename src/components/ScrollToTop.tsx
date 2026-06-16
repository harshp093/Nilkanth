import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Scrolls the window to (0,0) on every route change.
 * Renders nothing; purely a side-effect component.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll — no smooth behaviour so the user arrives at the top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
