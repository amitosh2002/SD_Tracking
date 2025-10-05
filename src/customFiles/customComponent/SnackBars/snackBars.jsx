import React, { useState, useEffect } from 'react';
import './styles/Snackbar.scss'; 
// If using a library like react-icons:
// import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const getPrefixIcon = (type) => {
    switch (type) {
        case 'success':
            return '✅'; // Placeholder for Success Icon (e.g., <FaCheckCircle />)
        case 'error':
            return '❌';   // Placeholder for Error Icon (e.g., <FaTimesCircle />)
        case 'warning':
            return '⚠️'; // Placeholder for Warning Icon
        case 'info':
        default:
            return 'ℹ️';  // Placeholder for Info Icon (e.g., <FaInfoCircle />)
    }
};

const Snackbar = ({ message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const prefixIcon = getPrefixIcon(type);

    // Effect to control visibility and auto-close timer
    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Wait for the CSS transition to fade out before truly closing
                setTimeout(() => {
                    if (onClose) onClose(); 
                }, 300); // Match this duration to your CSS transition duration
            }, duration);

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [message, duration, onClose]);

    if (!isVisible) return null;

    const snackbarClass = `snackbar ${type} ${isVisible ? 'show' : 'hide'}`;

    return (
        <div className={snackbarClass}>
            {/* 1. Prefix Icon (Type Indicator) */}
            <div className="snackbar-prefix-icon">
                {prefixIcon}
            </div>
            
            {/* 2. Message Content */}
            <p className="snackbar-message">{message}</p>
            
            {/* 3. Suffix Icon (Close Button) */}
            <button className="snackbar-close" onClick={() => setIsVisible(false)}>
                &times; 
            </button>
        </div>
    );
};

export default Snackbar;