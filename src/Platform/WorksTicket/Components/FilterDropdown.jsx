import { useState, useMemo } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

export default function FilterDropdown({
  label,
  value,
  options = [],
  onChange,
  searchable = false,
  avatar = false,
  allowMultipleSelect = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const safeOptions = options || [];
  
  const selected = useMemo(() => {
    if (allowMultipleSelect) {
      const values = Array.isArray(value) ? value : [];
      return safeOptions.filter(o => values.includes(o?.value));
    }
    return safeOptions.find(o => o?.value === value);
  }, [safeOptions, value, allowMultipleSelect]);

  const filteredOptions = useMemo(() => {
    if (!searchable) return safeOptions;
    return safeOptions.filter(o =>
      o?.label?.toLowerCase().includes(query.toLowerCase())
    );
  }, [safeOptions, query, searchable]);

  const getDisplayValue = () => {
    if (!selected) return null;
    if (allowMultipleSelect) {
      if (selected.length === 0) return null;
      if (selected.length <= 2) return selected.map(s => s.label).join(", ");
      return `${selected.length} Selected`;
    }
    return selected.label;
  };

  return (
    <div className="filter_dropdown">
      <button className="dropdown_trigger" onClick={() =>{ setOpen(!open)
      }}>
        <span className="label">{label}</span>
        {selected && <span className="value">{getDisplayValue()}</span>}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="dropdown_menu">
          {searchable && (
            <div className="dropdown_search">
              <Search size={14} />
              <input
                placeholder={`Search ${label.toLowerCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}

          <div className="dropdown_list">
            {filteredOptions.map(option => {
              const isActive = allowMultipleSelect 
                ? Array.isArray(value) && value.includes(option.value)
                : option.value === value;
              
              return (
              <div
                key={option.value}
                className={`dropdown_item ${isActive ? "active" : ""}`}
                onClick={(e) => {
                  if (allowMultipleSelect) {
                    e.stopPropagation();
                    const currentValues = Array.isArray(value) ? [...value] : [];
                    const nextValues = isActive 
                      ? currentValues.filter(v => v !== option.value)
                      : [...currentValues, option.value];
                    onChange(nextValues);
                  } else {
                    // Toggle logic: if already selected, clear it
                    onChange(isActive ? null : option.value);
                    setOpen(false);
                  }
                }}
              >
                <div className={`checkbox ${isActive ? "checked" : ""}`}>
                  {isActive && <Check size={12} />}
                </div>
                {avatar && (
                  <span
                    className="avatar"
                    style={{ backgroundColor: option.color }}
                  >
                    {option.label[0]}
                  </span>
                )}
                <span className="item_label">{option.label}</span>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
