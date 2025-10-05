import React from 'react';
import '@/styles/dashboard/customer/profile/profileHeader.css';

export default function ProfileHeader({ formData, isEditing, setIsEditing, onSave, onCancel }) {
  return (
    <div className="profile-header-section">
      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-container">
            <img 
              src="/images/avatar.png" 
              alt="Profile Avatar" 
              className="profile-avatar-large"
            />
            <button className="avatar-edit-btn">
              <i className="fas fa-camera"></i>
            </button>
          </div>
        </div>
        
        <div className="profile-info-section">
          <div className="profile-title">
            <h1>{formData.firstName} {formData.lastName}</h1>
            {formData.verified && (
              <span className="verified-badge">
                <i className="fas fa-check-circle"></i>
                Verified Customer
              </span>
            )}
          </div>
          <p className="profile-subtitle">Customer • Member since {formData.joinDate}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Total Rides</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Average Rating</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">45kg</span>
              <span className="stat-label">CO2 Saved</span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="primary-btn" 
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="secondary-btn" 
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                className="primary-btn" 
                onClick={onSave}
              >
                <i className="fas fa-save"></i>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}