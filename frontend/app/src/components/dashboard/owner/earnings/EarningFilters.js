import React from 'react';
import '@/styles/dashboard/owner/earnings/earningsFilters.css';

export default function EarningsFilters({ 
  selectedTimeframe, 
  onTimeframeChange, 
  selectedFilter, 
  onFilterChange 
}) {
  
  const timeframeOptions = [
    { value: 'week', label: 'This Week', icon: 'fas fa-calendar-week' },
    { value: 'month', label: 'This Month', icon: 'fas fa-calendar-alt' },
    { value: 'year', label: 'This Year', icon: 'fas fa-calendar' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Transactions', icon: 'fas fa-list', color: 'default' },
    { value: 'earnings', label: 'Earnings Only', icon: 'fas fa-arrow-up', color: 'success' },
    { value: 'payouts', label: 'Payouts Only', icon: 'fas fa-arrow-down', color: 'info' },
    { value: 'pending', label: 'Pending Only', icon: 'fas fa-clock', color: 'warning' }
  ];

  return (
    <div className="earnings-filters-section">
      <div className="filters-container">
        
        {/* Timeframe Selector */}
        <div className="filter-group">
          <h4>Time Period</h4>
          <div className="timeframe-tabs">
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                className={`timeframe-tab ${selectedTimeframe === option.value ? 'active' : ''}`}
                onClick={() => onTimeframeChange(option.value)}
              >
                <i className={option.icon}></i>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Filter */}
        <div className="filter-group">
          <h4>Transaction Type</h4>
          <div className="transaction-filters">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`filter-chip ${option.color} ${selectedFilter === option.value ? 'active' : ''}`}
                onClick={() => onFilterChange(option.value)}
              >
                <i className={option.icon}></i>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="export-section">
          <button className="export-btn">
            <i className="fas fa-download"></i>
            Export Report
          </button>
          <div className="export-dropdown">
            <button className="export-option">
              <i className="fas fa-file-csv"></i>
              Export as CSV
            </button>
            <button className="export-option">
              <i className="fas fa-file-pdf"></i>
              Export as PDF
            </button>
            <button className="export-option">
              <i className="fas fa-file-excel"></i>
              Export as Excel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}