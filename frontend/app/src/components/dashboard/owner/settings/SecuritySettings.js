import React, { useState } from 'react';
import '@/styles/dashboard/owner/settings/securitySettings.css';

export default function SecuritySettings({ data, onChange }) {
  const [securityData, setSecurityData] = useState(data);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSecurityUpdate = (field, value) => {
    const newData = { ...securityData, [field]: value };
    setSecurityData(newData);
    onChange(newData);
  };

  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const submitPasswordChange = () => {
    // Validate and submit password change
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // API call to change password
    console.log('Changing password...');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const toggle2FA = () => {
    if (securityData.twoFactorEnabled) {
      // Disable 2FA
      handleSecurityUpdate('twoFactorEnabled', false);
    } else {
      // Show setup modal
      setShow2FAModal(true);
    }
  };

  const enable2FA = () => {
    // Enable 2FA after setup
    handleSecurityUpdate('twoFactorEnabled', true);
    setShow2FAModal(false);
  };

  const sessionTimeouts = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 480, label: '8 hours' },
    { value: 0, label: 'Never' }
  ];

  const loginSessions = [
    {
      id: 1,
      device: 'iPhone 13 Pro',
      location: 'Chandigarh, India',
      browser: 'Safari 15.0',
      lastActive: '2 hours ago',
      current: true
    },
    {
      id: 2,
      device: 'MacBook Pro',
      location: 'Chandigarh, India',
      browser: 'Chrome 96.0',
      lastActive: '1 day ago',
      current: false
    },
    {
      id: 3,
      device: 'Windows PC',
      location: 'Delhi, India',
      browser: 'Edge 96.0',
      lastActive: '3 days ago',
      current: false
    }
  ];

  return (
    <div className="security-settings-container">
      <div className="settings-section">
        <div className="section-header">
          <h2>Security Settings</h2>
          <p>Manage your account security and privacy</p>
        </div>

        {/* Security Overview */}
        <div className="settings-card security-overview">
          <div className="card-header">
            <h3>Security Score</h3>
            <div className="security-score">
              <div className="score-circle">
                <span className="score-number">4</span>
                <span className="score-total">/5</span>
              </div>
              <div className="score-label">Good</div>
            </div>
          </div>
          
          <div className="card-content">
            <div className="security-checklist">
              <div className="checklist-item completed">
                <i className="fas fa-check-circle"></i>
                <span>Strong password</span>
              </div>
              <div className="checklist-item completed">
                <i className="fas fa-check-circle"></i>
                <span>Email verified</span>
              </div>
              <div className="checklist-item completed">
                <i className="fas fa-check-circle"></i>
                <span>Phone verified</span>
              </div>
              <div className="checklist-item completed">
                <i className="fas fa-check-circle"></i>
                <span>Login alerts enabled</span>
              </div>
              <div className="checklist-item incomplete">
                <i className="fas fa-times-circle"></i>
                <span>Two-factor authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Password & Authentication</h3>
            <p>Manage your login credentials</p>
          </div>
          
          <div className="card-content">
            <div className="security-setting">
              <div className="setting-info">
                <h4>Password</h4>
                <p>Last changed on {new Date(securityData.lastPasswordChange).toLocaleDateString('en-IN')}</p>
              </div>
              <button 
                className="security-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>

            <div className="security-setting">
              <div className="setting-info">
                <h4>Two-Factor Authentication</h4>
                <p>
                  {securityData.twoFactorEnabled 
                    ? 'Add an extra layer of security to your account'
                    : 'Secure your account with an additional verification step'
                  }
                </p>
              </div>
              <button 
                className={`security-btn ${securityData.twoFactorEnabled ? 'enabled' : ''}`}
                onClick={toggle2FA}
              >
                {securityData.twoFactorEnabled ? (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Enabled
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-alt"></i>
                    Enable 2FA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Session Management</h3>
            <p>Control your login sessions and timeouts</p>
          </div>
          
          <div className="card-content">
            <div className="security-setting">
              <div className="setting-info">
                <h4>Session Timeout</h4>
                <p>Automatically log out after period of inactivity</p>
              </div>
              <select
                value={securityData.sessionTimeout}
                onChange={(e) => handleSecurityUpdate('sessionTimeout', parseInt(e.target.value))}
                className="timeout-select"
              >
                {sessionTimeouts.map(timeout => (
                  <option key={timeout.value} value={timeout.value}>
                    {timeout.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="security-setting">
              <div className="setting-info">
                <h4>Login Alerts</h4>
                <p>Get notified when someone logs into your account</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={securityData.loginAlerts}
                  onChange={(e) => handleSecurityUpdate('loginAlerts', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Active Sessions</h3>
            <p>Manage devices that are signed into your account</p>
          </div>
          
          <div className="card-content">
            <div className="sessions-list">
              {loginSessions.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-icon">
                    <i className={`fas fa-${session.device.toLowerCase().includes('iphone') || session.device.toLowerCase().includes('mobile') ? 'mobile-alt' : 'desktop'}`}></i>
                  </div>
                  <div className="session-details">
                    <h4>{session.device}</h4>
                    <p>{session.browser} • {session.location}</p>
                    <span className="session-time">Last active: {session.lastActive}</span>
                  </div>
                  <div className="session-actions">
                    {session.current ? (
                      <span className="current-session">Current session</span>
                    ) : (
                      <button className="revoke-session-btn">
                        <i className="fas fa-times"></i>
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button className="revoke-all-btn">
              <i className="fas fa-sign-out-alt"></i>
              Sign out all other sessions
            </button>
          </div>
        </div>

        {/* Account Activity */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="download-activity-btn">
              <i className="fas fa-download"></i>
              Download Report
            </button>
          </div>
          
          <div className="card-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon login">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <div className="activity-details">
                  <h4>Login</h4>
                  <p>Successful login from iPhone</p>
                  <span className="activity-time">2 hours ago • Chandigarh, India</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon settings">
                  <i className="fas fa-cog"></i>
                </div>
                <div className="activity-details">
                  <h4>Settings Changed</h4>
                  <p>Notification preferences updated</p>
                  <span className="activity-time">1 day ago • Chandigarh, India</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon password">
                  <i className="fas fa-key"></i>
                </div>
                <div className="activity-details">
                  <h4>Password Changed</h4>
                  <p>Account password was updated</p>
                  <span className="activity-time">1 week ago • Chandigarh, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="security-modal-overlay">
          <div className="security-modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-submit"
                onClick={submitPasswordChange}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="security-modal-overlay">
          <div className="security-modal">
            <div className="modal-header">
              <h3>Enable Two-Factor Authentication</h3>
              <button onClick={() => setShow2FAModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="twofa-setup">
                <div className="setup-step">
                  <h4>Step 1: Download Authenticator App</h4>
                  <p>Install Google Authenticator or Authy on your phone</p>
                </div>
                <div className="setup-step">
                  <h4>Step 2: Scan QR Code</h4>
                  <div className="qr-code-placeholder">
                    <i className="fas fa-qrcode"></i>
                    <p>QR Code would appear here</p>
                  </div>
                </div>
                <div className="setup-step">
                  <h4>Step 3: Enter Verification Code</h4>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShow2FAModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-submit"
                onClick={enable2FA}
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}