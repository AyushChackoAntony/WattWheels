import React, { useState } from 'react';
import '@/styles/dashboard/owner/settings/vehiclePreferences.css';

export default function VehiclePreferences({ data, onChange }) {
  const [preferencesData, setPreferencesData] = useState(data);

  const handlePreferenceUpdate = (field, value) => {
    const newData = { ...preferencesData, [field]: value };
    setPreferencesData(newData);
    onChange(newData);
  };

  const cancellationPolicies = [
    { value: 'flexible', label: 'Flexible', desc: 'Free cancellation up to 24 hours before booking' },
    { value: 'moderate', label: 'Moderate', desc: 'Free cancellation up to 5 days, then 50% refund' },
    { value: 'strict', label: 'Strict', desc: 'Free cancellation up to 7 days, then no refund' }
  ];

  const bookingDurations = [
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 4, label: '4 hours' },
    { value: 8, label: '8 hours' },
    { value: 24, label: '1 day' },
    { value: 48, label: '2 days' }
  ];

  const maxDurations = [
    { value: 24, label: '1 day' },
    { value: 48, label: '2 days' },
    { value: 72, label: '3 days' },
    { value: 168, label: '1 week' },
    { value: 720, label: '1 month' }
  ];

  const bufferTimes = [
    { value: 0, label: 'No buffer' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' }
  ];

  return (
    <div className="vehicle-preferences-container">
      <div className="settings-section">
        <div className="section-header">
          <h2>Vehicle Preferences</h2>
          <p>Configure default settings for all your vehicles</p>
        </div>

        {/* Availability Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Default Availability</h3>
            <p>Set default availability for new vehicles</p>
          </div>
          
          <div className="card-content">
            <div className="preference-setting">
              <div className="setting-info">
                <h4>Make vehicles available by default</h4>
                <p>New vehicles will be automatically available for booking</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferencesData.defaultAvailability}
                  onChange={(e) => handlePreferenceUpdate('defaultAvailability', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-setting">
              <div className="setting-info">
                <h4>Allow instant booking</h4>
                <p>Customers can book your vehicles instantly without approval</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferencesData.allowInstantBooking}
                  onChange={(e) => handlePreferenceUpdate('allowInstantBooking', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-setting">
              <div className="setting-info">
                <h4>Auto-accept bookings</h4>
                <p>Automatically approve booking requests</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferencesData.autoAcceptBookings}
                  onChange={(e) => handlePreferenceUpdate('autoAcceptBookings', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Booking Duration Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Booking Duration</h3>
            <p>Set minimum and maximum booking durations</p>
          </div>
          
          <div className="card-content">
            <div className="duration-settings">
              <div className="duration-setting">
                <label>Minimum Booking Duration</label>
                <select
                  value={preferencesData.minimumBookingDuration}
                  onChange={(e) => handlePreferenceUpdate('minimumBookingDuration', parseInt(e.target.value))}
                  className="duration-select"
                >
                  {bookingDurations.map(duration => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
                <p className="setting-note">Shortest time customers can book your vehicles</p>
              </div>

              <div className="duration-setting">
                <label>Maximum Booking Duration</label>
                <select
                  value={preferencesData.maximumBookingDuration}
                  onChange={(e) => handlePreferenceUpdate('maximumBookingDuration', parseInt(e.target.value))}
                  className="duration-select"
                >
                  {maxDurations.map(duration => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
                <p className="setting-note">Longest time customers can book your vehicles</p>
              </div>

              <div className="duration-setting">
                <label>Buffer Time Between Bookings</label>
                <select
                  value={preferencesData.bufferTime}
                  onChange={(e) => handlePreferenceUpdate('bufferTime', parseInt(e.target.value))}
                  className="duration-select"
                >
                  {bufferTimes.map(buffer => (
                    <option key={buffer.value} value={buffer.value}>
                      {buffer.label}
                    </option>
                  ))}
                </select>
                <p className="setting-note">Time between bookings for cleaning and maintenance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Deposits */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Security & Deposits</h3>
            <p>Manage security deposits and requirements</p>
          </div>
          
          <div className="card-content">
            <div className="security-settings">
              <div className="preference-setting">
                <div className="setting-info">
                  <h4>Require security deposit</h4>
                  <p>Customers must pay a refundable security deposit</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferencesData.requireSecurityDeposit}
                    onChange={(e) => handlePreferenceUpdate('requireSecurityDeposit', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {preferencesData.requireSecurityDeposit && (
                <div className="deposit-amount-setting">
                  <label>Security Deposit Amount</label>
                  <div className="amount-input">
                    <span className="currency-symbol">₹</span>
                    <input
                      type="number"
                      value={preferencesData.securityDepositAmount}
                      onChange={(e) => handlePreferenceUpdate('securityDepositAmount', parseInt(e.target.value))}
                      min="1000"
                      step="500"
                    />
                  </div>
                  <p className="setting-note">Default security deposit amount for all vehicles</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Cancellation Policy</h3>
            <p>Choose your default cancellation policy</p>
          </div>
          
          <div className="card-content">
            <div className="cancellation-policies">
              {cancellationPolicies.map(policy => (
                <div 
                  key={policy.value}
                  className={`policy-option ${preferencesData.cancellationPolicy === policy.value ? 'selected' : ''}`}
                  onClick={() => handlePreferenceUpdate('cancellationPolicy', policy.value)}
                >
                  <div className="policy-radio">
                    <input 
                      type="radio" 
                      name="cancellationPolicy"
                      value={policy.value}
                      checked={preferencesData.cancellationPolicy === policy.value}
                      onChange={() => handlePreferenceUpdate('cancellationPolicy', policy.value)}
                    />
                  </div>
                  <div className="policy-info">
                    <h4>{policy.label}</h4>
                    <p>{policy.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Fees */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Additional Fees</h3>
            <p>Set default additional charges</p>
          </div>
          
          <div className="card-content">
            <div className="fee-settings">
              <div className="fee-setting">
                <label>Cleaning Fee</label>
                <div className="fee-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    value={preferencesData.cleaningFee}
                    onChange={(e) => handlePreferenceUpdate('cleaningFee', parseInt(e.target.value))}
                    min="0"
                    step="50"
                  />
                </div>
                <p className="setting-note">One-time cleaning fee charged per booking</p>
              </div>

              <div className="fee-setting">
                <label>Late Return Fee</label>
                <div className="fee-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    defaultValue="100"
                    min="0"
                    step="50"
                  />
                  <span className="fee-unit">/hour</span>
                </div>
                <p className="setting-note">Hourly fee for late returns beyond grace period</p>
              </div>

              <div className="fee-setting">
                <label>Fuel/Charging Fee</label>
                <div className="fee-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    defaultValue="5"
                    min="0"
                    step="1"
                  />
                  <span className="fee-unit">/km</span>
                </div>
                <p className="setting-note">Additional fee if vehicle is returned with low fuel/charge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Rules */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Booking Rules</h3>
            <p>Set rules and requirements for bookings</p>
          </div>
          
          <div className="card-content">
            <div className="booking-rules">
              <div className="rule-item">
                <div className="rule-header">
                  <h4>Driver Requirements</h4>
                </div>
                <div className="rule-options">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Valid driving license required</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Minimum age 21 years</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Minimum 2 years driving experience</span>
                  </label>
                </div>
              </div>

              <div className="rule-item">
                <div className="rule-header">
                  <h4>Vehicle Usage</h4>
                </div>
                <div className="rule-options">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>No smoking in vehicles</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>No pets allowed</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>No interstate travel</span>
                  </label>
                </div>
              </div>

              <div className="rule-item">
                <div className="rule-header">
                  <h4>Documentation</h4>
                </div>
                <div className="rule-options">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Photo ID verification required</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Address proof required</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Emergency contact required</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Settings Preview</h3>
            <p>How these settings will appear to customers</p>
          </div>
          
          <div className="card-content">
            <div className="settings-preview">
              <div className="preview-section">
                <h4>Booking Details</h4>
                <ul>
                  <li>Minimum duration: {bookingDurations.find(d => d.value === preferencesData.minimumBookingDuration)?.label}</li>
                  <li>Maximum duration: {maxDurations.find(d => d.value === preferencesData.maximumBookingDuration)?.label}</li>
                  <li>Instant booking: {preferencesData.allowInstantBooking ? 'Available' : 'Not available'}</li>
                  <li>Buffer time: {bufferTimes.find(b => b.value === preferencesData.bufferTime)?.label}</li>
                </ul>
              </div>

              <div className="preview-section">
                <h4>Fees & Deposits</h4>
                <ul>
                  <li>Security deposit: {preferencesData.requireSecurityDeposit ? `₹${preferencesData.securityDepositAmount}` : 'Not required'}</li>
                  <li>Cleaning fee: ₹{preferencesData.cleaningFee}</li>
                  <li>Cancellation policy: {cancellationPolicies.find(p => p.value === preferencesData.cancellationPolicy)?.label}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}