import React from 'react';

const Logo: React.FC<{ className?: string, size?: number }> = ({ className = '', size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Roof / Arch */}
      <path d="M 50 5 L 95 50 L 80 65 A 40 40 0 0 0 20 65 L 5 50 Z" />
      
      {/* Inner Tilak Marks */}
      <rect x="33" y="45" width="10" height="6" rx="3" />
      <rect x="57" y="45" width="10" height="6" rx="3" />
      <ellipse cx="50" cy="48" rx="5" ry="9" />
      
      {/* Bottom Shield / Heart */}
      <path d="M 50 62 C 45 55, 32 55, 32 64 L 32 75 L 50 93 L 68 75 L 68 64 C 68 55, 55 55, 50 62 Z" />
    </svg>
  );
};

export default Logo;
