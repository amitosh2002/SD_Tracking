import { useEffect, useState, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./styles/dropDown.scss";

export const DropDownV1 = ({
  dataTypes = [
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
const [dataType, setdataType] = useState(() => {
    if (defaultType) return defaultType;
    return dataTypes[0];
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Remove the problematic useEffect that was overriding state changes
  useEffect(() => {
    // Only set initial value, don't override user selections
    if (defaultType && defaultType !== dataType) {
      setdataType(defaultType);
    }
  }, [defaultType,dataType]); 
  
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
    setdataType(value);
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
        <span className={`dropdown-text ${!dataType ? 'placeholder' : ''}`}>
          {dataType }
        </span>
        <ChevronDown 
          size={20} 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-options" role="listbox">
          { Array.isArray(dataType) && dataTypes?.map((type,id) => (
            <div
              key={id}
              className={`dropdown-option ${dataType === type ? 'selected' : ''}`}
              onClick={() => handleOptionClick(type)}
              role="option"
              aria-selected={dataType === type}
            >
              <span>{type}</span>
              <Check size={16} className="check-icon" />
            </div>
          ))}
        </div>
      </div>

      {/* {dataType  && (
        <div className="selected-display">
          Selected: <span className="selected-value">{dataType}</span>
        </div>
      )} */}
    </div>
  );
};

export const DropDownV2 = ({    
  defaultType = "",   
  onChange,   
  label,   
  disabled = false,   
  className = "",   
  required,   
  data 
}) => { 
  const [dataType, setdataType] = useState(() => {     
    if (defaultType) return defaultType;     
    return data[0];   
  });   


  const [isOpen, setIsOpen] = useState(false);   
  const dropdownRef = useRef(null);    

  useEffect(() => {     
    if (defaultType && defaultType !== dataType) {       
      setdataType(defaultType);     
    }   
  }, [defaultType]);       

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
    console.log("Selecting:", value);     
    setdataType(value);     
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
      {label && (
        <label htmlFor="dropdown-trigger" className="dropdown-label">         
          {label}         
          {required && <span className="required-asterisk">*</span>}       
        </label>
      )}              

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
        <span className={`dropdown-text ${!dataType ? 'placeholder' : ''}`}>            
          {dataType?.icon && <img src={dataType.icon} alt="" style={{width:"25px"}} />}           
          {dataType?.type || dataType}         
        </span>         
        <ChevronDown            
          size={20}            
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}         
        />       
      </div>        

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>         
        <div className="dropdown-options" role="listbox">           
          {Array.isArray(data) && data?.map((type, id) => (             
            <div               
              key={id}               
              className={`dropdown-option ${dataType === type ? 'selected' : ''}`}               
              onClick={() => handleOptionClick(type)}               
              role="option"               
              aria-selected={dataType === type}             
            >               
              {type.icon && <img src={type.icon} alt="" style={{width:"25px"}} />}               
              <span>{type.type}</span>               
              <Check size={16} className="check-icon" />             
            </div>           
          ))}         
        </div>       
      </div>     
    </div>   
  ); 
};

export const DropDownForTicketStatus = ({
  ticketTypes,
  defaultType = "",
  onChange, // Keep this for backward compatibility
  onStatusChange, // New prop for status updates
  label,
  disabled = false,
  className = "",
  required 
}) => {
  // Define workflow rules - what statuses can follow each current status
  const statusWorkflow = {
    "OPEN": ["IN_PROGRESS", "IN_REVIEW", "ON_HOLD"],
    "IN_PROGRESS": ["IN_REVIEW", "ON_HOLD", "OPEN"],
    "IN_REVIEW": ["Dev Testing", "REJECTED", "ON_HOLD"],
    "Dev Testing": ["RESOLVED", "IN_REVIEW", "REJECTED"],
    "RESOLVED": ["M1 TESTING COMPLETED", "REOPENED"],
    "M1 TESTING COMPLETED": ["M2 TESTING COMPLETED", "REOPENED"],
    "M2 TESTING COMPLETED": ["CLOSED", "REOPENED"],
    "REJECTED": ["OPEN", "IN_PROGRESS"],
    "ON_HOLD": ["OPEN", "IN_PROGRESS"],
    "REOPENED": ["IN_PROGRESS", "IN_REVIEW"],
    "CLOSED": ["REOPENED"],
  };

  // Get allowed next statuses based on current status
  const getAllowedStatuses = (currentStatus) => {
    if (!currentStatus || !statusWorkflow[currentStatus]) {
      return ticketTypes;
    }
    
    const allowedNext = statusWorkflow[currentStatus];
    return [currentStatus, ...allowedNext].filter((status, index, self) => 
      self.indexOf(status) === index && ticketTypes.includes(status)
    );
  };

  const [dataType, setdataType] = useState(() => {
    if (defaultType) return defaultType;
    return ticketTypes.length > 0 ? ticketTypes[0] : "";
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = getAllowedStatuses(dataType);

  useEffect(() => {
    if (defaultType && defaultType !== dataType) {
      setdataType(defaultType);
    }
  }, [defaultType,dataType]);
  
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
    console.log("Status changing from:", dataType, "to:", value);
    const previousStatus = dataType;
    
    setdataType(value);
    setIsOpen(false);
    
    // Call the new onStatusChange prop with more context
    if (onStatusChange) {
      onStatusChange({
        newStatus: value,
        previousStatus: previousStatus,
        timestamp: new Date().toISOString()
      });
    }
    
    // Keep backward compatibility with old onChange prop
    if (onChange) onChange(value);
    
    console.log("Status updated to:", value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`modern-dropdown ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor="dropdown-trigger" className="dropdown-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
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
        <span className={`dropdown-text ${!dataType ? 'placeholder' : ''}`}>
          {dataType || "Select option"}
        </span>
        <ChevronDown 
          size={20} 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-options" role="listbox">
          {Array.isArray(filteredOptions) && filteredOptions.map((type, id) => (
            <div
              key={id}
              className={`dropdown-option ${dataType === type ? 'selected' : ''}`}
              onClick={() => handleOptionClick(type)}
              role="option"
              aria-selected={dataType === type}
            >
              <span>{type}</span>
              <Check size={16} className="check-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};