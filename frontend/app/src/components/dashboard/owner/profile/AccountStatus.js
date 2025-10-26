import React from 'react';
// Adjust path if needed, ensure it points to the correct CSS file
import '../../../../styles/dashboard/owner/profile/accountStatus.css';

// Helper component to render each status item dynamically
const StatusItem = ({ title, subtitle, verified }) => {
    // Determine icon and style based on verified status
    // Use check for verified, exclamation for pending/failed
    const iconClass = verified ? "fas fa-check-circle" : "fas fa-exclamation-circle";
    // Apply CSS class based on status ('verified' or 'pending'/'failed')
    const iconContainerClass = verified ? "verified" : "pending"; // You might add a "failed" class if the backend provides that state

    return (
        <div className="status-item">
          <div className={`status-icon ${iconContainerClass}`}>
            <i className={iconClass}></i>
          </div>
          <div className="status-info">
             {/* Show "Verified" or "Verification Pending" based on the boolean prop */}
            <span className="status-title">{title} {verified ? "Verified" : "Verification Pending"}</span>
            <span className="status-subtitle">{subtitle}</span>
          </div>
        </div>
    );
};

// Accept verification props from the parent OwnerProfile page
export default function AccountStatus({ emailVerified, phoneVerified, identityVerified }) {
  return (
    <div className="profile-card">
      <div className="card-header">
        <h3>Account Status</h3>
        <i className="fas fa-shield-alt"></i>
      </div>
      <div className="card-content">
        <div className="status-items">
          {/* Render status items dynamically using the helper component and passed props */}
          <StatusItem
            title="Identity"
            subtitle="Government ID confirmation"
            verified={identityVerified} // Use the prop here
          />
          <StatusItem
            title="Email"
            subtitle="Email address confirmation"
            verified={emailVerified} // Use the prop here
          />
          <StatusItem
            title="Phone"
            subtitle="Phone number confirmation"
            verified={phoneVerified} // Use the prop here
          />
        </div>
      </div>
    </div>
  );
}