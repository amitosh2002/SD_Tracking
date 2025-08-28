import { useEffect, useState, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./styles/dropDown.scss";

export const DropDownV1 = ({
  ticketTypes = [
    "ARCH", "BUG", "FEATURE", "TASK", "STORY", "EPIC", "IMPROVEMENT", 
    "SUBTASK", "TEST", "DOCUMENTATION", "LIVEOPS", "PLAT"
  ],
  defaultType = "",
  onChange,
  label ,
  disabled = false,
  className = "",
  required 
}) => {
const [ticketType, setTicketType] = useState(() => {
    if (defaultType) return defaultType;
    return ticketTypes[0];
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Remove the problematic useEffect that was overriding state changes
  useEffect(() => {
    // Only set initial value, don't override user selections
    if (defaultType && defaultType !== ticketType) {
      setTicketType(defaultType);
    }
  }, [defaultType,ticketType]); 
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (value) => {
    console.log("Selecting:", value); // Debug log
    setTicketType(value);
    setIsOpen(false);
    console.log("Selected ticket type:", value);
    if (onChange) onChange(value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`modern-dropdown ${className}`} ref={dropdownRef}>
   

       {  label && <label htmlFor="dropdown-trigger" className="dropdown-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>}
      
      <div 
        className={`dropdown-trigger ${isOpen ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={toggleDropdown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        <span className={`dropdown-text ${!ticketType ? 'placeholder' : ''}`}>
          {ticketType }
        </span>
        <ChevronDown 
          size={20} 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-options" role="listbox">
          {ticketTypes.map((type) => (
            <div
              key={type}
              className={`dropdown-option ${ticketType === type ? 'selected' : ''}`}
              onClick={() => handleOptionClick(type)}
              role="option"
              aria-selected={ticketType === type}
            >
              <span>{type}</span>
              <Check size={16} className="check-icon" />
            </div>
          ))}
        </div>
      </div>

      {/* {ticketType  && (
        <div className="selected-display">
          Selected: <span className="selected-value">{ticketType}</span>
        </div>
      )} */}
    </div>
  );
};