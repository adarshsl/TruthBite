import React, { useId } from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  const maskId = useId();
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <mask id={maskId}>
          <rect width="100" height="100" fill="white" />
          <circle cx="85" cy="15" r="22" fill="black" />
        </mask>
      </defs>
      {/* Main Circle with Bite Mask */}
      <circle cx="50" cy="50" r="50" className="fill-red-500" mask={`url(#${maskId})`} />
      
      {/* Checkmark */}
      <path 
        d="M32 52 L48 68 L72 36" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};