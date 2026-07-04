import React from 'react';

/**
 * Nilkanth Marble — Official Logo
 * A single premium SVG used everywhere: navbar, footer, browser tab (favicon).
 * Design: Detailed Shivlinga nested within a glowing sacred arch + Trident (Trishul) & Moon details.
 */
const Logo: React.FC<{ className?: string; size?: number; variant?: 'full' | 'icon' }> = ({
  className = '',
  size = 40,
  variant = 'icon',
}) => {
  if (variant === 'full') {
    return (
      <svg
        width={size * 4.5}
        height={size}
        viewBox="0 0 180 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Shivlinga + Arch Emblem */}
        <g transform="translate(2, 0)">
          {/* Circular radiant aura */}
          <circle cx="20" cy="20" r="17" stroke="url(#goldGradient)" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.45" />
          
          {/* Temple Arch Outline */}
          <path
            d="M5,35 L5,16 C5,7.7 11.7,1 20,1 C28.3,1 35,7.7 35,16 L35,35"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Shivlinga Silhouette */}
          {/* 1. Pedestal / Yoni (Base part with spout on the left) */}
          <path
            d="M10,28 C10,25.5 13,24.5 20,24.5 C27,24.5 30,25.5 30,28 C30,30.5 27.5,31.5 20,31.5 C12.5,31.5 10,30.5 10,28 Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M7,27.5 L12,27.5 L12,29.5 L7,29.5 C5.5,29.5 5,28.8 5,28.5 C5,28.2 5.5,27.5 7,27.5"
            fill="currentColor"
            opacity="0.9"
          />
          {/* Stand / Peetham base */}
          <path
            d="M13,31 L27,31 L25,35 L15,35 Z"
            fill="url(#goldGradient)"
          />

          {/* 2. Oval Lingam */}
          <path
            d="M15.5,17.5 C15.5,12 17.5,9.5 20,9.5 C22.5,9.5 24.5,12 24.5,17.5 C24.5,23 22.5,25.5 20,25.5 C17.5,25.5 15.5,23 15.5,17.5 Z"
            fill="currentColor"
          />

          {/* 3. Tripundra (Three holy horizontal stripes on the Lingam) */}
          <g transform="translate(17, 14.5)">
            <line x1="0.5" y1="1" x2="5.5" y2="1" stroke="#C8962E" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="0" y1="2.2" x2="6" y2="2.2" stroke="#C8962E" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="0.5" y1="3.4" x2="5.5" y2="3.4" stroke="#C8962E" strokeWidth="0.8" strokeLinecap="round" />
            {/* Red Bindu in the center */}
            <circle cx="3" cy="2.2" r="0.75" fill="#EF4444" />
          </g>

          {/* Crescent Moon */}
          <path
            d="M25,12 C26.8,12.3 27.2,13.8 26.5,14.8 C25.8,13.8 24.8,13.4 24.2,13.5 C23.8,13.6 23.5,14 23.7,14.4 C23.9,14.7 24.3,14.8 24.6,14.5 C25.2,14 24.8,12.8 25,12"
            fill="#E5E7EB"
            opacity="0.9"
          />

          {/* Trishul (Trident) on the side */}
          <path
            d="M32.5,15 L32.5,35 M31,16.8 C31.8,17.6 33.2,17.6 34,16.8 M32.5,13.5 L32.5,15.5"
            stroke="url(#goldGradient)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5A93C" />
              <stop offset="50%" stopColor="#C8962E" />
              <stop offset="100%" stopColor="#9A701C" />
            </linearGradient>
          </defs>
        </g>

        {/* Text */}
        <text x="46" y="17" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="14.5" fill="currentColor" letterSpacing="0.2">
          NILKANTH
        </text>
        <text x="46" y="30" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" fontSize="10.5" fill="#C8962E" letterSpacing="3.5">
          MARBLE
        </text>
        <text x="46" y="39" fontFamily="'Inter', sans-serif" fontWeight="400" fontSize="7.5" fill="currentColor" opacity="0.5" letterSpacing="1">
          THE QUALITY FOREVER
        </text>
      </svg>
    );
  }

  // Icon only variant
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        {/* Circular radiant aura */}
        <circle cx="20" cy="20" r="17" stroke="url(#goldGradientIcon)" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.45" />
        
        {/* Arch */}
        <path
          d="M5,35 L5,16 C5,7.7 11.7,1 20,1 C28.3,1 35,7.7 35,16 L35,35"
          fill="none"
          stroke="url(#goldGradientIcon)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Yoni Pedestal */}
        <path
          d="M10,28 C10,25.5 13,24.5 20,24.5 C27,24.5 30,25.5 30,28 C30,30.5 27.5,31.5 20,31.5 C12.5,31.5 10,30.5 10,28 Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M7,27.5 L12,27.5 L12,29.5 L7,29.5 C5.5,29.5 5,28.8 5,28.5 C5,28.2 5.5,27.5 7,27.5"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Base */}
        <path
          d="M13,31 L27,31 L25,35 L15,35 Z"
          fill="url(#goldGradientIcon)"
        />

        {/* Lingam */}
        <path
          d="M15.5,17.5 C15.5,12 17.5,9.5 20,9.5 C22.5,9.5 24.5,12 24.5,17.5 C24.5,23 22.5,25.5 20,25.5 C17.5,25.5 15.5,23 15.5,17.5 Z"
          fill="currentColor"
        />

        {/* Tripundra stripes */}
        <g transform="translate(17, 14.5)">
          <line x1="0.5" y1="1" x2="5.5" y2="1" stroke="#C8962E" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="0" y1="2.2" x2="6" y2="2.2" stroke="#C8962E" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="0.5" y1="3.4" x2="5.5" y2="3.4" stroke="#C8962E" strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="3" cy="2.2" r="0.75" fill="#EF4444" />
        </g>

        {/* Crescent Moon */}
        <path
          d="M25,12 C26.8,12.3 27.2,13.8 26.5,14.8 C25.8,13.8 24.8,13.4 24.2,13.5 C23.8,13.6 23.5,14 23.7,14.4 C23.9,14.7 24.3,14.8 24.6,14.5 C25.2,14 24.8,12.8 25,12"
          fill="#E5E7EB"
          opacity="0.9"
        />

        {/* Trishul */}
        <path
          d="M32.5,15 L32.5,35 M31,16.8 C31.8,17.6 33.2,17.6 34,16.8 M32.5,13.5 L32.5,15.5"
          stroke="url(#goldGradientIcon)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="goldGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5A93C" />
            <stop offset="50%" stopColor="#C8962E" />
            <stop offset="100%" stopColor="#9A701C" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
};

export default Logo;
