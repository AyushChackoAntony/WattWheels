'use client';
import React from 'react';
import Image from 'next/image';
import BookingChat from './BookingChat'; // <<< PHASE 4 IMPORT
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
      active: { color: 'active', icon: 'fas fa-car', text: 'Active' },
      pending_payment: { color: 'upcoming', icon: 'fas fa-wallet', text: 'Pending Payment' } // Added for Phase 1/2
    };
    return statusConfig[status] || statusConfig.upcoming;
  };

  const statusBadge = getStatusBadge(booking.status);
  const features = Array.isArray(booking.features) ? booking.features : [];

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
          {/* Left Column: Info */}
          <div className="details-content-grid">
            <div className="info-column">
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
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Booking Timeline</h3>
                <div className="timeline-grid">
                  <div className="timeline-item">
                    <span className="timeline-label">Pickup</span>
                    <span className="timeline-value">{formatDate(booking.pickupDate)}</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-label">Dropoff</span>
                    <span className="timeline-value">{formatDate(booking.dropoffDate)}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Price Breakdown</h3>
                <div className="price-breakdown">
                  <div className="price-row total">
                    <span>Total Paid</span>
                    <span>₹{(booking.totalPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: PHASE 4 CHAT */}
            <div className="chat-column">
                {booking.status !== 'cancelled' ? (
                    <BookingChat bookingId={booking.id} />
                ) : (
                    <div className="chat-unavailable">
                        <i className="fas fa-comment-slash"></i>
                        <p>Chat is unavailable for cancelled bookings.</p>
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {booking.status === 'upcoming' && (
            <>
              <button
                className="action-btn secondary"
                onClick={() => { onModify(booking.id); onClose(); }}
              >
                <i className="fas fa-edit"></i> Modify
              </button>
              <button
                className="action-btn danger"
                onClick={() => { onCancel(booking.id); onClose(); }}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </>
          )}
          <button className="action-btn secondary" onClick={onClose}>Close</button>
        </div>
      </div>

      <style jsx>{`
        .details-content-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 25px;
        }
        .chat-unavailable {
            height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f9f9f9;
            border-radius: 12px;
            color: #999;
            border: 1px dashed #ccc;
        }
        .chat-unavailable i { font-size: 40px; margin-bottom: 10px; }
        @media (max-width: 768px) {
            .details-content-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}