import React from 'react';
import '@/styles/dashboard/customer/settings/notificationSettings.css';

export default function NotificationSettings({ data, onChange }) {
  const handleToggle = (field) => {
    onChange({ [field]: !data[field] });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Notification Settings</h2>
        <p>Choose how you want to be notified</p>
      </div>

      <div className="settings-form">
        {/* Communication Channels */}
        <div className="form-group-container">
          <h3>Communication Channels</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Email Notifications</label>
              <p>Receive updates via email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>SMS Notifications</label>
              <p>Receive updates via SMS</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Push Notifications</label>
              <p>Receive push notifications on your device</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Booking Notifications */}
        <div className="form-group-container">
          <h3>Booking Notifications</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Booking Confirmations</label>
              <p>Get notified when bookings are confirmed</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.bookingConfirmations}
                onChange={() => handleToggle('bookingConfirmations')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Booking Reminders</label>
              <p>Reminders before your upcoming bookings</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.bookingReminders}
                onChange={() => handleToggle('bookingReminders')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Payment Notifications</label>
              <p>Updates about payments and transactions</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.paymentNotifications}
                onChange={() => handleToggle('paymentNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Marketing Notifications */}
        <div className="form-group-container">
          <h3>Marketing & Updates</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Promotional Emails</label>
              <p>Offers, discounts, and special deals</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.promotionalEmails}
                onChange={() => handleToggle('promotionalEmails')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>New Vehicles</label>
              <p>Notifications about newly added vehicles</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.newVehicles}
                onChange={() => handleToggle('newVehicles')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Price Drops</label>
              <p>Get notified about price reductions</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.priceDrops}
                onChange={() => handleToggle('priceDrops')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Weekly Newsletter</label>
              <p>Curated content and platform updates</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.weeklyNewsletter}
                onChange={() => handleToggle('weeklyNewsletter')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}