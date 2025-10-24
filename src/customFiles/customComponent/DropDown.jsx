// import { useEffect, useState, useRef } from "react";
// import { ChevronDown, Check } from "lucide-react";
// import "./styles/dropDown.scss";

// export const DropDownV1 = ({
//   dataTypes = [
//     "ARCH", "BUG", "FEATURE", "TASK", "STORY", "EPIC", "IMPROVEMENT", 
//     "SUBTASK", "TEST", "DOCUMENTATION", "LIVEOPS", "PLAT"
//   ],
//   defaultType = "",
//   onChange,
//   label ,
//   disabled = false,
//   className = "",
//   required 
// }) => {
// const [dataType, setdataType] = useState(() => {
//     if (defaultType) return defaultType;
//     return dataTypes[0];
//   });
  
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Remove the problematic useEffect that was overriding state changes
//   useEffect(() => {
//     // Only set initial value, don't override user selections
//     if (defaultType && defaultType !== dataType) {
//       setdataType(defaultType);
//     }
//   }, [defaultType,dataType]); 
  
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleOptionClick = (value) => {
//     console.log("Selecting:", value); // Debug log
//     setdataType(value);
//     setIsOpen(false);
//     console.log("Selected ticket type:", value);
//     if (onChange) onChange(value);
//   };

//   const toggleDropdown = () => {
//     if (!disabled) {
//       setIsOpen(!isOpen);
//     }
//   };

//   return (
//     <div className={`modern-dropdown ${className}`} ref={dropdownRef}>
   

//        {  label && <label htmlFor="dropdown-trigger" className="dropdown-label">
//         {label}
//         {required && <span className="required-asterisk">*</span>}
//       </label>}
      
//       <div 
//         className={`dropdown-trigger ${isOpen ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
//         onClick={toggleDropdown}
//         role="combobox"
//         aria-expanded={isOpen}
//         aria-haspopup="listbox"
//         tabIndex={disabled ? -1 : 0}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' || e.key === ' ') {
//             e.preventDefault();
//             toggleDropdown();
//           }
//         }}
//       >
//         <span className={`dropdown-text ${!dataType ? 'placeholder' : ''}`}>
//           {dataType }
//         </span>
//         <ChevronDown 
//           size={20} 
//           className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
//         />
//       </div>

//       <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
//         <div className="dropdown-options" role="listbox">
//           { Array.isArray(dataType) && dataTypes?.map((type,id) => (
//             <div
//               key={id}
//               className={`dropdown-option ${dataType === type ? 'selected' : ''}`}
//               onClick={() => handleOptionClick(type)}
//               role="option"
//               aria-selected={dataType === type}
//             >
//               <span>{type}</span>
//               <Check size={16} className="check-icon" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* {dataType  && (
//         <div className="selected-display">
//           Selected: <span className="selected-value">{dataType}</span>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export const DropDownV2 = ({    
//   defaultType = "",   
//   onChange,   
//   label,   
//   disabled = false,   
//   className = "",   
//   required,   
//   data 
// }) => { 
//   const [dataType, setdataType] = useState(() => {     
//     if (defaultType) return defaultType;     
//     return data[0]?? "";   
//   });   


//   const [isOpen, setIsOpen] = useState(false);   
//   const dropdownRef = useRef(null);    

//   useEffect(() => {     
//     if (defaultType && defaultType !== dataType) {       
//       setdataType(defaultType);     
//     }   
//   }, [defaultType]);       

//   useEffect(() => {     
//     const handleClickOutside = (event) => {       
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {         
//         setIsOpen(false);       
//       }     
//     };      

//     document.addEventListener('mousedown', handleClickOutside);     
//     return () => document.removeEventListener('mousedown', handleClickOutside);   
//   }, []);    

//   const handleOptionClick = (value) => {     
//     console.log("Selecting:", value);     
//     setdataType(value);     
//     setIsOpen(false);     
//     console.log("Selected ticket type:", value);     
//     if (onChange) onChange(value);   
//   };    

//   const toggleDropdown = () => {     
//     if (!disabled) {       
//       setIsOpen(!isOpen);     
//     }   
//   };    

//   return (     
//     <div className={`modern-dropdown ${className}`} ref={dropdownRef}>             
//       {label && (
//         <label htmlFor="dropdown-trigger" className="dropdown-label">         
//           {label}         
//           {required && <span className="required-asterisk">*</span>}       
//         </label>
//       )}              

//       <div          
//         className={`dropdown-trigger ${isOpen ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}         
//         onClick={toggleDropdown}         
//         role="combobox"         
//         aria-expanded={isOpen}         
//         aria-haspopup="listbox"         
//         tabIndex={disabled ? -1 : 0}         
//         onKeyDown={(e) => {           
//           if (e.key === 'Enter' || e.key === ' ') {             
//             e.preventDefault();             
//             toggleDropdown();           
//           }         
//         }}       
//       >         
//         <span className={`dropdown-text ${!dataType ? 'placeholder' : ''}`}>            
//           {dataType?.icon && <img src={dataType.icon} alt="" style={{width:"25px"}} />}           
//           {dataType?.type || dataType}         
//         </span>         
//         <ChevronDown            
//           size={20}            
//           className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}         
//         />       
//       </div>        

//       <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>         
//         <div className="dropdown-options" role="listbox">           
//           {Array.isArray(data) && data?.map((type, id) => (             
//             <div               
//               key={id}               
//               className={`dropdown-option ${dataType === type ? 'selected' : ''}`}               
//               onClick={() => handleOptionClick(type)}               
//               role="option"               
//               aria-selected={dataType === type}             
//             >               
//               {type.icon && <img src={type.icon} alt="" style={{width:"25px"}} />}               
//               <span>{type.type}</span>               
//               <Check size={16} className="check-icon" />             
//             </div>           
//           ))}         
//         </div>       
//       </div>     
//     </div>   
//   ); 
// };

// export const DropDownForTicketStatus = ({
//   ticketTypes,
//   defaultType = "",
//   value = "", // Add value prop for controlled component
//   onChange, // Keep this for backward compatibility
//   onStatusChange, // New prop for status updates
//   label,
//   disabled = false,
//   className = "",
//   required,
//   ticketId // Add unique identifier for each dropdown
// }) => {
//   // Define workflow rules - what statuses can follow each current status
//   const statusWorkflow = {
//     "OPEN": ["IN_PROGRESS", "IN_REVIEW", "ON_HOLD"],
//     "IN_PROGRESS": ["IN_REVIEW", "ON_HOLD", "OPEN"],
//     "IN_REVIEW": ["DEV_TESTING", "REJECTED", "ON_HOLD"],
//     "DEV_TESTING": ["RESOLVED", "IN_REVIEW", "REJECTED"],
//     "RESOLVED": ["M1 TESTING COMPLETED", "REOPENED"],
//     "M1 TESTING COMPLETED": ["M2 TESTING COMPLETED", "REOPENED"],
//     "M2 TESTING COMPLETED": ["CLOSED", "REOPENED"],
//     "REJECTED": ["OPEN", "IN_PROGRESS"],
//     "ON_HOLD": ["OPEN", "IN_PROGRESS"],
//     "REOPENED": ["IN_PROGRESS", "IN_REVIEW"],
//     "CLOSED": ["REOPENED"],
//   };

//   // Get allowed next statuses based on current status
//   const getAllowedStatuses = (currentStatus) => {
//     if (!currentStatus || !statusWorkflow[currentStatus]) {
//       return ticketTypes;
//     }
    
//     const allowedNext = statusWorkflow[currentStatus];
//     return [currentStatus, ...allowedNext].filter((status, index, self) => 
//       self?.indexOf(status) === index && ticketTypes?.includes(status)
//     );
//   };

//   // Use a unique key for each dropdown instance to prevent state sharing
//   const uniqueKey = `dropdown-${ticketId || Math.random()}`;
  
//   // Use value prop if provided, otherwise fall back to defaultType or first option
//   const currentValue = value || defaultType || (ticketTypes && ticketTypes.length > 0 ? ticketTypes[0] : "");
  
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const filteredOptions = getAllowedStatuses(currentValue);
  
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleOptionClick = (value) => {
//     console.log("Status changing from:", currentValue, "to:", value);
//     const previousStatus = currentValue;
    
//     setIsOpen(false);
    
//     // Call the new onStatusChange prop with more context
//     if (onStatusChange) {
//       onStatusChange({
//         newStatus: value,
//         previousStatus: previousStatus,
//         timestamp: new Date().toISOString()
//       });
//     }
    
//     // Keep backward compatibility with old onChange prop
//     if (onChange) onChange(value);
    
//     console.log("Status updated to:", value);
//   };

//   const toggleDropdown = () => {
//     if (!disabled) {
//       setIsOpen(!isOpen);
//     }
//   };

//   return (
//     <div className={`modern-dropdown ${className}`} ref={dropdownRef} key={uniqueKey}>
//       {label && (
//         <label htmlFor="dropdown-trigger" className="dropdown-label">
//           {label}
//           {required && <span className="required-asterisk">*</span>}
//         </label>
//       )}
      
//       <div 
//         className={`dropdown-trigger ${isOpen ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
//         onClick={toggleDropdown}
//         role="combobox"
//         aria-expanded={isOpen}
//         aria-haspopup="listbox"
//         tabIndex={disabled ? -1 : 0}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' || e.key === ' ') {
//             e.preventDefault();
//             toggleDropdown();
//           }
//         }}
//       >
//         <span className={`dropdown-text ${!currentValue ? 'placeholder' : ''}`}>
//           {currentValue || "Select option"}
//         </span>
//         <ChevronDown 
//           size={20} 
//           className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
//         />
//       </div>

//       <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
//         <div className="dropdown-options" role="listbox">
//           {Array.isArray(filteredOptions) && filteredOptions.map((type, id) => (
//             <div
//               key={`${uniqueKey}-${id}`}
//               className={`dropdown-option ${currentValue === type ? 'selected' : ''}`}
//               onClick={() => handleOptionClick(type)}
//               role="option"
//               aria-selected={currentValue === type}
//             >
//               <span>{type}</span>
//               <Check size={16} className="check-icon" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useEffect, useState, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./styles/dropDown.scss";

export const DropDownV1 = ({
  dataTypes,
  defaultType = "",
  onChange,
  label,
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

  useEffect(() => {
    if (defaultType && defaultType !== dataType) {
      setdataType(defaultType);
    }
  }, [defaultType, dataType]); 
  
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
    setdataType(value);
    setIsOpen(false);
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
          {dataType}
        </span>
        <ChevronDown 
          size={20} 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-options" role="listbox">
          {Array.isArray(dataTypes) && dataTypes?.map((type, id) => (
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
export const DropDownV2 = ({
  defaultType = "",
  onChange,
  label,
  disabled = false,
  className = "",
  required,
  data = [],
}) => {
  const [selected, setSelected] = useState(() => {
    // If defaultType is provided, try to find a match
    if (defaultType) {
      if (Array.isArray(data)) {
        const matched = data.find(item => 
          (item.type === defaultType?.type) || 
          (item.value === defaultType?.value) ||
          (item === defaultType)
        );
        if (matched) return matched;
      }
      return defaultType;
    }
    
    // If no defaultType, use first item from data array if available
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    
    return null;
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Update selection when defaultType changes
    if (defaultType) {
      if (Array.isArray(data)) {
        const matched = data.find(item =>
          (item.type === defaultType?.type) ||
          (item.value === defaultType?.value) ||
          (item === defaultType)
        );
        if (matched) setSelected(matched);
      } else {
        setSelected(defaultType);
      }
    }
  }, [defaultType, data]);

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
    console.log("Selected value:", value);
    setSelected(value);
    setIsOpen(false);
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
        <span className={`dropdown-text ${!selected ? 'placeholder' : ''}`}>
          {selected?.icon && <img src={selected.icon} alt="" style={{width:"25px"}} />}
          {typeof selected === 'object' ? selected?.type || selected?.name : selected}
        </span>
        <ChevronDown
          size={20}
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-options" role="listbox">
          {Array.isArray(data) && data.map((option, id) => (
            <div
              key={id}
              className={`dropdown-option ${selected === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selected === option}
            >
              {option.icon && <img src={option.icon} alt="" style={{width:"25px"}} />}
              <span>{typeof option === 'object' ? option.type || option.name : option}</span>
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
  value = "",
  onChange,
  onStatusChange,
  label,
  disabled = false,
  className = "",
  required,
  ticketId
}) => {
  // Status color mapping
  const statusColors = {
    "OPEN": { bg: "#dbeafe", text: "#1e40af", border: "#3b82f6" },
    "IN_PROGRESS": { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
    "IN_REVIEW": { bg: "#e0e7ff", text: "#3730a3", border: "#6366f1" },
    "DEV_TESTING": { bg: "#ddd6fe", text: "#5b21b6", border: "#8b5cf6" },
    "RESOLVED": { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
    "M1 TESTING COMPLETED": { bg: "#ccfbf1", text: "#134e4a", border: "#14b8a6" },
    "M2 TESTING COMPLETED": { bg: "#a7f3d0", text: "#064e3b", border: "#059669" },
    "REJECTED": { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" },
    "ON_HOLD": { bg: "#f3e8ff", text: "#6b21a8", border: "#a855f7" },
    "REOPENED": { bg: "#fed7aa", text: "#9a3412", border: "#f97316" },
    "CLOSED": { bg: "#e5e7eb", text: "#374151", border: "#6b7280" },
  };

  const statusWorkflow = {
    "OPEN": ["IN_PROGRESS", "IN_REVIEW", "ON_HOLD"],
    "IN_PROGRESS": ["IN_REVIEW", "ON_HOLD", "OPEN"],
    "IN_REVIEW": ["DEV_TESTING", "REJECTED", "ON_HOLD"],
    "DEV_TESTING": ["RESOLVED", "IN_REVIEW", "REJECTED"],
    "RESOLVED": ["M1 TESTING COMPLETED", "REOPENED"],
    "M1 TESTING COMPLETED": ["M2 TESTING COMPLETED", "REOPENED"],
    "M2 TESTING COMPLETED": ["CLOSED", "REOPENED"],
    "REJECTED": ["OPEN", "IN_PROGRESS"],
    "ON_HOLD": ["OPEN", "IN_PROGRESS"],
    "REOPENED": ["IN_PROGRESS", "IN_REVIEW"],
    "CLOSED": ["REOPENED"],
  };

  const getAllowedStatuses = (currentStatus) => {
    if (!currentStatus || !statusWorkflow[currentStatus]) {
      return ticketTypes;
    }
    
    const allowedNext = statusWorkflow[currentStatus];
    return [currentStatus, ...allowedNext].filter((status, index, self) => 
      self?.indexOf(status) === index && ticketTypes?.includes(status)
    );
  };

  const uniqueKey = `dropdown-${ticketId || Math.random()}`;
  const currentValue = value || defaultType || (ticketTypes && ticketTypes.length > 0 ? ticketTypes[0] : "");
  const currentColors = statusColors[currentValue] || statusColors["OPEN"];
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredOptions = getAllowedStatuses(currentValue);
  
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
    const previousStatus = currentValue;
    setIsOpen(false);
    
    if (onStatusChange) {
      onStatusChange({
        newStatus: value,
        previousStatus: previousStatus,
        timestamp: new Date().toISOString()
      });
    }
    
    if (onChange) onChange(value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`modern-dropdown status-dropdown ${className}`} ref={dropdownRef} key={uniqueKey}>
      {label && (
        <label htmlFor="dropdown-trigger" className="dropdown-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div 
        className={`dropdown-trigger status-trigger ${isOpen ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={toggleDropdown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        style={{
          backgroundColor: currentColors.bg,
          color: currentColors.text,
          borderColor: currentColors.border
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        <span className="status-dot" style={{ backgroundColor: currentColors.border }}></span>
        <span className={`dropdown-text ${!currentValue ? 'placeholder' : ''}`}>
          {currentValue || "Select status"}
        </span>
        <ChevronDown 
          size={18} 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-options" role="listbox">
          {Array.isArray(filteredOptions) && filteredOptions.map((type, id) => {
            const optionColors = statusColors[type] || statusColors["OPEN"];
            return (
              <div
                key={`${uniqueKey}-${id}`}
                className={`dropdown-option status-option ${currentValue === type ? 'selected' : ''}`}
                onClick={() => handleOptionClick(type)}
                role="option"
                aria-selected={currentValue === type}
                style={{
                  '--hover-bg': optionColors.bg,
                  '--hover-color': optionColors.text
                }}
              >
                <span className="status-dot-small" style={{ backgroundColor: optionColors.border }}></span>
                <span>{type}</span>
                <Check size={16} className="check-icon" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};