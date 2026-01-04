import "./FilterBar.scss";
import { Search } from "lucide-react";
import FilterDropdown from "./FilterDropdown";

export default function FilterBar({
  search,
  onSearchChange,
  statusOptions,
  sprintOptions,
  assigneeOptions,
  sortOptions,
  filters,
  onFilterChange,
}) {
  return (
    <div className="hora_filter_bar">
      {/* Search */}
      <div className="filter_search">
        <Search size={18} />
        <input
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

    <FilterDropdown
  label="Status"
  value={filters.status}
  options={statusOptions}
  onChange={(val) => onFilterChange("status", val)}
  searchable
/>

<FilterDropdown
  label="Sprint"
  value={filters.sprint}
  options={sprintOptions}
  onChange={(val) => onFilterChange("sprint", val)}
  searchable
/>

<FilterDropdown
  label="Assignee"
  value={filters.assignee}
  options={assigneeOptions}
  onChange={(val) => onFilterChange("assignee", val)}
  searchable
  avatar
/>

<FilterDropdown
  label="Sort"
  value={filters.sort}
  options={sortOptions}
  onChange={(val) => onFilterChange("sort", val)}
/>

    </div>
  );
}
