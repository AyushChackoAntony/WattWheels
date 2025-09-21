'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import SettingsHeader from '@/components/dashboard/owner/settings/SettingsHeader';
import AccountSettings from '@/components/dashboard/owner/settings/AccountSettings';
import NotificationSettings from '@/components/dashboard/owner/settings/NotificationSettings';
import SecuritySettings from '@/components/dashboard/owner/settings/SecuritySettings';
import PaymentSettings from '@/components/dashboard/owner/settings/PaymentSettings';
import VehiclePreferences from '@/components/dashboard/owner/settings/VehiclePreferences';
import DangerZone from '@/components/dashboard/owner/settings/DangerZone';
import '@/styles/dashboard/owner/ownerDash.css';
import '@/styles/dashboard/owner/settings/settings-shared.css';

export default function OwnerSettings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Settings data structure
  const [settingsData, setSettingsData] = useState({
    // Account settings
    account: {
      firstName: user?.firstName || 'Sarah',
      lastName: user?.lastName || 'Johnson',
      email: user?.email || 'sarah.johnson@email.com',
      phone: '+91 98765 43210',
      dateOfBirth: '1990-05-15',
      address: '123 Main Street, Sector 17, Chandigarh, 160017',
      city: 'Chandigarh',
      state: 'Punjab',
      postalCode: '160017',
      country: 'India',
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    },
    
    // Notification settings
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      bookingConfirmations: true,
      paymentNotifications: true,
      maintenanceReminders: true,
      marketingEmails: false,
      weeklyReports: true,
      monthlyStatements: true,
      securityAlerts: true,
      newFeatures: true,
      promotions: false
    },
    
    // Security settings
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
      allowedDevices: [],
      lastPasswordChange: '2024-10-15',
      securityQuestions: []
    },
    
    // Payment settings
    payment: {
      defaultPaymentMethod: 'bank_transfer',
      autoPayouts: false,
      payoutThreshold: 5000,
      payoutFrequency: 'weekly',
      taxId: 'ABCDE1234F',
      gstNumber: '07ABCDE1234F1Z5',
      bankDetails: {
        accountNumber: '****1234',
        ifscCode: 'HDFC0001234',
        accountHolder: 'Sarah Johnson',
        bankName: 'HDFC Bank'
      }
    },
    
    // Vehicle preferences
    vehicles: {
      defaultAvailability: true,
      autoAcceptBookings: false,
      minimumBookingDuration: 4,
      maximumBookingDuration: 168,
      bufferTime: 30,
      allowInstantBooking: true,
      requireSecurityDeposit: true,
      securityDepositAmount: 5000,
      cancellationPolicy: 'flexible',
      cleaningFee: 200
    }
  });

  const settingsTabs = [
    { id: 'account', label: 'Account', icon: 'fas fa-user' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'payment', label: 'Payment', icon: 'fas fa-credit-card' },
    { id: 'vehicles', label: 'Vehicle Preferences', icon: 'fas fa-car' },
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make actual API calls to save settings
      console.log('Saving settings:', settingsData);
      
      setHasUnsavedChanges(false);
      setShowSaveNotification(true);
      
      // Hide notification after 3 seconds
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
      case 'vehicles':
        return (
          <VehiclePreferences 
            data={settingsData.vehicles}
            onChange={(newData) => updateSettings('vehicles', newData)}
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
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* Settings Header */}
          <SettingsHeader 
            hasUnsavedChanges={hasUnsavedChanges}
            onSaveAll={saveAllSettings}
          />

          {/* Settings Content */}
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