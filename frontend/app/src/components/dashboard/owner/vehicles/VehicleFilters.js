import React from 'react';
import '@/styles/dashboard/owner/vehicles/VehicleFilters.css';

export default function VehicleFilters({ 
  selectedFilter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange, 
  vehicleCount 
}) {
  const filterOptions = [
    { value: 'all', label: 'All Vehicles', icon: 'fas fa-list' },
    { value: 'active', label: 'Active', icon: 'fas fa-check-circle' },
    { value: 'maintenance', label: 'Maintenance', icon: 'fas fa-wrench' },
    { value: 'inactive', label: 'Inactive', icon: 'fas fa-pause-circle' },
    { value: 'cars', label: 'Cars Only', icon: 'fas fa-car' },
    { value: 'bikes', label: 'Bikes Only', icon: 'fas fa-motorcycle' }
  ];

  return (
    <div className="vehicle-filters-section">
      <div className="filters-row">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by vehicle name or license plate..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <span>{vehicleCount} vehicle{vehicleCount !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-tab ${selectedFilter === option.value ? 'active' : ''}`}
            onClick={() => onFilterChange(option.value)}
          >
            <i className={option.icon}></i>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}