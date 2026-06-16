import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

/**
 * useSEO — Updates document <title> and meta tags for every page.
 * Call this at the top of each page component.
 */
const useSEO = ({ title, description, keywords, image, url }: SEOProps) => {
  useEffect(() => {
    const SITE = 'Nilkanth Marble & Tiles';
    const fullTitle = title.includes(SITE) ? title : `${title} | ${SITE}`;
    const baseUrl = 'https://nilkanthmarbel.com';

    // Title
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
      setMeta('twitter:description', description);
    }
    if (keywords) setMeta('keywords', keywords);
    if (image)  {
      setMeta('og:image', image.startsWith('http') ? image : `${baseUrl}${image}`, 'property');
      setMeta('twitter:image', image.startsWith('http') ? image : `${baseUrl}${image}`);
    }

    setMeta('og:title', fullTitle, 'property');
    setMeta('twitter:title', fullTitle);
    if (url) {
      setMeta('og:url', `${baseUrl}${url}`, 'property');
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `${baseUrl}${url}`);
    }
  }, [title, description, keywords, image, url]);
};

export default useSEO;
