import React from 'react';

interface EmblemProps {
  size?: number;
  className?: string;
  variant?: 'color' | 'white';
}

export const SchoolEmblem: React.FC<EmblemProps> = ({ size = 48, className = '', variant = 'color' }) => {
  const isWhite = variant === 'white';
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="School Official Crest"
    >
      {/* Outer concentric rings */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke={isWhite ? '#ffffff' : '#0369a1'}
        strokeWidth="2.5"
        strokeDasharray="4 2"
      />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill={isWhite ? 'rgba(255,255,255,0.1)' : '#f8fafc'}
        stroke={isWhite ? '#ffffff' : '#0f766e'}
        strokeWidth="2"
      />

      {/* Ribbon / Arch for Bihar School Emblem styling */}
      <path
        d="M 20,50 A 30,30 0 0,1 80,50"
        fill="none"
        stroke={isWhite ? 'rgba(255,255,255,0.6)' : '#0284c7'}
        strokeWidth="1.5"
      />

      {/* Sun / Rays of Wisdom in upper half */}
      <g stroke={isWhite ? '#fde047' : '#d97706'} strokeWidth="1.5" strokeLinecap="round">
        <line x1="50" y1="20" x2="50" y2="15" />
        <line x1="40" y1="24" x2="36" y2="20" />
        <line x1="60" y1="24" x2="64" y2="20" />
        <line x1="33" y1="32" x2="28" y2="30" />
        <line x1="67" y1="32" x2="72" y2="30" />
      </g>
      <circle cx="50" cy="27" r="5" fill={isWhite ? '#fde047' : '#f59e0b'} />

      {/* Open Book of Knowledge in center */}
      <path
        d="M 50,56 C 44,52 35,52 30,55 L 30,72 C 35,69 44,69 50,73 C 56,69 65,69 70,72 L 70,55 C 65,52 56,52 50,56 Z"
        fill={isWhite ? '#ffffff' : '#ffffff'}
        stroke={isWhite ? '#0284c7' : '#0f766e'}
        strokeWidth="1.8"
      />
      {/* Book center spine line */}
      <line x1="50" y1="56" x2="50" y2="73" stroke={isWhite ? '#0284c7' : '#0f766e'} strokeWidth="1.5" />

      {/* Flaming Torch / Diya above book */}
      <path
        d="M 47,46 C 47,42 50,38 50,36 C 50,38 53,42 53,46 C 53,48 51.5,50 50,50 C 48.5,50 47,48 47,46 Z"
        fill={isWhite ? '#f97316' : '#ea580c'}
      />
      <rect
        x="48"
        y="50"
        width="4"
        height="3"
        fill={isWhite ? '#94a3b8' : '#64748b'}
        rx="0.5"
      />

      {/* Tricolor garland hint at base */}
      <path
        d="M 28,78 C 35,84 65,84 72,78"
        fill="none"
        stroke={isWhite ? '#22c55e' : '#16a34a'}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 33,83 C 40,87 60,87 67,83"
        fill="none"
        stroke={isWhite ? '#f97316' : '#ea580c'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
