import { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function FilterDropdown({
  label,
  value,
  options = [],
  onChange,
  searchable = false,
  avatar = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find(o => o.value === value);

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    return options.filter(o =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query, searchable]);

  return (
    <div className="filter_dropdown">
      <button className="dropdown_trigger" onClick={() =>{ setOpen(!open)
      }}>
        <span className="label">{label}</span>
        {selected && <span className="value">{selected.label}</span>}
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
            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={`dropdown_item ${
                  option.value === value ? "active" : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {avatar && (
                  <span
                    className="avatar"
                    style={{ backgroundColor: option.color }}
                  >
                    {option.label[0]}
                  </span>
                )}
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
