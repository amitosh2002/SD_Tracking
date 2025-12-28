import React from 'react';
import './style/AnimatedEmptyState.scss';

const AnimatedEmptyState = ({ 
  icon = '📭',
  title = 'No Data Found',
  message = 'There is no data to display at the moment.',
  action,
  actionLabel = 'Take Action',
  variant = 'default' // default, minimal, illustration, floating
}) => {
  const renderVariant = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="aes-minimal">
            <div className="aes-minimal-icon">{icon}</div>
            <h3 className="aes-minimal-title">{title}</h3>
            <p className="aes-minimal-message">{message}</p>
            {action && (
              <button onClick={action} className="aes-minimal-action">
                {actionLabel}
              </button>
            )}
          </div>
        );

      case 'illustration':
        return (
          <div className="aes-illustration">
            <div className="aes-illustration-wrapper">
              <div className="aes-illustration-bg">
                <div className="aes-circle aes-circle-1"></div>
                <div className="aes-circle aes-circle-2"></div>
                <div className="aes-circle aes-circle-3"></div>
              </div>
              <div className="aes-illustration-icon">{icon}</div>
            </div>
            <h3 className="aes-illustration-title">{title}</h3>
            <p className="aes-illustration-message">{message}</p>
            {action && (
              <button onClick={action} className="aes-illustration-action">
                {actionLabel}
              </button>
            )}
          </div>
        );

      case 'floating':
        return (
          <div className="aes-floating">
            <div className="aes-floating-container">
              <div className="aes-floating-icon">
                <span className="aes-floating-emoji">{icon}</span>
                <div className="aes-float-particle aes-particle-1"></div>
                <div className="aes-float-particle aes-particle-2"></div>
                <div className="aes-float-particle aes-particle-3"></div>
                <div className="aes-float-particle aes-particle-4"></div>
              </div>
              <h3 className="aes-floating-title">{title}</h3>
              <p className="aes-floating-message">{message}</p>
              {action && (
                <button onClick={action} className="aes-floating-action">
                  {actionLabel}
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="aes-default">
            <div className="aes-icon-wrapper">
              <div className="aes-icon-circle aes-pulse"></div>
              <div className="aes-icon-circle aes-pulse-delay"></div>
              <div className="aes-icon">{icon}</div>
            </div>
            <h3 className="aes-title">{title}</h3>
            <p className="aes-message">{message}</p>
            {action && (
              <button onClick={action} className="aes-action">
                {actionLabel}
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="animated-empty-state">
      {renderVariant()}
    </div>
  );
};

// Demo Component
const Demo = () => {
  const handleAction = () => {
    alert('Action clicked!');
  };

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem', color: '#111827' }}>
        Animated Empty State Variants
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Default Variant
          </h3>
          <AnimatedEmptyState
            icon="📦"
            title="No Items Found"
            message="Start by adding your first item to see it appear here."
            action={handleAction}
            actionLabel="Add Item"
            variant="default"
          />
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Minimal Variant
          </h3>
          <AnimatedEmptyState
            icon="🔍"
            title="No Results"
            message="We couldn't find what you're looking for. Try adjusting your search."
            action={handleAction}
            actionLabel="Clear Search"
            variant="minimal"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Illustration Variant
          </h3>
          <AnimatedEmptyState
            icon="⏱️"
            title="No Time Logs"
            message="You haven't logged any time yet. Start tracking your work to see insights here."
            action={handleAction}
            actionLabel="Log Time"
            variant="illustration"
          />
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Floating Variant
          </h3>
          <AnimatedEmptyState
            icon="🎯"
            title="No Projects"
            message="Create your first project to get started with task management."
            action={handleAction}
            actionLabel="Create Project"
            variant="floating"
          />
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, color: '#111827' }}>Usage Example</h2>
        <pre style={{ 
          background: '#1f2937', 
          color: '#10b981', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          overflow: 'auto',
          fontSize: '0.875rem',
          lineHeight: '1.6'
        }}>
{`<AnimatedEmptyState
  icon="📭"
  title="No Messages"
  message="Your inbox is empty. You're all caught up!"
  action={() => console.log('Action clicked')}
  actionLabel="Compose"
  variant="default" // default | minimal | illustration | floating
/>`}
        </pre>
      </div>
    </div>
  );
};

export default AnimatedEmptyState;