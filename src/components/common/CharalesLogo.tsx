import React, { useState } from 'react';

interface CharalesLogoProps {
  className?: string;
  size?: number;
}

export const CharalesLogo: React.FC<CharalesLogoProps> = ({ className = '', size = 44 }) => {
  const [imgError, setImgError] = useState(false);
  const [triedAlt, setTriedAlt] = useState(false);

  if (!imgError) {
    return (
      <img
        src={triedAlt ? '/assets/aistudio/logo_b0fcde7b.jpg' : '/public/assets/aistudio/logo_b0fcde7b.jpg'}
        alt="Logo Oficial Charales de Chapala"
        width={size}
        height={size}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`object-contain inline-block ${className}`}
        onError={() => {
          if (!triedAlt) {
            setTriedAlt(true);
          } else {
            setImgError(true);
          }
        }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Escudo Oficial Charales de Chapala"
    >
      {/* Outer Circle Ring */}
      <circle cx="60" cy="60" r="57" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="52" fill="#FFFFFF" stroke="#3B59A8" strokeWidth="3" />

      {/* Top Banner Text arc path */}
      <defs>
        <path
          id="charalesTopArc"
          d="M 18,60 A 42,42 0 0,1 102,60"
          fill="none"
        />
        <path
          id="charalesBottomArc"
          d="M 102,60 A 42,42 0 0,1 18,60"
          fill="none"
        />
        <linearGradient id="charalesBlueGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B59A8" />
          <stop offset="100%" stopColor="#253E7B" />
        </linearGradient>
        <linearGradient id="charalesRedGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E31B23" />
          <stop offset="100%" stopColor="#B31219" />
        </linearGradient>
      </defs>

      {/* Circular Text */}
      <text fill="#111111" fontSize="7.5" fontWeight="900" letterSpacing="1.2">
        <textPath href="#charalesTopArc" startOffset="50%" textAnchor="middle">
          CLUB DE FÚTBOL
        </textPath>
      </text>

      <text fill="#111111" fontSize="7" fontWeight="900" letterSpacing="0.8">
        <textPath href="#charalesBottomArc" startOffset="50%" textAnchor="middle">
          CHARALES DE CHAPALA
        </textPath>
      </text>

      {/* Central Shield Badge */}
      <g transform="translate(30, 30)">
        {/* Navy Blue circular disc */}
        <circle cx="30" cy="30" r="25" fill="url(#charalesBlueGrad)" />

        {/* Dynamic Red Swoosh / Wave */}
        <path
          d="M 10 32 C 16 46 44 48 52 34 C 54 28 50 20 44 20 C 34 20 22 24 10 32 Z"
          fill="url(#charalesRedGrad)"
        />

        {/* Dynamic Charal Fish (Curved Body with Tail) */}
        <path
          d="M 11 18 C 17 9 37 8 47 17 C 52 22 50 29 44 34 C 38 39 27 41 21 35 C 17 31 18 26 23 24 C 29 22 36 26 38 29 C 38 23 34 18 26 17 C 19 16 14 19 11 23 Z"
          fill="#FFFFFF"
          stroke="#111111"
          strokeWidth="1.2"
        />

        {/* Fish Eye */}
        <circle cx="16" cy="18" r="1.5" fill="#111111" />
        <circle cx="15.5" cy="17.5" r="0.5" fill="#FFFFFF" />

        {/* Classic Soccer Ball in foreground */}
        <g transform="translate(32, 28)">
          <circle cx="10" cy="10" r="8" fill="#FFFFFF" stroke="#111111" strokeWidth="1.2" />
          <polygon points="10,6 13,8 12,12 8,12 7,8" fill="#111111" />
          <line x1="10" y1="6" x2="10" y2="2" stroke="#111111" strokeWidth="0.9" />
          <line x1="13" y1="8" x2="17" y2="7" stroke="#111111" strokeWidth="0.9" />
          <line x1="12" y1="12" x2="15" y2="16" stroke="#111111" strokeWidth="0.9" />
          <line x1="8" y1="12" x2="5" y2="16" stroke="#111111" strokeWidth="0.9" />
          <line x1="7" y1="8" x2="3" y2="7" stroke="#111111" strokeWidth="0.9" />
        </g>
      </g>

      {/* Decorative Star Accents */}
      <polygon points="17,58 19,54 21,58 16,55 22,55" fill="#E31B23" />
      <polygon points="103,58 105,54 107,58 102,55 108,55" fill="#E31B23" />
    </svg>
  );
};

export default CharalesLogo;
