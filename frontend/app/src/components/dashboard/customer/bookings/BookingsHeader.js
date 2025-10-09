import React from 'react';
import '@/styles/dashboard/customer/bookings/bookingsHeader.css';

export default function BookingsHeader({ 
  totalBookings, 
  upcomingBookings, 
  completedBookings, 
  totalSpent 
}) {
  return (
    <div className="bookings-header-section">
      <div className="bookings-header-content">
        <div className="bookings-header-info">
          <h1>My Bookings</h1>
          <p>View and manage all your vehicle bookings</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bookings-stats-grid">
        <div className="bookings-stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        
        <div className="bookings-stat-card">
          <div className="stat-icon upcoming">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{upcomingBookings}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        
        <div className="bookings-stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{completedBookings}</h3>
            <p>Completed</p>
          </div>
        </div>
        
        <div className="bookings-stat-card">
          <div className="stat-icon spending">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="stat-content">
            <h3>₹{totalSpent.toLocaleString()}</h3>
            <p>Total Spent</p>
          </div>
        </div>
      </div>
    </div>
  );
}