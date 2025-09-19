import React from 'react';
import '../../../../styles/dashboard/owner/profile/accountStatus.css';

export default function AccountStatus({ formData }) {
  return (
    <div className="profile-card">
      <div className="card-header">
        <h3>Account Status</h3>
        <i className="fas fa-shield-alt"></i>
      </div>
      <div className="card-content">
        <div className="status-items">
          <div className="status-item">
            <div className="status-icon verified">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="status-info">
              <span className="status-title">Identity Verified</span>
              <span className="status-subtitle">Government ID confirmed</span>
            </div>
          </div>
          <div className="status-item">
            <div className="status-icon verified">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="status-info">
              <span className="status-title">Email Verified</span>
              <span className="status-subtitle">Email address confirmed</span>
            </div>
          </div>
          <div className="status-item">
            <div className="status-icon verified">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="status-info">
              <span className="status-title">Phone Verified</span>
              <span className="status-subtitle">Phone number confirmed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}