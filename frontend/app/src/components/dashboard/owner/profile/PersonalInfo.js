import React from 'react';
import '../../../../styles/dashboard/owner/profile/personalInfo.css';

export default function PersonalInfo({ formData, isEditing, onChange }) {
  return (
    <div className="profile-card">
      <div className="card-header">
        <h3>Personal Information</h3>
        <i className="fas fa-user"></i>
      </div>
      <div className="card-content">
        {isEditing ? (
          <form className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={onChange}
              />
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{formData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{formData.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Address</span>
              <span className="info-value">{formData.address}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}