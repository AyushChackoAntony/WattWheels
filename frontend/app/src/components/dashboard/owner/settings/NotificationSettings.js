import React, { useState } from 'react';
import '@/styles/dashboard/owner/settings/notificationSettings.css';

export default function NotificationSettings({ data, onChange }) {
  const [notificationData, setNotificationData] = useState(data);

  const handleToggle = (setting) => {
    const newData = {
      ...notificationData,
      [setting]: !notificationData[setting]
    };
    setNotificationData(newData);
    onChange(newData);
  };

  const notificationGroups = [
    {
      title: 'Communication Channels',
      description: 'Choose how you want to receive notifications',
      settings: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          icon: 'fas fa-envelope'
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive notifications via text messages',
          icon: 'fas fa-sms'
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive notifications on your device',
          icon: 'fas fa-mobile-alt'
        }
      ]
    },
    {
      title: 'Booking & Payment Alerts',
      description: 'Stay informed about your vehicle bookings and payments',
      settings: [
        {
          key: 'bookingConfirmations',
          label: 'Booking Confirmations',
          description: 'Get notified when bookings are confirmed or cancelled',
          icon: 'fas fa-calendar-check'
        },
        {
          key: 'paymentNotifications',
          label: 'Payment Notifications',
          description: 'Receive alerts for payments and payouts',
          icon: 'fas fa-credit-card'
        },
        {
          key: 'maintenanceReminders',
          label: 'Maintenance Reminders',
          description: 'Get reminded about vehicle maintenance schedules',
          icon: 'fas fa-wrench'
        }
      ]
    },
    {
      title: 'Reports & Updates',
      description: 'Control frequency of reports and feature updates',
      settings: [
        {
          key: 'weeklyReports',
          label: 'Weekly Reports',
          description: 'Receive weekly performance summaries',
          icon: 'fas fa-chart-line'
        },
        {
          key: 'monthlyStatements',
          label: 'Monthly Statements',
          description: 'Get detailed monthly earnings statements',
          icon: 'fas fa-file-invoice'
        },
        {
          key: 'newFeatures',
          label: 'New Features',
          description: 'Be notified about new platform features',
          icon: 'fas fa-star'
        }
      ]
    },
    {
      title: 'Security & Marketing',
      description: 'Security alerts and promotional communications',
      settings: [
        {
          key: 'securityAlerts',
          label: 'Security Alerts',
          description: 'Important security notifications (recommended)',
          icon: 'fas fa-shield-alt',
          important: true
        },
        {
          key: 'marketingEmails',
          label: 'Marketing Emails',
          description: 'Promotional emails and special offers',
          icon: 'fas fa-bullhorn'
        },
        {
          key: 'promotions',
          label: 'Promotions & Deals',
          description: 'Get notified about discounts and special promotions',
          icon: 'fas fa-tags'
        }
      ]
    }
  ];

  const getActiveCount = (groupSettings) => {
    return groupSettings.filter(setting => notificationData[setting.key]).length;
  };

  const toggleAllInGroup = (groupSettings, enable) => {
    const newData = { ...notificationData };
    groupSettings.forEach(setting => {
      if (!setting.important || enable) { // Don't disable important settings
        newData[setting.key] = enable;
      }
    });
    setNotificationData(newData);
    onChange(newData);
  };

  return (
    <div className="notification-settings-container">
      <div className="settings-section">
        <div className="section-header">
          <h2>Notification Preferences</h2>
          <p>Customize how and when you receive notifications</p>
        </div>

        {/* Notification Test */}
        <div className="settings-card test-card">
          <div className="card-header">
            <h3>Test Notifications</h3>
            <p>Send a test notification to verify your settings</p>
          </div>
          <div className="card-content">
            <div className="test-buttons">
              <button className="test-btn email">
                <i className="fas fa-envelope"></i>
                Test Email
              </button>
              <button className="test-btn sms">
                <i className="fas fa-sms"></i>
                Test SMS
              </button>
              <button className="test-btn push">
                <i className="fas fa-mobile-alt"></i>
                Test Push
              </button>
            </div>
          </div>
        </div>

        {/* Notification Groups */}
        {notificationGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="settings-card">
            <div className="card-header">
              <div className="group-info">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <div className="group-controls">
                <span className="active-count">
                  {getActiveCount(group.settings)} of {group.settings.length} enabled
                </span>
                <div className="group-toggle-buttons">
                  <button 
                    className="group-toggle-btn"
                    onClick={() => toggleAllInGroup(group.settings, true)}
                  >
                    Enable All
                  </button>
                  <button 
                    className="group-toggle-btn"
                    onClick={() => toggleAllInGroup(group.settings, false)}
                  >
                    Disable All
                  </button>
                </div>
              </div>
            </div>

            <div className="card-content">
              <div className="notification-list">
                {group.settings.map((setting) => (
                  <div key={setting.key} className="notification-item">
                    <div className="notification-info">
                      <div className="notification-icon">
                        <i className={setting.icon}></i>
                      </div>
                      <div className="notification-details">
                        <h4>
                          {setting.label}
                          {setting.important && (
                            <span className="important-badge">
                              <i className="fas fa-exclamation-circle"></i>
                              Important
                            </span>
                          )}
                        </h4>
                        <p>{setting.description}</p>
                      </div>
                    </div>
                    
                    <div className="notification-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationData[setting.key]}
                          onChange={() => handleToggle(setting.key)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Notification Schedule */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Notification Schedule</h3>
            <p>Set quiet hours and notification frequency</p>
          </div>
          
          <div className="card-content">
            <div className="schedule-settings">
              <div className="schedule-item">
                <label>Quiet Hours</label>
                <div className="time-range">
                  <input type="time" defaultValue="22:00" />
                  <span>to</span>
                  <input type="time" defaultValue="08:00" />
                </div>
                <p className="schedule-note">No notifications during these hours (except emergencies)</p>
              </div>

              <div className="schedule-item">
                <label>Digest Frequency</label>
                <select defaultValue="daily">
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <p className="schedule-note">Group non-urgent notifications together</p>
              </div>

              <div className="schedule-item">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Weekend notifications</span>
                </label>
                <p className="schedule-note">Receive notifications on weekends</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification History */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Recent Notifications</h3>
            <button className="clear-history-btn">
              <i className="fas fa-trash"></i>
              Clear History
            </button>
          </div>
          
          <div className="card-content">
            <div className="notification-history">
              <div className="history-item">
                <div className="history-icon email">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="history-details">
                  <h4>Booking Confirmation</h4>
                  <p>Your Tesla Model 3 has been booked by John Doe</p>
                  <span className="history-time">2 hours ago</span>
                </div>
              </div>

              <div className="history-item">
                <div className="history-icon sms">
                  <i className="fas fa-sms"></i>
                </div>
                <div className="history-details">
                  <h4>Payment Received</h4>
                  <p>Payment of ₹2,500 has been processed</p>
                  <span className="history-time">5 hours ago</span>
                </div>
              </div>

              <div className="history-item">
                <div className="history-icon push">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="history-details">
                  <h4>Maintenance Reminder</h4>
                  <p>Your Ola S1 Pro is due for service</p>
                  <span className="history-time">1 day ago</span>
                </div>
              </div>
            </div>
            
            <button className="view-all-history-btn">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}