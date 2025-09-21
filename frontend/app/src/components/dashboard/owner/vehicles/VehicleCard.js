import React, { useState } from 'react';
import Image from 'next/image';
import '@/styles/dashboard/owner/vehicles/VehicleCard.css';

export default function VehicleCard({ vehicle, onDelete, onToggleStatus }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', icon: 'fas fa-check-circle', text: 'Active' },
      maintenance: { color: 'warning', icon: 'fas fa-wrench', text: 'Maintenance' },
      inactive: { color: 'danger', icon: 'fas fa-pause-circle', text: 'Inactive' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const statusBadge = getStatusBadge(vehicle.status);

  const handleStatusChange = (newStatus) => {
    onToggleStatus(newStatus);
    setShowMenu(false);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="vehicle-card">
      {/* Vehicle Image and Status */}
      <div className="vehicle-card-header">
        <div className="vehicle-image-container">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            width={80}
            height={50}
            className="vehicle-image"
          />
          <div className={`status-badge ${statusBadge.color}`}>
            <i className={statusBadge.icon}></i>
            {statusBadge.text}
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="vehicle-actions">
          <button
            className="actions-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <i className="fas fa-ellipsis-v"></i>
          </button>
          
          {showMenu && (
            <div className="actions-dropdown">
              <button onClick={() => handleStatusChange('active')}>
                <i className="fas fa-check-circle"></i> Set Active
              </button>
              <button onClick={() => handleStatusChange('maintenance')}>
                <i className="fas fa-wrench"></i> Set Maintenance
              </button>
              <button onClick={() => handleStatusChange('inactive')}>
                <i className="fas fa-pause-circle"></i> Set Inactive
              </button>
              <hr />
              <button className="edit-btn">
                <i className="fas fa-edit"></i> Edit Details
              </button>
              <button 
                className="delete-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <i className="fas fa-trash"></i> Delete Vehicle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="vehicle-card-info">
        <h3 className="vehicle-name">{vehicle.name}</h3>
        <p className="vehicle-details">
          {vehicle.year} • {vehicle.color} • {vehicle.licensePlate}
        </p>
        
        {/* Specifications */}
        <div className="vehicle-specs">
          <div className="spec-item">
            <i className="fas fa-battery-three-quarters"></i>
            <span>{vehicle.batteryRange}</span>
          </div>
          <div className="spec-item">
            <i className="fas fa-tachometer-alt"></i>
            <span>{vehicle.acceleration}</span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="vehicle-stats">
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Monthly Earnings</span>
              <span className="stat-value earning">₹{vehicle.monthlyEarnings.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monthly Bookings</span>
              <span className="stat-value">{vehicle.monthlyBookings}</span>
            </div>
          </div>
          
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value rating">
                <i className="fas fa-star"></i>
                {vehicle.rating}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Availability</span>
              <span className="stat-value">{vehicle.availability}%</span>
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="vehicle-card-footer">
          <div className="vehicle-price">
            <span className="price">₹{vehicle.pricePerDay}</span>
            <span className="period">/day</span>
          </div>
          
          <div className="card-actions">
            <button className="action-btn secondary">
              <i className="fas fa-chart-line"></i>
              Analytics
            </button>
            <button className="action-btn primary">
              <i className="fas fa-calendar-alt"></i>
              Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-modal">
            <div className="modal-header">
              <i className="fas fa-exclamation-triangle warning-icon"></i>
              <h3>Delete Vehicle</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{vehicle.name}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete"
                onClick={handleDeleteConfirm}
              >
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}