import React, { useState } from 'react';
import '@/styles/dashboard/owner/settings/settingsHeader.css';

export default function SettingsHeader({ hasUnsavedChanges, onSaveAll }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSaveAll();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-header-section">
      <div className="settings-header-content">
        <div className="settings-header-info">
          <h1>Settings</h1>
          <p>Manage your account preferences and configurations</p>
        </div>
        
        <div className="settings-header-actions">
          {hasUnsavedChanges && (
            <div className="unsaved-changes-indicator">
              <i className="fas fa-exclamation-circle"></i>
              <span>You have unsaved changes</span>
            </div>
          )}
          
          <button 
            className={`save-all-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || isSaving}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Settings Overview */}
      <div className="quick-settings-overview">
        <div className="overview-cards">
          
          <div className="overview-card">
            <div className="card-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="card-info">
              <h3>Profile Complete</h3>
              <p>85% completed</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon security">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="card-info">
              <h3>Security Score</h3>
              <p>Good - 4/5</p>
              <div className="security-indicators">
                <span className="indicator active"></span>
                <span className="indicator active"></span>
                <span className="indicator active"></span>
                <span className="indicator active"></span>
                <span className="indicator"></span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon notifications">
              <i className="fas fa-bell"></i>
            </div>
            <div className="card-info">
              <h3>Notifications</h3>
              <p>8 types enabled</p>
              <div className="notification-status">
                <span className="status-dot enabled"></span>
                <span>All important alerts on</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon payment">
              <i className="fas fa-credit-card"></i>
            </div>
            <div className="card-info">
              <h3>Payment Setup</h3>
              <p>Bank verified</p>
              <div className="payment-status">
                <span className="status-dot verified"></span>
                <span>Ready for payouts</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}