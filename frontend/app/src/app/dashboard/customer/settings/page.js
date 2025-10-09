'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/dashboard/customer/CustomerHeader';
import SettingsHeader from '@/components/dashboard/customer/settings/SettingsHeader';
import AccountSettings from '@/components/dashboard/customer/settings/AccountSettings';
import NotificationSettings from '@/components/dashboard/customer/settings/NotificationSettings';
import SecuritySettings from '@/components/dashboard/customer/settings/SecuritySettings';
import PaymentSettings from '@/components/dashboard/customer/settings/PaymentSettings';
import PreferencesSettings from '@/components/dashboard/customer/settings/PreferencesSettings';
import DangerZone from '@/components/dashboard/customer/settings/DangerZone';
import '@/styles/dashboard/customer/settings/customerSettings.css';

export default function CustomerSettings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Settings data structure
  const [settingsData, setSettingsData] = useState({
    // Account settings
    account: {
      firstName: user?.firstName || 'John',
      lastName: user?.lastName || 'Doe',
      email: user?.email || 'john.doe@email.com',
      phone: '+91 98765 43210',
      dateOfBirth: '1995-03-15',
      address: '123 Green Street, Sector 22, Chandigarh, 160022',
      city: 'Chandigarh',
      state: 'Punjab',
      postalCode: '160022',
      country: 'India'
    },
    
    // Notification settings
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      bookingConfirmations: true,
      bookingReminders: true,
      paymentNotifications: true,
      promotionalEmails: false,
      newVehicles: true,
      priceDrops: true,
      weeklyNewsletter: false
    },
    
    // Security settings
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
      lastPasswordChange: '2024-10-15'
    },
    
    // Payment settings
    payment: {
      defaultPaymentMethod: 'wallet',
      autoAddMoney: false,
      autoAddThreshold: 500,
      autoAddAmount: 1000,
      savedCards: [
        { id: 1, last4: '4242', brand: 'Visa', expiry: '12/25' },
        { id: 2, last4: '5555', brand: 'Mastercard', expiry: '08/26' }
      ]
    },
    
    // Preferences
    preferences: {
      language: 'en',
      currency: 'INR',
      distanceUnit: 'km',
      preferredVehicleType: 'any',
      ecoFriendlyOnly: false,
      instantBooking: true,
      priceRange: { min: 0, max: 10000 }
    }
  });

  const settingsTabs = [
    { id: 'account', label: 'Account', icon: 'fas fa-user' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'payment', label: 'Payment', icon: 'fas fa-credit-card' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-cog' },
    { id: 'danger', label: 'Account Management', icon: 'fas fa-exclamation-triangle' }
  ];

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading settings...
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#ef4444'
      }}>
        Please log in to access settings
      </div>
    );
  }

  // Update settings data
  const updateSettings = (section, newData) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newData
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Save all settings
  const saveAllSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving settings:', settingsData);
      
      setHasUnsavedChanges(false);
      setShowSaveNotification(true);
      
      setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Handle tab change with unsaved changes warning
  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this section?'
      );
      if (!confirmSwitch) {
        return;
      }
      setHasUnsavedChanges(false);
    }
    setActiveTab(tabId);
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <AccountSettings 
            data={settingsData.account}
            onChange={(newData) => updateSettings('account', newData)}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings 
            data={settingsData.notifications}
            onChange={(newData) => updateSettings('notifications', newData)}
          />
        );
      case 'security':
        return (
          <SecuritySettings 
            data={settingsData.security}
            onChange={(newData) => updateSettings('security', newData)}
          />
        );
      case 'payment':
        return (
          <PaymentSettings 
            data={settingsData.payment}
            onChange={(newData) => updateSettings('payment', newData)}
          />
        );
      case 'preferences':
        return (
          <PreferencesSettings 
            data={settingsData.preferences}
            onChange={(newData) => updateSettings('preferences', newData)}
          />
        );
      case 'danger':
        return (
          <DangerZone user={user} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          <SettingsHeader 
            hasUnsavedChanges={hasUnsavedChanges}
            onSaveAll={saveAllSettings}
          />

          <div className="settings-content">
            
            {/* Settings Navigation Sidebar */}
            <div className="settings-sidebar">
              <div className="settings-nav">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <i className={tab.icon}></i>
                    <span>{tab.label}</span>
                    {tab.id === 'danger' && (
                      <span className="danger-indicator">!</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Panel */}
            <div className="settings-panel">
              {renderTabContent()}
            </div>

          </div>

          {/* Save Notification */}
          {showSaveNotification && (
            <div className="save-notification">
              <div className="notification-content">
                <i className="fas fa-check-circle"></i>
                <span>Settings saved successfully!</span>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}