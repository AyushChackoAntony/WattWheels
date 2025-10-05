import React from 'react';
import '@/styles/dashboard/customer/bookings/bookingFilters.css';

export default function BookingFilters({ 
  selectedFilter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange, 
  bookingCount 
}) {
  const filterOptions = [
    { value: 'all', label: 'All Bookings', icon: 'fas fa-list' },
    { value: 'upcoming', label: 'Upcoming', icon: 'fas fa-clock' },
    { value: 'completed', label: 'Completed', icon: 'fas fa-check-circle' },
    { value: 'cancelled', label: 'Cancelled', icon: 'fas fa-times-circle' }
  ];

  return (
    <div className="booking-filters-section">
      <div className="filters-row">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by vehicle, location..."
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
          <span>{bookingCount} booking{bookingCount !== 1 ? 's' : ''} found</span>
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