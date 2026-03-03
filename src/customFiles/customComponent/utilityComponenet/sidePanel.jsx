import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import './styles/SidePanel.scss';

const SidePanel = ({ 
  isOpen, 
  onClose, 
  children,
  width = '570px',
  position = 'right',
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEscape]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <>
      {showOverlay && (
        <div 
          className={`side-panel-overlay ${isOpen ? 'active' : ''}`}
          onClick={handleOverlayClick}
        />
      )}
      
      <div 
        className={`side-panel ${position} ${isOpen ? 'active' : ''} ${className}`}
        style={{ maxWidth: width }}
      >
        {children}
      </div>
    </>
  );
};

// SidePanel.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   children: PropTypes.node.isRequired,
//   width: PropTypes.string,
//   position: PropTypes.oneOf(['left', 'right']),
//   showOverlay: PropTypes.bool,
//   closeOnOverlayClick: PropTypes.bool,
//   closeOnEscape: PropTypes.bool,
//   className: PropTypes.string,
// };

export default SidePanel;