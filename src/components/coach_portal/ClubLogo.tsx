import React from 'react';

interface ClubLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const ClubLogo: React.FC<ClubLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic crest rendition with Charales Fish, Soccer Ball & Colors */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full shadow-md bg-white p-0.5 border-2 border-[#3B59A8] overflow-hidden flex items-center justify-center`}>
        <img
          src="/public/assets/aistudio/logo_b0fcde7b.jpg"
          alt="Logo Charales de Chapala"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            const currentSrc = e.currentTarget.getAttribute('src');
            if (currentSrc?.startsWith('/public/')) {
              e.currentTarget.src = '/assets/aistudio/logo_b0fcde7b.jpg';
            } else {
              e.currentTarget.style.display = 'none';
              const svgEl = e.currentTarget.parentElement?.querySelector('svg');
              if (svgEl) (svgEl as unknown as HTMLElement).style.display = 'block';
            }
          }}
        />
        <svg viewBox="0 0 120 120" className="w-full h-full hidden" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Circular outer ring */}
          <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          
          {/* Top text arc placeholder / styling */}
          <path id="textPathTop" d="M 22 58 A 38 38 0 0 1 98 58" fill="none" />
          <text fontSize="7.5" fontWeight="bold" fill="#111111" letterSpacing="0.8">
            <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
              FUTBOL CLUB
            </textPath>
          </text>

          {/* Bottom text arc */}
          <path id="textPathBottom" d="M 98 64 A 38 38 0 0 1 22 64" fill="none" />
          <text fontSize="6.5" fontWeight="bold" fill="#111111" letterSpacing="0.6">
            <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
              CHARALES DE CHAPALA
            </textPath>
          </text>

          {/* Inner crest circle with blue/red wave dynamic background */}
          <circle cx="60" cy="60" r="28" fill="#F8F9FA" stroke="#3B59A8" strokeWidth="2" />
          
          {/* Blue water lake wave representing Lake Chapala */}
          <path d="M33 62 C40 54, 52 56, 60 62 C68 68, 79 66, 87 60 L87 75 C78 82, 65 84, 60 84 C50 84, 38 80, 33 75 Z" fill="#3B59A8" fillOpacity="0.85" />
          
          {/* Red dynamic stripe */}
          <path d="M40 78 C50 82, 68 82, 80 74 C75 80, 60 86, 45 84 Z" fill="#E31B23" />

          {/* Charal Fish dynamic silhouette */}
          <path 
            d="M 44 54 C 47 48, 56 46, 66 49 C 74 51, 78 57, 75 62 C 70 60, 64 57, 56 57 C 50 57, 46 59, 44 54 Z" 
            fill="#3B59A8" 
          />
          <path 
            d="M 75 62 C 81 59, 83 54, 82 50 C 80 54, 76 58, 71 59 Z" 
            fill="#E31B23" 
          />
          <circle cx="50" cy="51" r="1.5" fill="#FFFFFF" />

          {/* Soccer Ball icon at center right */}
          <circle cx="68" cy="67" r="7" fill="#FFFFFF" stroke="#111111" strokeWidth="1" />
          <polygon points="68,64 70,66 69,69 67,69 66,66" fill="#111111" />
          <line x1="68" y1="64" x2="68" y2="61" stroke="#111111" strokeWidth="0.8" />
          <line x1="70" y1="66" x2="73" y2="65" stroke="#111111" strokeWidth="0.8" />
          <line x1="69" y1="69" x2="72" y2="72" stroke="#111111" strokeWidth="0.8" />
          <line x1="67" y1="69" x2="65" y2="72" stroke="#111111" strokeWidth="0.8" />
          <line x1="66" y1="66" x2="63" y2="65" stroke="#111111" strokeWidth="0.8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white leading-tight">
            Charales de Chapala
          </span>
          <span className="text-[11px] font-medium text-slate-300 tracking-wide uppercase">
            Escuela de Fútbol Infantil
          </span>
        </div>
      )}
    </div>
  );
};
