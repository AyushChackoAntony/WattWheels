import React from 'react';
import Image from 'next/image';
import '@/styles/dashboard/customer/bookings/bookingsList.css';

export default function BookingsList({ bookings, onViewDetails, onCancelBooking, onModifyBooking }) {
  if (bookings.length === 0) {
    return (
      <div className="bookings-empty-state">
        <div className="empty-state-content">
          <div className="empty-state-icon">
            <i className="fas fa-calendar-times"></i>
          </div>
          <h3>No bookings found</h3>
          <p>No bookings match your current filter criteria.</p>
          <button className="primary-btn">
            <i className="fas fa-search"></i>
            Browse Vehicles
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { color: 'upcoming', icon: 'fas fa-clock', text: 'Upcoming' },
      completed: { color: 'completed', icon: 'fas fa-check-circle', text: 'Completed' },
      cancelled: { color: 'cancelled', icon: 'fas fa-times-circle', text: 'Cancelled' },
      active: { color: 'active', icon: 'fas fa-car', text: 'Active' }
    };
    return statusConfig[status] || statusConfig.upcoming;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bookings-list-section">
      <div className="bookings-grid">
        {bookings.map((booking) => {
          const statusBadge = getStatusBadge(booking.status);
          
          return (
            <div key={booking.id} className="booking-card">
              {/* Booking Header */}
              <div className="booking-card-header">
                <div className="booking-vehicle-info">
                  <div className="vehicle-image-container">
                    <Image 
                      src={booking.vehicleImage} 
                      alt={booking.vehicleName}
                      width={80}
                      height={50}
                    />
                  </div>
                  <div className="vehicle-details">
                    <h3>{booking.vehicleName}</h3>
                    <p>
                      <i className="fas fa-id-card"></i>
                      {booking.licensePlate}
                    </p>
                  </div>
                </div>
                <div className={`status-badge ${statusBadge.color}`}>
                  <i className={statusBadge.icon}></i>
                  {statusBadge.text}
                </div>
              </div>

              {/* Booking Details */}
              <div className="booking-card-body">
                <div className="booking-info-row">
                  <div className="info-item">
                    <i className="fas fa-calendar-alt"></i>
                    <div className="info-content">
                      <span className="info-label">Pickup</span>
                      <span className="info-value">
                        {formatDate(booking.pickupDate)} • {booking.pickupTime}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-calendar-check"></i>
                    <div className="info-content">
                      <span className="info-label">Dropoff</span>
                      <span className="info-value">
                        {formatDate(booking.dropoffDate)} • {booking.dropoffTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-info-row">
                  <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="info-content">
                      <span className="info-label">Route</span>
                      <span className="info-value">
                        {booking.location} → {booking.destination}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-price-row">
                  <div className="price-info">
                    <span className="price-label">Total Price</span>
                    <span className="price-value">₹{booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="booking-card-footer">
                <button 
                  className="action-btn secondary"
                  onClick={() => onViewDetails(booking)}
                >
                  <i className="fas fa-eye"></i>
                  View Details
                </button>
                
                {booking.status === 'upcoming' && (
                  <>
                    <button 
                      className="action-btn primary"
                      onClick={() => onModifyBooking(booking.id)}
                    >
                      <i className="fas fa-edit"></i>
                      Modify
                    </button>
                    <button 
                      className="action-btn danger"
                      onClick={() => onCancelBooking(booking.id)}
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </>
                )}
                
                {booking.status === 'completed' && (
                  <button className="action-btn primary">
                    <i className="fas fa-redo"></i>
                    Book Again
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}