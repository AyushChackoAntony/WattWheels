import React from 'react';
import '@/styles/dashboard/customer/settings/accountSettings.css';

export default function AccountSettings({ data, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Account Settings</h2>
        <p>Manage your personal information</p>
      </div>

      <div className="settings-form">
        {/* Personal Information */}
        <div className="form-group-container">
          <h3>Personal Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={data.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={data.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={data.phone}
                onChange={handleInputChange}
                placeholder="Enter phone"
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={data.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-group-container">
          <h3>Address Information</h3>
          
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address"
              value={data.address}
              onChange={handleInputChange}
              placeholder="Enter street address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={data.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={data.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={data.postalCode}
                onChange={handleInputChange}
                placeholder="Enter postal code"
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={data.country}
                onChange={handleInputChange}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}