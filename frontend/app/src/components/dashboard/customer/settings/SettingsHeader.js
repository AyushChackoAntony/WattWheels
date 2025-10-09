import React from 'react';
import '@/styles/dashboard/customer/settings/settingsHeader.css';

export default function SettingsHeader({ hasUnsavedChanges, onSaveAll }) {
  return (
    <div className="settings-header-section">
      <div className="settings-header-content">
        <div className="settings-header-info">
          <h1>Settings</h1>
          <p>Manage your account preferences and settings</p>
        </div>
        
        {hasUnsavedChanges && (
          <div className="settings-header-actions">
            <button className="save-all-btn" onClick={onSaveAll}>
              <i className="fas fa-save"></i>
              Save All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}