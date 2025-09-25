import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import '@/styles/dashboard/owner/settings/dangerZone.css';

export default function DangerZone({ user }) {
  const { logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeactivateAccount = async () => {
    if (confirmationText !== 'DEACTIVATE') {
      alert('Please type "DEACTIVATE" to confirm');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to deactivate account
      console.log('Deactivating account...');
      
      alert('Account deactivated successfully. You will be logged out.');
      logout();
    } catch (error) {
      console.error('Error deactivating account:', error);
      alert('Failed to deactivate account. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowDeactivateConfirm(false);
      setConfirmationText('');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      alert('Please type "DELETE" to confirm');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to delete account
      console.log('Deleting account...');
      
      alert('Account deleted successfully. You will be logged out.');
      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setConfirmationText('');
    }
  };

  const handleExportData = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would make the actual API call to export user data
      console.log('Exporting user data...');
      
      // Simulate file download
      const blob = new Blob(['Sample user data export...'], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wattwheels-data-export-${user.firstName}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Data export completed! File has been downloaded.');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowDataExport(false);
    }
  };

  return (
    <div className="danger-zone-container">
      <div className="settings-section">
        <div className="section-header danger">
          <h2>Account Management</h2>
          <p>Manage your account data and advanced options</p>
          <div className="danger-warning">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Proceed with caution. These actions cannot be undone.</span>
          </div>
        </div>

        {/* Data Export */}
        <div className="danger-card export">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-download"></i>
            </div>
            <div className="card-info">
              <h3>Export Your Data</h3>
              <p>Download a copy of all your account data, including profile information, vehicle details, bookings, and earnings history.</p>
            </div>
          </div>
          <div className="card-actions">
            <button 
              className="action-btn export-btn"
              onClick={() => setShowDataExport(true)}
              disabled={isProcessing}
            >
              <i className="fas fa-download"></i>
              Export Data
            </button>
          </div>
        </div>

        {/* Account Deactivation */}
        <div className="danger-card warning">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-pause-circle"></i>
            </div>
            <div className="card-info">
              <h3>Deactivate Account</h3>
              <p>Temporarily disable your account. You can reactivate it anytime by logging back in. Your vehicles will be hidden from customers during deactivation.</p>
              <div className="consequences">
                <h4>What happens when you deactivate:</h4>
                <ul>
                  <li>Your vehicles become unavailable for booking</li>
                  <li>Active bookings continue as normal</li>
                  <li>You can reactivate anytime</li>
                  <li>Your data remains safe</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button 
              className="action-btn warning-btn"
              onClick={() => setShowDeactivateConfirm(true)}
              disabled={isProcessing}
            >
              <i className="fas fa-pause"></i>
              Deactivate Account
            </button>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="danger-card danger">
          <div className="card-header">
            <div className="card-icon">
              <i className="fas fa-trash-alt"></i>
            </div>
            <div className="card-info">
              <h3>Delete Account Permanently</h3>
              <p>Permanently delete your WattWheels account. This action is irreversible and will remove all your data from our systems.</p>
              <div className="consequences">
                <h4>What gets deleted permanently:</h4>
                <ul>
                  <li>Your profile and personal information</li>
                  <li>All vehicle listings and details</li>
                  <li>Booking history and customer reviews</li>
                  <li>Earnings history and transaction records</li>
                  <li>All uploaded documents and photos</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button 
              className="action-btn danger-btn"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isProcessing}
            >
              <i className="fas fa-trash"></i>
              Delete Account
            </button>
          </div>
        </div>

        {/* Privacy & Data Information */}
        <div className="info-card">
          <div className="info-header">
            <i className="fas fa-info-circle"></i>
            <h3>Privacy & Data Information</h3>
          </div>
          <div className="info-content">
            <div className="info-grid">
              <div className="info-item">
                <h4>Data Retention</h4>
                <p>We keep your data for 7 years after account deletion for legal and tax purposes.</p>
              </div>
              <div className="info-item">
                <h4>GDPR Rights</h4>
                <p>You have the right to access, rectify, erase, and port your personal data under GDPR.</p>
              </div>
              <div className="info-item">
                <h4>Contact Support</h4>
                <p>Need help with your account? Contact our support team at support@wattwheels.com</p>
              </div>
              <div className="info-item">
                <h4>Privacy Policy</h4>
                <p>Read our <a href="/privacy" target="_blank">Privacy Policy</a> and <a href="/terms" target="_blank">Terms of Service</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export Confirmation */}
      {showDataExport && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Export Your Data</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDataExport(false)}
                disabled={isProcessing}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="export-info">
                <i className="fas fa-download export-icon"></i>
                <h4>Data Export Request</h4>
                <p>We'll prepare a complete export of your account data including:</p>
                <ul>
                  <li>Profile and account information</li>
                  <li>Vehicle listings and specifications</li>
                  <li>Booking history and customer interactions</li>
                  <li>Earnings and transaction records</li>
                  <li>Uploaded documents and photos</li>
                </ul>
                <p className="export-note">
                  <i className="fas fa-clock"></i>
                  This process may take a few moments to complete.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowDataExport(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="btn-export"
                onClick={handleExportData}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Exporting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download"></i>
                    Start Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Confirmation */}
      {showDeactivateConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Deactivate Account</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  setConfirmationText('');
                }}
                disabled={isProcessing}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-content">
                <i className="fas fa-pause-circle warning-icon"></i>
                <h4>Are you sure you want to deactivate your account?</h4>
                <p>Your account will be temporarily disabled, and your vehicles will not be available for booking.</p>
                
                <div className="confirmation-input">
                  <label>Type <strong>"DEACTIVATE"</strong> to confirm:</label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type DEACTIVATE"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  setConfirmationText('');
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="btn-warning"
                onClick={handleDeactivateAccount}
                disabled={isProcessing || confirmationText !== 'DEACTIVATE'}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deactivating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-pause"></i>
                    Deactivate Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>Delete Account Permanently</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmationText('');
                }}
                disabled={isProcessing}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="danger-content">
                <i className="fas fa-exclamation-triangle danger-icon"></i>
                <h4>This action cannot be undone!</h4>
                <p>All your data will be permanently deleted from our systems. This includes:</p>
                <ul>
                  <li>Your profile and account information</li>
                  <li>All vehicle listings</li>
                  <li>Booking and earnings history</li>
                  <li>Customer reviews and ratings</li>
                </ul>
                
                <div className="confirmation-input">
                  <label>Type <strong>"DELETE"</strong> to confirm permanent deletion:</label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type DELETE"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmationText('');
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={isProcessing || confirmationText !== 'DELETE'}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash"></i>
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}