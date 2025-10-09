import React from 'react';
import '@/styles/dashboard/customer/settings/preferencesSettings.css';

export default function PreferencesSettings({ data, onChange }) {
  const handleToggle = (field) => {
    onChange({ [field]: !data[field] });
  };

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handlePriceRangeChange = (type, value) => {
    onChange({
      priceRange: {
        ...data.priceRange,
        [type]: parseInt(value)
      }
    });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Preferences</h2>
        <p>Customize your experience</p>
      </div>

      <div className="settings-form">
        {/* Regional Settings */}
        <div className="form-group-container">
          <h3>Regional Settings</h3>
          
          <div className="form-group">
            <label>Language</label>
            <select 
              className="setting-select"
              value={data.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="pa">Punjabi</option>
            </select>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select 
              className="setting-select"
              value={data.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Distance Unit</label>
            <select 
              className="setting-select"
              value={data.distanceUnit}
              onChange={(e) => handleInputChange('distanceUnit', e.target.value)}
            >
              <option value="km">Kilometers</option>
              <option value="mi">Miles</option>
            </select>
          </div>
        </div>

        {/* Vehicle Preferences */}
        <div className="form-group-container">
          <h3>Vehicle Preferences</h3>
          
          <div className="form-group">
            <label>Preferred Vehicle Type</label>
            <select 
              className="setting-select"
              value={data.preferredVehicleType}
              onChange={(e) => handleInputChange('preferredVehicleType', e.target.value)}
            >
              <option value="any">Any Type</option>
              <option value="car">Cars Only</option>
              <option value="bike">Bikes/Scooters Only</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Eco-Friendly Only</label>
              <p>Show only electric and hybrid vehicles</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.ecoFriendlyOnly}
                onChange={() => handleToggle('ecoFriendlyOnly')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Instant Booking</label>
              <p>Enable instant booking without owner approval</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.instantBooking}
                onChange={() => handleToggle('instantBooking')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div className="form-group-container">
          <h3>Price Range Preference</h3>
          
          <div className="price-range-container">
            <div className="price-range-values">
              <span className="range-value">₹{data.priceRange.min}</span>
              <span className="range-separator">to</span>
              <span className="range-value">₹{data.priceRange.max}</span>
            </div>

            <div className="price-range-inputs">
              <div className="form-group">
                <label>Minimum Price (per day)</label>
                <div className="input-with-prefix">
                  <span className="prefix">₹</span>
                  <input
                    type="number"
                    value={data.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    min="0"
                    max={data.priceRange.max}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Maximum Price (per day)</label>
                <div className="input-with-prefix">
                  <span className="prefix">₹</span>
                  <input
                    type="number"
                    value={data.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    min={data.priceRange.min}
                    max="50000"
                  />
                </div>
              </div>
            </div>

            <div className="price-range-slider">
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={data.priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="range-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}