// import React, { useState, useEffect } from 'react';
// import './styles/Snackbar.scss'; 
// // If using a library like react-icons:
// // import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

// const getPrefixIcon = (type) => {
//     switch (type) {
//         case 'success':
//             return '✅'; // Placeholder for Success Icon (e.g., <FaCheckCircle />)
//         case 'error':
//             return '❌';   // Placeholder for Error Icon (e.g., <FaTimesCircle />)
//         case 'warning':
//             return '⚠️'; // Placeholder for Warning Icon
//         case 'info':
//         default:
//             return 'ℹ️';  // Placeholder for Info Icon (e.g., <FaInfoCircle />)
//     }
// };

// const Snackbar = ({ message, type, duration = 3000, onClose }) => {
//     const [isVisible, setIsVisible] = useState(false);
//     const prefixIcon = getPrefixIcon(type);

//     // Effect to control visibility and auto-close timer
//     useEffect(() => {
//         if (message) {
//             setIsVisible(true);
//             const timer = setTimeout(() => {
//                 setIsVisible(false);
//                 // Wait for the CSS transition to fade out before truly closing
//                 setTimeout(() => {
//                     if (onClose) onClose(); 
//                 }, 300); // Match this duration to your CSS transition duration
//             }, duration);

//             return () => clearTimeout(timer); // Cleanup timer
//         }
//     }, [message, duration, onClose]);

//     if (!isVisible) return null;

//     const snackbarClass = `snackbar ${type} ${isVisible ? 'show' : 'hide'}`;

//     return (
//         <div className={snackbarClass}>
//             {/* 1. Prefix Icon (Type Indicator) */}
//             <div className="snackbar-prefix-icon">
//                 {prefixIcon}
//             </div>
            
//             {/* 2. Message Content */}
//             <p className="snackbar-message">{message}</p>
            
//             {/* 3. Suffix Icon (Close Button) */}
//             <button className="snackbar-close" onClick={() => setIsVisible(false)}>
//                 &times; 
//             </button>
//         </div>
//     );
// };

// export default Snackbar;
import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './styles/Snackbar.scss';

const getPrefixIcon = (type) => {
    switch (type) {
        case 'success':
            return <CheckCircle size={20} />;
        case 'error':
            return <XCircle size={20} />;
        case 'warning':
            return <AlertCircle size={20} />;
        case 'info':
        default:
            return <Info size={20} />;
    }
};

const Snackbar = ({ message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const prefixIcon = getPrefixIcon(type);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            setIsExiting(false);

            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, handleClose]);

    if (!isVisible) return null;

    const snackbarClass = `snackbar snackbar-${type} ${isExiting ? 'snackbar-exit' : 'snackbar-enter'}`;

    return (
        <div className={snackbarClass}>
            <div className="snackbar-content">
                <div className="snackbar-prefix-icon">
                    {prefixIcon}
                </div>
                
                <p className="snackbar-message">{message}</p>
                
                <button className="snackbar-close" onClick={handleClose} aria-label="Close">
                    <X size={18} />
                </button>
            </div>
            
            <div className="snackbar-progress" style={{ animationDuration: `${duration}ms` }}></div>
        </div>
    );
};

export default Snackbar;