import React, { useState, useCallback } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string; // e.g. "4/3", "1/1", "16/9"
  quality?: number;     // 1-100, default 75
  width?: number;       // hint for URL optimization
}

/**
 * Optimizes image URLs for faster loading:
 * - Unsplash: appends ?w=&q=&auto=format&fm=webp
 * - S3/Datnass CDN: appends quality param
 * - All images: loading="lazy" decoding="async"
 * - Shows a shimmer skeleton while loading
 * - Fades in on load
 * - Shows fallback on error
 */
function optimizeUrl(src: string, width = 600, quality = 75): string {
  if (!src) return src;
  try {
    // Unsplash images — add WebP + auto sizing
    if (src.includes('unsplash.com')) {
      const base = src.split('?')[0];
      return `${base}?w=${width}&q=${quality}&auto=format&fm=webp&fit=crop`;
    }
    // Placehold.co — no optimization needed
    if (src.includes('placehold.co')) return src;
    // Data URIs — no optimization
    if (src.startsWith('data:')) return src;
    // S3/Datnass — try appending quality if no existing query
    if (src.includes('s3.gdx.datnass.com') || src.includes('amazonaws.com')) {
      if (!src.includes('?')) return `${src}?quality=${quality}`;
    }
    return src;
  } catch {
    return src;
  }
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&q=60&auto=format&fm=webp',
  aspectRatio,
  quality = 75,
  width = 600,
  className = '',
  style,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const optimized = error ? fallback : optimizeUrl(src, width, quality);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => {
    if (!error) setError(true);
  }, [error]);

  return (
    <div
      className="relative overflow-hidden"
      style={aspectRatio ? { aspectRatio, ...style } : style}
    >
      {/* Shimmer skeleton */}
      {!loaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-[#1a1a24] dark:via-[#22222e] dark:to-[#1a1a24]"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s linear infinite',
          }}
        />
      )}
      <img
        src={optimized}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-400 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={!aspectRatio ? style : undefined}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
