import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonical?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SITE = 'Nilkanth Marble';
const BASE_URL = 'https://www.nilkanthmarble.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * useSEO — Updates document <title>, meta tags, canonical, OG, Twitter cards,
 * and injects optional page-level JSON-LD structured data.
 * Call this at the top of each page component.
 */
const useSEO = ({ title, description, keywords, image, url, canonical, jsonLd, noindex }: SEOProps) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE) ? title : `${title} | ${SITE}`;
    const resolvedImage = image
      ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
      : DEFAULT_IMAGE;
    const resolvedCanonical = canonical
      ? canonical
      : url
        ? `${BASE_URL}${url}`
        : null;

    // ─── Title ────────────────────────────────────────────────────
    document.title = fullTitle;

    // ─── Helper: set or create meta ───────────────────────────────
    const setMeta = (selector: string, content: string, attrName = 'name') => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${selector}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, selector);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // ─── Robots ───────────────────────────────────────────────────
    setMeta('robots', noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

    // ─── Primary Meta ─────────────────────────────────────────────
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
      setMeta('twitter:description', description);
    }
    if (keywords) setMeta('keywords', keywords);

    // ─── OG + Twitter ─────────────────────────────────────────────
    setMeta('og:title', fullTitle, 'property');
    setMeta('twitter:title', fullTitle);
    setMeta('og:image', resolvedImage, 'property');
    setMeta('twitter:image', resolvedImage);
    setMeta('og:type', 'website', 'property');

    if (resolvedCanonical) {
      setMeta('og:url', resolvedCanonical, 'property');
      let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', resolvedCanonical);
    }

    // ─── JSON-LD (page-level, injected dynamically) ───────────────
    let ldScript = document.getElementById('page-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!ldScript) {
        ldScript = document.createElement('script');
        ldScript.setAttribute('type', 'application/ld+json');
        ldScript.setAttribute('id', 'page-jsonld');
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(jsonLd, null, 2);
    } else if (ldScript) {
      ldScript.remove();
    }

    // ─── Cleanup: restore defaults on unmount ─────────────────────
    return () => {
      document.title = 'Nilkanth Marble | Premium Marble, Granite & Tiles — Nadiad, Gujarat';
      setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
      const ld = document.getElementById('page-jsonld');
      if (ld) ld.remove();
      // Restore canonical to homepage
      const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (canonicalEl) canonicalEl.setAttribute('href', `${BASE_URL}/`);
    };
  }, [title, description, keywords, image, url, canonical, jsonLd, noindex]);
};

export default useSEO;
