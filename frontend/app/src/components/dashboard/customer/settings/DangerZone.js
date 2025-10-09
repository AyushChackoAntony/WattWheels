import React, { useState } from 'react';
import '@/styles/dashboard/customer/settings/dangerZone.css';

export default function DangerZone({ user }) {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeactivate = () => {
    console.log('Deactivating account...');
    setShowDeactivateModal(false);
  };

  const handleDelete = () => {
    if (confirmText === 'DELETE') {
      console.log('Deleting account...');
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header danger">
        <h2>Account Management</h2>
        <p>Manage your account status</p>
      </div>

      <div className="settings-form">
        {/* Account Status */}
        <div className="form-group-container">
          <h3>Account Status</h3>
          
          <div className="status-info-box">
            <div className="status-icon active">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h4>Account Active</h4>
              <p>Your account is currently active and in good standing</p>
            </div>
          </div>
        </div>

        {/* Deactivate Account */}
        <div className="form-group-container danger-zone-section">
          <h3>Deactivate Account</h3>
          
          <div className="danger-action-card">
            <div className="danger-info">
              <h4>Temporarily Deactivate Account</h4>
              <p>Your account will be hidden and you won't be able to make bookings. You can reactivate it anytime by logging in.</p>
            </div>
            <button 
              className="danger-btn secondary"
              onClick={() => setShowDeactivateModal(true)}
            >
              Deactivate Account
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="form-group-container danger-zone-section">
          <h3>Delete Account</h3>
          
          <div className="danger-action-card critical">
            <div className="danger-info">
              <h4>Permanently Delete Account</h4>
              <p><strong>Warning:</strong> This action cannot be undone. All your data including bookings, wallet balance, and personal information will be permanently deleted.</p>
              <ul className="danger-list">
                <li>All your booking history will be lost</li>
                <li>Your wallet balance will be forfeited</li>
                <li>You won't be able to recover your account</li>
                <li>Active bookings will be cancelled</li>
              </ul>
            </div>
            <button 
              className="danger-btn primary"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Data Export */}
        <div className="form-group-container">
          <h3>Download Your Data</h3>
          
          <div className="export-card">
            <div className="export-info">
              <i className="fas fa-download"></i>
              <div>
                <h4>Export Account Data</h4>
                <p>Download a copy of your account data including bookings, transactions, and profile information</p>
              </div>
            </div>
            <button className="export-btn">
              <i className="fas fa-file-download"></i>
              Request Data Export
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="danger-modal-overlay">
          <div className="danger-modal">
            <div className="modal-header">
              <i className="fas fa-exclamation-triangle warning-icon"></i>
              <h3>Deactivate Account</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to deactivate your account?</p>
              <ul>
                <li>Your profile will be hidden</li>
                <li>You won't be able to make new bookings</li>
                <li>Active bookings will remain active</li>
                <li>You can reactivate anytime by logging in</li>
              </ul>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleDeactivate}
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="danger-modal-overlay">
          <div className="danger-modal critical">
            <div className="modal-header">
              <i className="fas fa-exclamation-circle critical-icon"></i>
              <h3>Delete Account Permanently</h3>
            </div>
            <div className="modal-body">
              <p className="critical-warning">
                <strong>This action is irreversible!</strong> All your data will be permanently deleted.
              </p>
              <div className="confirmation-input">
                <label>Type <strong>DELETE</strong> to confirm:</label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-danger critical"
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE'}
              >
                Delete Account Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}