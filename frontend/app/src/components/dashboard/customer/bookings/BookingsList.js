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
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
  };


  return (
    <div className="bookings-list-section">
      <div className="bookings-grid">
        {bookings.map((booking) => {
          const statusBadge = getStatusBadge(booking.status);
          const vehicleImage = booking.vehicleImage || '/images/ev-cars/default.svg';
          const vehicleName = booking.vehicleName || 'Unknown Vehicle';
          const licensePlate = booking.licensePlate || 'N/A';
          const location = booking.location || 'Unknown Location';
          const destination = booking.destination || 'Not Specified';
          const pickupDate = booking.pickupDate;
          const dropoffDate = booking.dropoffDate;
          const pickupTime = booking.pickupTime;
          const dropoffTime = booking.dropoffTime;
          const totalPrice = booking.totalPrice || 0;

          return (
            <div key={booking.id} className="booking-card">
              <div className="booking-card-header">
                <div className="booking-vehicle-info">
                  <div className="vehicle-image-container">
                    <Image
                      src={vehicleImage}
                      alt={vehicleName}
                      width={80}
                      height={50}
                      onError={(e) => e.target.src = '/images/ev-cars/default.svg'}
                    />
                  </div>
                  <div className="vehicle-details">
                    <h3>{vehicleName}</h3>
                    <p>
                      <i className="fas fa-id-card"></i>
                      {licensePlate}
                    </p>
                  </div>
                </div>
                <div className={`status-badge ${statusBadge.color}`}>
                  <i className={statusBadge.icon}></i>
                  {statusBadge.text}
                </div>
              </div>

              <div className="booking-card-body">
                <div className="booking-info-row">
                  <div className="info-item">
                    <i className="fas fa-calendar-alt"></i>
                    <div className="info-content">
                      <span className="info-label">Pickup</span>
                      <span className="info-value">
                        {formatDate(pickupDate)} • {pickupTime}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-calendar-check"></i>
                    <div className="info-content">
                      <span className="info-label">Dropoff</span>
                      <span className="info-value">
                        {formatDate(dropoffDate)} • {dropoffTime}
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
                        {location} → {destination}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-price-row">
                  <div className="price-info">
                    <span className="price-label">Total Price</span>
                    <span className="price-value">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

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