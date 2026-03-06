import React from 'react';
import { X } from 'lucide-react';
import './StatusSelectPopup.scss';

const StatusSelectPopup = ({ isOpen, onClose, statusList, ticketIdentifier, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="status-select-overlay">
      <div className="status-select-content">
        <div className="popup-header">
          <h3>Update Status</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="popup-body">
          <p className="status-select-desc">
            The target column allows multiple statuses. Help us be explicit by picking the exact status for <strong className="ticket-id-emphasis">{ticketIdentifier}</strong>:
          </p>
          <div className="status-options-grid">
            {statusList.map((status, index) => (
              <button 
                key={index} 
                className="status-option-btn"
                onClick={() => onSelect(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSelectPopup;
