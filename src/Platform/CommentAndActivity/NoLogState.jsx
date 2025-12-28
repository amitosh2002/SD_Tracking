import React from 'react';

const NoLogsEmptyState = ({ 
  title = "No Activity Logs Yet",
  message = "Start working on your projects and your activity will appear here",
  showAction = true,
  onActionClick = null,
  actionText = "Get Started"
}) => {
  return (
    <div style={styles.container}>
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        {/* Background Circle */}
        <circle cx="120" cy="120" r="100" fill="#F3F4F6" opacity="0.5">
          <animate
            attributeName="r"
            values="100;105;100"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Document/Log Icon Base */}
        <rect
          x="70"
          y="50"
          width="100"
          height="130"
          rx="8"
          fill="white"
          stroke="#E5E7EB"
          strokeWidth="2"
        />

        {/* Document Lines */}
        <line x1="85" y1="70" x2="155" y2="70" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round">
          <animate
            attributeName="x2"
            values="155;145;155"
            dur="2s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="85" y1="85" x2="140" y2="85" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round">
          <animate
            attributeName="x2"
            values="140;130;140"
            dur="2s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="85" y1="100" x2="150" y2="100" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round">
          <animate
            attributeName="x2"
            values="150;140;150"
            dur="2s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </line>

        {/* Empty Box in Center */}
        <rect
          x="85"
          y="120"
          width="70"
          height="45"
          rx="6"
          fill="#F9FAFB"
          stroke="#E5E7EB"
          strokeWidth="2"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;8;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Hour Symbol (for Hora) */}
        <g transform="translate(120, 142)">
          {/* Clock Face */}
          <circle cx="0" cy="0" r="18" fill="#667eea" opacity="0.1" />
          <circle cx="0" cy="0" r="15" fill="none" stroke="#667eea" strokeWidth="2" />
          
          {/* Clock Hands */}
          <line x1="0" y1="0" x2="0" y2="-8" stroke="#667eea" strokeWidth="2" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="4s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="0" y1="0" x2="6" y2="0" stroke="#667eea" strokeWidth="2" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </line>
        </g>

        {/* Floating Particles */}
        <circle cx="50" cy="80" r="3" fill="#667eea" opacity="0.4">
          <animate
            attributeName="cy"
            values="80;70;80"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="190" cy="100" r="4" fill="#764ba2" opacity="0.3">
          <animate
            attributeName="cy"
            values="100;90;100"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="150" r="2.5" fill="#667eea" opacity="0.5">
          <animate
            attributeName="cy"
            values="150;140;150"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="180" cy="160" r="3.5" fill="#764ba2" opacity="0.4">
          <animate
            attributeName="cy"
            values="160;150;160"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Magnifying Glass (searching for logs) */}
        <g transform="translate(160, 160)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="#9CA3AF" strokeWidth="2.5" />
          <line x1="8" y1="8" x2="18" y2="18" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="160 160; 165 165; 160 160"
            dur="3s"
            repeatCount="indefinite"
          />
        </g>
      </svg>

      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
        {showAction && onActionClick && (
          <button style={styles.button} onClick={onActionClick}>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    textAlign: 'center',
    minHeight: '400px',
  },
  svg: {
    marginBottom: '2rem',
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))',
  },
  content: {
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  message: {
    margin: '0 0 1.5rem 0',
    fontSize: '1rem',
    color: '#6B7280',
    lineHeight: '1.6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)',
  },
};

export default NoLogsEmptyState;