import React from 'react';

interface EcopetrolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EcopetrolLogo: React.FC<EcopetrolLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-20 w-auto',
  }[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdh0X2XeUccAiG6c0jNIKfT2Ih6DGGgyPxiyhdnCanyKXMF55d_CDE3ns4qnzXJXIUAGJtBWwwMb2CpWuS0woGttLVXR2QCllErtZlek2zyCIP3RR4g_4gciHqxnqqOQ8YX20YKliTpCOVc1E0KRCVFkAz1dRRth-iZM3VLRuDBAD_Ys1JeOxB-3_Gv5GPyepOQoJM49R7M4fYkUIN_j5vAs4Vtx-1Ms6g-FzTAlgiq71iFjQfSUVz"
        alt="Ecopetrol RTOC Logo"
        className={`${sizeClasses} object-contain filter drop-shadow`}
        onError={(e) => {
          // If network blocks external image, smoothly replace with inline high-fidelity SVG badge
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div 
        style={{ display: 'none' }}
        className="flex items-center justify-center bg-[#111827] border border-[#00B042]/40 rounded-lg p-1.5 shadow-[0_0_12px_rgba(0,176,66,0.25)]"
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 text-[#00B042]" fill="currentColor">
          <path d="M16 2L4 7v8c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V7L16 2zm0 3.3l9 3.8v6.9c0 6-4 11.6-9 12.9-5-1.3-9-6.9-9-12.9V9.1l9-3.8z" fill="#009639" />
          <path d="M16 8c-2.8 3.5-5 7.1-5 9.8 0 3 2.2 5.2 5 5.2s5-2.2 5-5.2c0-2.7-2.2-6.3-5-9.8z" fill="#00B042" />
          <path d="M11 17h1.5l1.5-3 2 6 2-4.5 1.5 1.5H21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </div>
  );
};
