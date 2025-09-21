import React, { useState } from 'react';
import '@/styles/dashboard/owner/settings/accountSettings.css';

export default function AccountSettings({ data, onChange }) {
  const [formData, setFormData] = useState(data);
  const [isEditing, setIsEditing] = useState({});
  const [errors, setErrors] = useState({});

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pa', name: 'Punjabi' }
  ];

  const timezones = [
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
    { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
  ];

  const currencies = [
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' }
  ];

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onChange(newFormData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'postalCode':
        const postalRegex = /^\d{6}$/;
        if (!postalRegex.test(value)) {
          newErrors.postalCode = 'Please enter a valid 6-digit postal code';
        } else {
          delete newErrors.postalCode;
        }
        break;
      default:
        if (!value.trim()) {
          newErrors[field] = 'This field is required';
        } else {
          delete newErrors[field];
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleEdit = (section) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="account-settings-container">
      <div className="settings-section">
        <div className="section-header">
          <h2>Account Information</h2>
          <p>Update your personal details and contact information</p>
        </div>

        {/* Personal Information */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Personal Details</h3>
            <button 
              className="edit-toggle-btn"
              onClick={() => toggleEdit('personal')}
            >
              <i className={`fas fa-${isEditing.personal ? 'times' : 'edit'}`}></i>
              {isEditing.personal ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                {isEditing.personal ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'error' : ''}
                  />
                ) : (
                  <div className="form-display">{formData.firstName}</div>
                )}
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label>Last Name</label>
                {isEditing.personal ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'error' : ''}
                  />
                ) : (
                  <div className="form-display">{formData.lastName}</div>
                )}
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                {isEditing.personal ? (
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <div className="form-display">
                    {new Date(formData.dateOfBirth).toLocaleDateString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Contact Information</h3>
            <button 
              className="edit-toggle-btn"
              onClick={() => toggleEdit('contact')}
            >
              <i className={`fas fa-${isEditing.contact ? 'times' : 'edit'}`}></i>
              {isEditing.contact ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-group">
                <label>Email Address</label>
                {isEditing.contact ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={(e) => validateField('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                  />
                ) : (
                  <div className="form-display">
                    {formData.email}
                    <span className="verified-badge">
                      <i className="fas fa-check-circle"></i>
                      Verified
                    </span>
                  </div>
                )}
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                {isEditing.contact ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={(e) => validateField('phone', e.target.value)}
                    className={errors.phone ? 'error' : ''}
                  />
                ) : (
                  <div className="form-display">
                    {formData.phone}
                    <span className="verified-badge">
                      <i className="fas fa-check-circle"></i>
                      Verified
                    </span>
                  </div>
                )}
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Address Information</h3>
            <button 
              className="edit-toggle-btn"
              onClick={() => toggleEdit('address')}
            >
              <i className={`fas fa-${isEditing.address ? 'times' : 'edit'}`}></i>
              {isEditing.address ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Street Address</label>
                {isEditing.address ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows="2"
                  />
                ) : (
                  <div className="form-display">{formData.address}</div>
                )}
              </div>

              <div className="form-group">
                <label>City</label>
                {isEditing.address ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                ) : (
                  <div className="form-display">{formData.city}</div>
                )}
              </div>

              <div className="form-group">
                <label>State</label>
                {isEditing.address ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                ) : (
                  <div className="form-display">{formData.state}</div>
                )}
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                {isEditing.address ? (
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    onBlur={(e) => validateField('postalCode', e.target.value)}
                    className={errors.postalCode ? 'error' : ''}
                  />
                ) : (
                  <div className="form-display">{formData.postalCode}</div>
                )}
                {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
              </div>

              <div className="form-group">
                <label>Country</label>
                {isEditing.address ? (
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  >
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                ) : (
                  <div className="form-display">{formData.country}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Preferences</h3>
            <button 
              className="edit-toggle-btn"
              onClick={() => toggleEdit('preferences')}
            >
              <i className={`fas fa-${isEditing.preferences ? 'times' : 'edit'}`}></i>
              {isEditing.preferences ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-group">
                <label>Language</label>
                {isEditing.preferences ? (
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="form-display">
                    {languages.find(lang => lang.code === formData.language)?.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Timezone</label>
                {isEditing.preferences ? (
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                  >
                    {timezones.map(tz => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="form-display">
                    {timezones.find(tz => tz.value === formData.timezone)?.label}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Currency</label>
                {isEditing.preferences ? (
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="form-display">
                    {currencies.find(curr => curr.code === formData.currency)?.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}