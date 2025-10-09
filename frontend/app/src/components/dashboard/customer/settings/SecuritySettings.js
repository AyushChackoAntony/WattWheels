import React, { useState } from 'react';
import '@/styles/dashboard/customer/settings/securitySettings.css';

export default function SecuritySettings({ data, onChange }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleToggle = (field) => {
    onChange({ [field]: !data[field] });
  };

  const handleSessionTimeoutChange = (e) => {
    onChange({ sessionTimeout: parseInt(e.target.value) });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Security Settings</h2>
        <p>Protect your account and data</p>
      </div>

      <div className="settings-form">
        {/* Password */}
        <div className="form-group-container">
          <h3>Password</h3>
          
          <div className="password-info">
            <div className="password-status">
              <i className="fas fa-check-circle"></i>
              <span>Last changed: {new Date(data.lastPasswordChange).toLocaleDateString('en-IN')}</span>
            </div>
            <button 
              className="change-password-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              <i className="fas fa-key"></i>
              Change Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="form-group-container">
          <h3>Two-Factor Authentication</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Enable 2FA</label>
              <p>Add an extra layer of security to your account</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.twoFactorEnabled}
                onChange={() => handleToggle('twoFactorEnabled')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {data.twoFactorEnabled && (
            <div className="two-factor-setup">
              <div className="setup-info">
                <i className="fas fa-mobile-alt"></i>
                <div>
                  <h4>Authenticator App Enabled</h4>
                  <p>Using Google Authenticator</p>
                </div>
              </div>
              <button className="setup-btn secondary">
                <i className="fas fa-cog"></i>
                Manage 2FA
              </button>
            </div>
          )}
        </div>

        {/* Security Preferences */}
        <div className="form-group-container">
          <h3>Security Preferences</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Login Alerts</label>
              <p>Get notified of new login attempts</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.loginAlerts}
                onChange={() => handleToggle('loginAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Session Timeout</label>
              <p>Automatically log out after inactivity</p>
            </div>
            <select 
              className="setting-select"
              value={data.sessionTimeout}
              onChange={handleSessionTimeoutChange}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="form-group-container">
          <h3>Active Sessions</h3>
          
          <div className="sessions-list">
            <div className="session-item current">
              <div className="session-icon">
                <i className="fas fa-laptop"></i>
              </div>
              <div className="session-info">
                <h4>Current Session</h4>
                <p>Windows • Chrome • Chandigarh, Punjab</p>
                <span className="session-time">Active now</span>
              </div>
              <span className="current-badge">Current</span>
            </div>
          </div>

          <button className="logout-all-btn">
            <i className="fas fa-sign-out-alt"></i>
            Log Out All Other Sessions
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="close-btn" onClick={() => setShowPasswordModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}