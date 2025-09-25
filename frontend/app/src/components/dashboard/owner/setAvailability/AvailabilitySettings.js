import React, { useState } from 'react';
import '@/styles/dashboard/owner/setAvailability/availabilitySettings.css';

export default function AvailabilitySettings({ settings, onSettingsUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (field, value) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
    onSettingsUpdate(newSettings);
  };

  const handleOperatingHoursChange = (type, value) => {
    const newOperatingHours = { ...localSettings.operatingHours, [type]: value };
    handleSettingChange('operatingHours', newOperatingHours);
  };

  const handleOperatingDayToggle = (day) => {
    const newOperatingDays = localSettings.operatingDays.includes(day)
      ? localSettings.operatingDays.filter(d => d !== day)
      : [...localSettings.operatingDays, day];
    handleSettingChange('operatingDays', newOperatingDays);
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="availability-settings-section">
      <div className="settings-header">
        <h3>Default Availability Settings</h3>
        <button 
          className="expand-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          {isExpanded ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>

      {isExpanded && (
        <div className="settings-content">
          
          {/* Basic Settings */}
          <div className="settings-group">
            <h4>Basic Settings</h4>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Make vehicles available by default</label>
                <p>New vehicles will automatically be available for booking</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={localSettings.makeAvailableByDefault}
                  onChange={(e) => handleSettingChange('makeAvailableByDefault', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Allow same-day booking</label>
                <p>Customers can book vehicles for today</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={localSettings.allowSameDayBooking}
                  onChange={(e) => handleSettingChange('allowSameDayBooking', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Buffer time between bookings</label>
                <p>Time gap between consecutive bookings</p>
              </div>
              <select
                value={localSettings.bufferTimeBetweenBookings}
                onChange={(e) => handleSettingChange('bufferTimeBetweenBookings', parseInt(e.target.value))}
                className="setting-select"
              >
                <option value={0}>No buffer</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Advance booking limit</label>
                <p>How far in advance customers can book</p>
              </div>
              <select
                value={localSettings.advanceBookingLimit}
                onChange={(e) => handleSettingChange('advanceBookingLimit', parseInt(e.target.value))}
                className="setting-select"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>6 months</option>
                <option value={365}>1 year</option>
              </select>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="settings-group">
            <h4>Operating Hours</h4>
            
            <div className="operating-hours">
              <div className="time-input-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={localSettings.operatingHours.start}
                  onChange={(e) => handleOperatingHoursChange('start', e.target.value)}
                />
              </div>
              <div className="time-input-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={localSettings.operatingHours.end}
                  onChange={(e) => handleOperatingHoursChange('end', e.target.value)}
                />
              </div>
            </div>
            
            <p className="time-note">
              Vehicles will only be available for booking during these hours
            </p>
          </div>

          {/* Operating Days */}
          <div className="settings-group">
            <h4>Operating Days</h4>
            
            <div className="operating-days">
              {daysOfWeek.map(day => (
                <label key={day.key} className="day-checkbox">
                  <input
                    type="checkbox"
                    checked={localSettings.operatingDays.includes(day.key)}
                    onChange={() => handleOperatingDayToggle(day.key)}
                  />
                  <span className="day-label">{day.label}</span>
                </label>
              ))}
            </div>
            
            <p className="days-note">
              Select the days when your vehicles are available for booking
            </p>
          </div>

          {/* Quick Presets */}
          <div className="settings-group">
            <h4>Quick Presets</h4>
            
            <div className="preset-buttons">
              <button 
                className="preset-btn"
                onClick={() => {
                  const businessHours = {
                    ...localSettings,
                    operatingHours: { start: '09:00', end: '17:00' },
                    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                    allowSameDayBooking: false,
                    bufferTimeBetweenBookings: 60
                  };
                  setLocalSettings(businessHours);
                  onSettingsUpdate(businessHours);
                }}
              >
                <i className="fas fa-briefcase"></i>
                Business Hours
              </button>
              
              <button 
                className="preset-btn"
                onClick={() => {
                  const extendedHours = {
                    ...localSettings,
                    operatingHours: { start: '06:00', end: '22:00' },
                    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                    allowSameDayBooking: true,
                    bufferTimeBetweenBookings: 30
                  };
                  setLocalSettings(extendedHours);
                  onSettingsUpdate(extendedHours);
                }}
              >
                <i className="fas fa-clock"></i>
                Extended Hours
              </button>
              
              <button 
                className="preset-btn"
                onClick={() => {
                  const twentyFourSeven = {
                    ...localSettings,
                    operatingHours: { start: '00:00', end: '23:59' },
                    operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                    allowSameDayBooking: true,
                    bufferTimeBetweenBookings: 15
                  };
                  setLocalSettings(twentyFourSeven);
                  onSettingsUpdate(twentyFourSeven);
                }}
              >
                <i className="fas fa-globe"></i>
                24/7 Available
              </button>
            </div>
          </div>

          {/* Settings Summary */}
          <div className="settings-summary">
            <h4>Current Settings Summary</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Operating Hours:</span>
                <span className="summary-value">
                  {localSettings.operatingHours.start} - {localSettings.operatingHours.end}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Operating Days:</span>
                <span className="summary-value">
                  {localSettings.operatingDays.length} days/week
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Buffer Time:</span>
                <span className="summary-value">
                  {localSettings.bufferTimeBetweenBookings === 0 
                    ? 'No buffer' 
                    : `${localSettings.bufferTimeBetweenBookings} minutes`}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Advance Booking:</span>
                <span className="summary-value">
                  {localSettings.advanceBookingLimit} days
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}