import React from 'react';

export const EmptyStateGraphic = ({ 
  message , 
  submessage,
  gradientStart = '#667eea', 
  gradientEnd = '#764ba2' 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '3rem 1rem',
      textAlign: 'center'
    }}>
      {/* Empty State SVG */}
      <svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: '1.5rem' }}
      >
        <defs>
          {/* Main gradient for primary elements */}
          <linearGradient id="horaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} stopOpacity="1" />
            <stop offset="100%" stopColor={gradientEnd} stopOpacity="1" />
          </linearGradient>
          
          {/* Lighter gradient for background elements */}
          <linearGradient id="horaGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} stopOpacity="0.1" />
            <stop offset="100%" stopColor={gradientEnd} stopOpacity="0.15" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background circle with gradient */}
        <circle cx="140" cy="140" r="120" fill="url(#horaGradientLight)" />

        {/* Floating elements (representing empty state) */}
        <g opacity="0.6">
          {/* Document icon outline */}
          <rect x="85" y="70" width="70" height="90" rx="6" 
                stroke="url(#horaGradient)" strokeWidth="3" fill="none" />
          <line x1="100" y1="90" x2="140" y2="90" 
                stroke="url(#horaGradient)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="100" y1="105" x2="135" y2="105" 
                stroke="url(#horaGradient)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="100" y1="120" x2="130" y2="120" 
                stroke="url(#horaGradient)" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Central floating element with glow */}
        <g filter="url(#glow)">
          <circle cx="140" cy="140" r="35" fill="url(#horaGradient)" opacity="0.2" />
          <path d="M140 120 L140 160 M120 140 L160 140" 
                stroke="url(#horaGradient)" 
                strokeWidth="4" 
                strokeLinecap="round" />
        </g>

        {/* Decorative dots */}
        <circle cx="75" cy="140" r="6" fill="url(#horaGradient)" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="205" cy="140" r="6" fill="url(#horaGradient)" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="75" r="6" fill="url(#horaGradient)" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="205" r="6" fill="url(#horaGradient)" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Floating particles */}
        <circle cx="180" cy="100" r="4" fill="url(#horaGradient)" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -10; 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="100" cy="180" r="4" fill="url(#horaGradient)" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 10; 0 0"
            dur="3s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Empty State Text */}
      <div style={{
        maxWidth: '400px'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '0.5rem',
          background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {message}
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#718096',
          margin: 0
        }}>
          {submessage}
        </p>
      </div>
    </div>
  );
};

