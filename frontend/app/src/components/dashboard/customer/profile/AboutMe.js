import React from 'react';
import '@/styles/dashboard/customer/profile/aboutMe.css';

export default function AboutMe({ formData, isEditing, onChange }) {
  return (
    <div className="profile-card">
      <div className="card-header">
        <h3>About Me</h3>
        <i className="fas fa-info-circle"></i>
      </div>
      <div className="card-content">
        {isEditing ? (
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={onChange}
              placeholder="Tell us about yourself..."
            />
          </div>
        ) : (
          <p className="profile-bio">{formData.bio}</p>
        )}
      </div>
    </div>
  );
}