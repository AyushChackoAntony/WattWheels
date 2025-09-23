import React from 'react';

export default function AvailabilityHeader({ 
  totalVehicles, 
  availableVehicles, 
  avgAvailability, 
  totalUpcomingBookings,
  viewMode,
  onViewModeChange 
}) {
  return (
    <div className="availability-header-section">
      <div className="availability-header-content">
        <div className="availability-header-info">
          <h1>Set Availability</h1>
          <p>Manage when your vehicles are available for booking</p>
        </div>
        
        <div className="view-mode-toggle">
          <button 
            className={`view-mode-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => onViewModeChange('calendar')}
          >
            <i className="fas fa-calendar-alt"></i>
            Calendar View
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            <i className="fas fa-list"></i>
            List View
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="availability-stats-grid">
        <div className="availability-stat-card">
          <div className="stat-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="stat-content">
            <h3>{totalVehicles}</h3>
            <p>Total Vehicles</p>
          </div>
        </div>
        
        <div className="availability-stat-card">
          <div className="stat-icon available">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{availableVehicles}</h3>
            <p>Currently Available</p>
          </div>
        </div>
        
        <div className="availability-stat-card">
          <div className="stat-icon percentage">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-content">
            <h3>{avgAvailability}%</h3>
            <p>Average Availability</p>
          </div>
        </div>
        
        <div className="availability-stat-card">
          <div className="stat-icon bookings">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{totalUpcomingBookings}</h3>
            <p>Upcoming Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}