import React from 'react';
import '@/styles/dashboard/owner/vehicles/vehiclesHeader.css';

export default function VehiclesHeader({ 
  totalVehicles, 
  activeVehicles, 
  totalMonthlyEarnings, 
  totalMonthlyBookings,
  onAddVehicle 
}) {
  return (
    <div className="vehicles-header-section">
      <div className="vehicles-header-content">
        <div className="vehicles-header-info">
          <h1>My Vehicles</h1>
          <p>Manage your electric vehicle fleet</p>
        </div>
        <div className="vehicles-header-actions">
          <button className="add-vehicle-btn" onClick={onAddVehicle}>
            <i className="fas fa-plus"></i>
            Add New Vehicle
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="vehicles-stats-grid">
        <div className="vehicles-stat-card">
          <div className="stat-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="stat-content">
            <h3>{totalVehicles}</h3>
            <p>Total Vehicles</p>
          </div>
        </div>
        
        <div className="vehicles-stat-card">
          <div className="stat-icon active">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{activeVehicles}</h3>
            <p>Active Vehicles</p>
          </div>
        </div>
        
        <div className="vehicles-stat-card">
          <div className="stat-icon earning">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="stat-content">
            <h3>₹{totalMonthlyEarnings.toLocaleString()}</h3>
            <p>Monthly Earnings</p>
          </div>
        </div>
        
        <div className="vehicles-stat-card">
          <div className="stat-icon booking">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{totalMonthlyBookings}</h3>
            <p>Monthly Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}