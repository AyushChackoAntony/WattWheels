import React from 'react';
import Image from 'next/image';
import '@/styles/dashboard/customer/bookings/bookingDetails.css';

export default function BookingDetails({ booking, onClose, onCancel, onModify }) {
  const formatDate = (dateString) => {
     if (!dateString) return 'N/A';
     try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
        });
     } catch(e) {
        return 'Invalid Date';
     }
  };


  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { color: 'upcoming', icon: 'fas fa-clock', text: 'Upcoming' },
      completed: { color: 'completed', icon: 'fas fa-check-circle', text: 'Completed' },
      cancelled: { color: 'cancelled', icon: 'fas fa-times-circle', text: 'Cancelled' },
      active: { color: 'active', icon: 'fas fa-car', text: 'Active' } // Added active status
    };
    return statusConfig[status] || statusConfig.upcoming;
  };

  const statusBadge = getStatusBadge(booking.status);
  const features = Array.isArray(booking.features) ? booking.features : []; // Ensure features is an array

  return (
    <div className="booking-details-overlay">
      <div className="booking-details-modal">
        <div className="modal-header">
          <h2>Booking Details</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="booking-status-section">
            <div className={`status-badge-large ${statusBadge.color}`}>
              <i className={statusBadge.icon}></i>
              {statusBadge.text}
            </div>
            <p className="booking-id">Booking ID: #{booking.id}</p>
          </div>

          <div className="details-section">
            <h3>Vehicle Information</h3>
            <div className="vehicle-info-card">
              <Image
                src={booking.vehicleImage || '/images/ev-cars/default.svg'}
                alt={booking.vehicleName || 'Vehicle'}
                width={120}
                height={80}
                className="vehicle-image"
                 onError={(e) => e.target.src = '/images/ev-cars/default.svg'}
              />
              <div className="vehicle-info-details">
                <h4>{booking.vehicleName || 'Unknown Vehicle'}</h4>
                <div className="vehicle-specs">
                  <span><i className="fas fa-id-card"></i> {booking.licensePlate || 'N/A'}</span>
                  <span><i className="fas fa-battery-three-quarters"></i> {booking.batteryRange || 'N/A'}</span>
                </div>
                {features.length > 0 && (
                  <div className="vehicle-features">
                    {features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Booking Timeline</h3>
            <div className="timeline-grid">
              <div className="timeline-item">
                <div className="timeline-icon pickup">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="timeline-content">
                  <span className="timeline-label">Pickup</span>
                  <span className="timeline-value">{formatDate(booking.pickupDate)}</span>
                  <span className="timeline-time">{booking.pickupTime || 'N/A'}</span>
                </div>
              </div>
              <div className="timeline-divider">
                <i className="fas fa-arrow-right"></i>
              </div>
              <div className="timeline-item">
                <div className="timeline-icon dropoff">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="timeline-content">
                  <span className="timeline-label">Dropoff</span>
                  <span className="timeline-value">{formatDate(booking.dropoffDate)}</span>
                  <span className="timeline-time">{booking.dropoffTime || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Location Details</h3>
            <div className="location-info">
              <div className="location-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <span className="location-label">Pickup Location</span>
                  <span className="location-value">{booking.location || 'Unknown Location'}</span>
                </div>
              </div>
              <div className="location-item">
                <i className="fas fa-map-marked-alt"></i>
                <div>
                  <span className="location-label">Destination</span>
                  <span className="location-value">{booking.destination || 'Not Specified'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Owner Information</h3>
            <div className="owner-info-card">
              <div className="owner-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="owner-details">
                <h4>{booking.owner || 'Unknown Owner'}</h4>
                <div className="owner-contact">
                  <span><i className="fas fa-phone"></i> {booking.ownerPhone || 'N/A'}</span>
                  {booking.ownerRating !== null && booking.ownerRating !== undefined && (
                     <span><i className="fas fa-star"></i> {booking.ownerRating} Rating</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Price Breakdown</h3>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Rental Price</span>
                <span>₹{(booking.totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Service Fee</span>
                <span>₹0</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{(booking.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Cancellation Policy</h3>
            <p className="policy-text">
              <i className="fas fa-info-circle"></i>
              {booking.cancellationPolicy || 'Not Specified'}
            </p>
          </div>

          {booking.status === 'cancelled' && booking.cancellationReason && (
            <div className="details-section">
              <h3>Cancellation Reason</h3>
              <p className="cancellation-reason">
                <i className="fas fa-times-circle"></i>
                {booking.cancellationReason}
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {booking.status === 'upcoming' && (
            <>
              <button
                className="action-btn secondary"
                onClick={() => {
                  onModify(booking.id);
                  onClose();
                }}
              >
                <i className="fas fa-edit"></i>
                Modify Booking
              </button>
              <button
                className="action-btn danger"
                onClick={() => {
                  onCancel(booking.id);
                  onClose();
                }}
              >
                <i className="fas fa-times"></i>
                Cancel Booking
              </button>
            </>
          )}
          {booking.status === 'completed' && (
            <button className="action-btn primary">
              <i className="fas fa-redo"></i>
              Book Again
            </button>
          )}
          <button className="action-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}