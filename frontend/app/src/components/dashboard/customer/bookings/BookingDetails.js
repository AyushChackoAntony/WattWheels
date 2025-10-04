import React from 'react';
import Image from 'next/image';
import '@/styles/dashboard/customer/bookings/bookingDetails.css';

export default function BookingDetails({ booking, onClose, onCancel, onModify }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { color: 'upcoming', icon: 'fas fa-clock', text: 'Upcoming' },
      completed: { color: 'completed', icon: 'fas fa-check-circle', text: 'Completed' },
      cancelled: { color: 'cancelled', icon: 'fas fa-times-circle', text: 'Cancelled' }
    };
    return statusConfig[status] || statusConfig.upcoming;
  };

  const statusBadge = getStatusBadge(booking.status);

  return (
    <div className="booking-details-overlay">
      <div className="booking-details-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Booking Details</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status Badge */}
          <div className="booking-status-section">
            <div className={`status-badge-large ${statusBadge.color}`}>
              <i className={statusBadge.icon}></i>
              {statusBadge.text}
            </div>
            <p className="booking-id">Booking ID: #{booking.id}</p>
          </div>

          {/* Vehicle Info */}
          <div className="details-section">
            <h3>Vehicle Information</h3>
            <div className="vehicle-info-card">
              <Image 
                src={booking.vehicleImage} 
                alt={booking.vehicleName}
                width={120}
                height={80}
                className="vehicle-image"
              />
              <div className="vehicle-info-details">
                <h4>{booking.vehicleName}</h4>
                <div className="vehicle-specs">
                  <span><i className="fas fa-id-card"></i> {booking.licensePlate}</span>
                  <span><i className="fas fa-battery-three-quarters"></i> {booking.batteryRange}</span>
                </div>
                <div className="vehicle-features">
                  {booking.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Timeline */}
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
                  <span className="timeline-time">{booking.pickupTime}</span>
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
                  <span className="timeline-time">{booking.dropoffTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="details-section">
            <h3>Location Details</h3>
            <div className="location-info">
              <div className="location-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <span className="location-label">Pickup Location</span>
                  <span className="location-value">{booking.location}</span>
                </div>
              </div>
              <div className="location-item">
                <i className="fas fa-map-marked-alt"></i>
                <div>
                  <span className="location-label">Destination</span>
                  <span className="location-value">{booking.destination}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="details-section">
            <h3>Owner Information</h3>
            <div className="owner-info-card">
              <div className="owner-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="owner-details">
                <h4>{booking.owner}</h4>
                <div className="owner-contact">
                  <span><i className="fas fa-phone"></i> {booking.ownerPhone}</span>
                  <span><i className="fas fa-star"></i> {booking.ownerRating} Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="details-section">
            <h3>Price Breakdown</h3>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Rental Price</span>
                <span>₹{booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Service Fee</span>
                <span>₹0</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{booking.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="details-section">
            <h3>Cancellation Policy</h3>
            <p className="policy-text">
              <i className="fas fa-info-circle"></i>
              {booking.cancellationPolicy}
            </p>
          </div>

          {/* Cancellation Reason (if cancelled) */}
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

        {/* Modal Footer */}
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