import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown, Check ,Loader2, DotIcon} from "lucide-react";
import "./styles/dropDown.scss";
import { useMemo } from "react";
import {  Search } from "lucide-react";

export const DropDownV1 = ({
  dataTypes = [],
  defaultType = "",
  onChange,
  label,
  disabled = false,
  className = "",
  required,
  searchable = true,
  accentColor = "#a855f7", // NEW
  placeholder = "Select option"
}) => {
  const [dataType, setDataType] = useState(defaultType || null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (defaultType) setDataType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return dataTypes;
    return dataTypes.filter((item) =>
      (item.label || item)?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, dataTypes]);

  const handleOptionClick = (value) => {
    setDataType(value);
    setIsOpen(false);
    setSearch("");
    onChange?.(value);
  };

  return (
    <div
      className={`modern-dropdown ${className}`}
      ref={dropdownRef}
      style={{ "--accent-color": accentColor }}
      
    >
      {label && (
        <label className="dropdown-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div
        className={`dropdown-trigger ${isOpen ? "focused" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        // style={{backgroundColor: accentColor}}
        style={accentColor &&{
          backgroundColor: `${accentColor}1A`,   // light glass bg
          borderColor: accentColor,
          boxShadow: isOpen
            ? `0 0 0 3px ${accentColor}33`
            : `0 1px 3px ${accentColor}22`
        }}
      >
        <span className={`dropdown-text ${!dataType ? "placeholder" : ""}`} >
         <DotIcon color={accentColor} size={0}/> {dataType?.label || dataType || placeholder}
        </span>
        <ChevronDown size={18} className={`dropdown-icon ${isOpen ? "rotated" : ""}`} />
      </div>

      <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
        {searchable && (
          <div className="dropdown-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        )}

        <div className="dropdown-options">
          {filteredOptions.length === 0 && (
            <div className="dropdown-empty">No results found</div>
          )}

          {filteredOptions.map((item, idx) => {
            const value = item?.value ?? item;
            const label = item?.label ?? item;
            const color = item?.color ?? accentColor;

            return (
              <div
                key={idx}
                className={`dropdown-option ${
                  dataType?.value === value || dataType === value ? "selected" : ""
                }`}

                style={{ "--option-color": color }}
                onClick={() => handleOptionClick(item)}
              >
                 <span>{label}</span>
                <Check size={14} className="check-icon" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// import {  useMemo, useRef, useState } from "react";

export const DropDownV2 = ({
  data = [],
  defaultType = "",        // backend id/value to pre-select
  onChange,
  label,
  disabled = false,
  className = "",
  required = false,
  searchable = true,
  searchPlaceholder = "Search...",
  placeholder = "Select option",  // placeholder text shown when nothing selected
}) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  /* ---------- helpers ---------- */

  const getLabel = (item) => {
    if (typeof item === 'string') return item;
    return item?.type || item?.name || item?.label || "";
  };

  const isSameOption = (a, b) => {
    if (!a || !b) return false;
    // Handle string comparison
    if (typeof a === 'string' && typeof b === 'string') return a === b;
    if (typeof a === 'string' || typeof b === 'string') {
      const aVal = typeof a === 'string' ? a : (a?.value || a?._id || a?.projectId || a?.type || a?.suffix || a?.id);
      const bVal = typeof b === 'string' ? b : (b?.value || b?._id || b?.projectId || b?.type || b?.suffix || b?.id);
      return aVal === bVal;
    }
    
    // Match by various identifiers
    return (
      (a?.value !== undefined && a?.value === b?.value) ||
      (a?._id !== undefined && a?._id === b?._id) ||
      (a?.projectId !== undefined && a?.projectId === b?.projectId) ||
      (a?.type !== undefined && a?.type === b?.type) ||
      (a?.suffix !== undefined && a?.suffix === b?.suffix) ||
      (a?.id !== undefined && a?.id === b?.id) ||
      (a?.name !== undefined && a?.name === b?.name) ||
      (a?.label !== undefined && a?.label === b?.label)
    );
  };

  const findMatch = useCallback((value, dataArray) => {
    if (!value || !dataArray || dataArray.length === 0) return null;
    // If value is an object, try to match it directly
    if (typeof value === 'object') {
      return dataArray.find((item) => isSameOption(item, value));
    }
    // If value is a string/primitive, match against identifiers
    return dataArray.find(
      (item) =>
        item === value ||
        item?.value === value ||
        item?._id === value ||
        item?.projectId === value ||
        item?.type === value ||
        item?.suffix === value ||
        item?.id === value ||
        item?.name === value ||
        item?.label === value
    );
  }, []);

  /* ---------- sync defaultType / backend ---------- */
  // Only sync from defaultType prop - don't reset user selections
  const prevDefaultType = useRef(defaultType);
  
  useEffect(() => {
    // Only update if defaultType actually changed (not just data)
    if (defaultType !== prevDefaultType.current) {
      prevDefaultType.current = defaultType;
      
      if (defaultType && data && data.length > 0) {
        const match = findMatch(defaultType, data);
        if (match) {
          setSelected(match);
        }
      } else if (!defaultType) {
        setSelected(null);
      }
    } else if (defaultType && data && data.length > 0 && !selected) {
      // If defaultType exists but we haven't matched yet (data just loaded)
      const match = findMatch(defaultType, data);
      if (match) {
        setSelected(match);
      }
    }
  }, [defaultType, data, findMatch, selected]);

  /* ---------- outside click ---------- */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- search filter ---------- */

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      getLabel(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  /* ---------- select ---------- */

  const handleSelect = (option) => {
    console.log('DropDownV2 - handleSelect called with:', option);
    setSelected(option);
    setIsOpen(false);
    setSearch("");
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={`modern-dropdown ${className}`} ref={dropdownRef}>
      {label && (
        <label className="dropdown-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      {/* Trigger */}
      <div
        className={`dropdown-trigger ${isOpen ? "focused" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={() => !disabled && setIsOpen((p) => !p)}
        tabIndex={disabled ? -1 : 0}
      >
        <span
          className={`dropdown-text `}
        >
          {selected
            ? getLabel(selected)
            : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`dropdown-icon ${isOpen ? "rotated" : ""}`}
        />
      </div>

      {/* Menu */}
      {isOpen && (
        <div className="dropdown-menu open">
          {searchable && (
            <div className="dropdown-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
              />
            </div>
          )}

          <div className="dropdown-options">
            {filteredData.length === 0 && (
              <div className="dropdown-empty">No results found</div>
            )}

            {filteredData.map((option, idx) => {
              const isSelectedOption =
                selected && isSameOption(selected, option);

              return (
                <div
                  key={option?._id || option?.projectId || option?.value || idx}
                  className={`dropdown-option ${
                    isSelectedOption ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  <span>{getLabel(option)}</span>
                  {isSelectedOption && <Check size={14} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


// export const DropDownV2 = ({
//   defaultType = "",
//   onChange,
//   label,
//   disabled = false,
//   className = "",
//   required,
//   data = [],
// }) => {
//   const [selected, setSelected] = useState(() => {
//     // If defaultType is provided, try to find a match
//     if (defaultType) {
//       if (Array.isArray(data)) {
//         const matched = data.find(item => 
//           (item.type === defaultType?.type) || 
//           (item.value === defaultType?.value) ||
//           (item === defaultType)
//         );
//         if (matched) return matched;
//       }
//       return defaultType;
//     }
    
//     // If no defaultType, use first item from data array if available
//     if (Array.isArray(data) && data.length > 0) {
//       return data[0];
//     }
    
//     return null;
//   });

//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     // Update selection when defaultType changes
//     if (defaultType) {
//       if (Array.isArray(data)) {
//         const matched = data.find(item =>
//           (item.type === defaultType?.type) ||
//           (item.value === defaultType?.value) ||
//           (item === defaultType)
//         );
//         if (matched) setSelected(matched);
//       } else {
//         setSelected(defaultType);
//       }
//     }
//   }, [defaultType, data]);

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
//     console.log("Selected value:", value);
//     setSelected(value);
//     setIsOpen(false);
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
//         <span className={`dropdown-text ${!selected ? 'placeholder' : ''}`}>
//           {selected?.icon && <img src={selected.icon} alt="" style={{width:"25px"}} />}
//           {typeof selected === 'object' ? selected?.type || selected?.name : selected}
//         </span>
//         <ChevronDown
//           size={20}
//           className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
//         />
//       </div>

//       <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
//         <div className="dropdown-options" role="listbox">
//           {Array.isArray(data) && data.map((option, id) => (
//             <div
//               key={id}
//               className={`dropdown-option ${selected === option ? 'selected' : ''}`}
//               onClick={() => handleOptionClick(option)}
//               role="option"
//               aria-selected={selected === option}
//             >
//               {option.icon && <img src={option.icon} alt="" style={{width:"25px"}} />}
//               <span>{typeof option === 'object' ? option.type || option.name : option}</span>
//               <Check size={16} className="check-icon" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

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
  ticketId,
  statusWorkflow, // Accept workflow from props
  statusColors // Accept colors from props
}) => {
  // Status color mapping - use prop or fallback to defaults
  const defaultStatusColors = {
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

  const defaultStatusWorkflow = {
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

  // Use provided workflow/colors or fall back to defaults
  const activeWorkflow = statusWorkflow || defaultStatusWorkflow;
  const activeColors = statusColors || defaultStatusColors;
  const getAllowedStatuses = (currentStatus) => {
    if (!currentStatus || !activeWorkflow[currentStatus]) {
      return ticketTypes;
    }
    
    const allowedNext = activeWorkflow[currentStatus];
    return [currentStatus, ...allowedNext].filter((status, index, self) => 
      self?.indexOf(status) === index && ticketTypes?.includes(status)
    );
  };

  const uniqueKey = `dropdown-${ticketId || Math.random()}`;
  const currentValue = value || defaultType || (ticketTypes && ticketTypes.length > 0 ? ticketTypes[0] : "");
  const currentColors = activeColors[currentValue] || activeColors["OPEN"];
  
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
          backgroundColor: currentColors?.bg,
          color: currentColors?.text,
          borderColor: currentColors?.border
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        <span className="status-dot" style={{ backgroundColor: currentColors?.border }}></span>
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
            const optionColors = activeColors[type] || activeColors["OPEN"];
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





const IconColorDropdown = ({
  value = null,
  onChange,
  fetchOptions,
  placeholder = "Select type",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);

  /* ---------------------------
     Fetch options on open
  --------------------------- */
  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);

    fetchOptions()
      .then((res) => active && setOptions(res || []))
      .finally(() => active && setLoading(false));

    return () => (active = false);
  }, [open, fetchOptions]);

  /* ---------------------------
     Outside click
  --------------------------- */
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`hora-ic-dropdown ${disabled ? "disabled" : ""}`} ref={ref}>
      {/* CONTROL */}
      <button
        type="button"
        className="dropdown-control"
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        {value ? (
          <span className="value">
            <span
              className="icon"
              style={{ color: value.color }}
              dangerouslySetInnerHTML={{ __html: value.svg }}
            />
            <span className="text">{value.name}</span>
          </span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}

        {loading ? (
          <Loader2 size={16} className="spin" />
        ) : (
          <ChevronDown size={16} />
        )}
      </button>

      {/* MENU */}
      {open && (
        <div className="dropdown-menu">
          <input
            className="dropdown-search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          <div className="dropdown-options">
            {loading && <div className="state">Loading…</div>}

            {!loading && filtered.length === 0 && (
              <div className="state">No results</div>
            )}

            {!loading &&
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  className={`dropdown-option ${
                    value?.id === opt.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span
                    className="icon"
                    style={{ color: opt.color }}
                    dangerouslySetInnerHTML={{ __html: opt.svg }}
                  />
                  <span className="text">{opt.name}</span>

                  <span
                    className="color-dot"
                    style={{ background: opt.color }}
                  />
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconColorDropdown;
// const [type, setType] = useState(null);

// <IconColorDropdown
//   value={type}
//   onChange={setType}
//   placeholder="Ticket Type"
//   fetchOptions={async () => {
//     const res = await apiClient.get("/ticket-types");
//     return res.data;
//   }}
// />
