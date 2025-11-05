'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import SettingsHeader from '@/components/dashboard/owner/settings/SettingsHeader';
import AccountSettings from '@/components/dashboard/owner/settings/AccountSettings';
import NotificationSettings from '@/components/dashboard/owner/settings/NotificationSettings';
import SecuritySettings from '@/components/dashboard/owner/settings/SecuritySettings';
import PaymentSettings from '@/components/dashboard/owner/settings/PaymentSettings';
import VehiclePreferences from '@/components/dashboard/owner/settings/VehiclePreferences';
import DangerZone from '@/components/dashboard/owner/settings/DangerZone';
import '@/styles/dashboard/customer/settings/customerSettings.css';

export default function OwnerSettings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [settingsData, setSettingsData] = useState(null);

  const getDefaultSettings = () => ({
    account: {
      firstName: user.firstName, lastName: user.lastName, email: user.email,
      dateOfBirth: '1990-01-01', phone: '', address: '', city: '',
      state: '', postalCode: '', country: 'India', language: 'en',
      timezone: 'Asia/Kolkata', currency: 'INR',
    },
    notifications: {
      emailNotifications: true, smsNotifications: true, pushNotifications: true,
      bookingConfirmations: true, paymentNotifications: true, maintenanceReminders: true,
      marketingEmails: false, weeklyReports: true, monthlyStatements: true,
      securityAlerts: true, newFeatures: true, promotions: false
    },
    payment: {
      bankDetails: { accountHolder: 'N/A', accountNumber: '****', ifscCode: 'N/A', bankName: 'N/A' },
      defaultPaymentMethod: 'bank_transfer', autoPayouts: false,
      payoutThreshold: 5000, payoutFrequency: 'weekly',
      taxId: 'N/A', gstNumber: ''
    },
    security: {
      lastPasswordChange: new Date().toISOString(), twoFactorEnabled: false,
      sessionTimeout: 30, loginAlerts: true
    },
    vehicles: {
      defaultAvailability: true, allowInstantBooking: true, autoAcceptBookings: false,
      minimumBookingDuration: 4, maximumBookingDuration: 168, bufferTime: 30,
      requireSecurityDeposit: true, securityDepositAmount: 2000,
      cancellationPolicy: 'flexible', cleaningFee: 0
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (user && user.id) {
        const defaultSettings = getDefaultSettings();
        try {
          const token = localStorage.getItem('wattwheels_token');
          if (!token) {
            throw new Error("Authentication token not found.");
          }
          
          const res = await fetch(`http://127.0.0.1:5000/api/settings/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            const combinedData = {
              ...defaultSettings,
              account: {
                ...defaultSettings.account,
                ...(data.account || {}),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              },
              notifications: {
                ...defaultSettings.notifications,
                ...(data.notifications || {}),
              },
              payment: {
                ...defaultSettings.payment,
                ...(data.payment || {}),
                bankDetails: {
                  ...defaultSettings.payment.bankDetails,
                  ...(data.payment?.bankDetails || {}),
                },
              },
              security: {
                ...defaultSettings.security,
                ...(data.security || {}),
              },
              vehicles: {
                ...defaultSettings.vehicles,
                ...(data.vehicles || {}),
              },
            };
            setSettingsData(combinedData);
          } else {
            console.error("Failed to fetch settings, using defaults.");
            setSettingsData(defaultSettings);
          }
        } catch (error) {
          console.error("Error fetching settings:", error.message);
          setSettingsData(defaultSettings);
        }
      }
    };
    
    if (isAuthenticated) {
      fetchSettings();
    } else if (!loading) {
      setSettingsData(false);
    }
  }, [user, isAuthenticated, loading]);


  const settingsTabs = [
    { id: 'account', label: 'Account', icon: 'fas fa-user' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'payment', label: 'Payment', icon: 'fas fa-credit-card' },
    { id: 'vehicles', label: 'Vehicle Preferences', icon: 'fas fa-car' },
    { id: 'danger', label: 'Account Management', icon: 'fas fa-exclamation-triangle' }
  ];
  
  const activeTabInfo = settingsTabs.find(tab => tab.id === activeTab) || settingsTabs[0];

  if (loading || settingsData === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        Loading settings...
      </div>
    );
  }

  if (!isAuthenticated || !user || settingsData === false) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        Please log in to access settings
      </div>
    );
  }

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

  const saveAllSettings = async () => {
    try {
      const token = localStorage.getItem('wattwheels_token');
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const res = await fetch(`http://127.0.0.1:5000/api/settings/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsData)
      });

      const result = await res.json();
      
      if (res.ok) {
        setHasUnsavedChanges(false);
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(error.message);
    }
  };

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
          
          <SettingsHeader 
            hasUnsavedChanges={hasUnsavedChanges}
            onSaveAll={saveAllSettings}
          />

          <div className="settings-content">
            
            <div className="settings-sidebar">
              <div className="settings-nav owner-nav">
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

            <div className="settings-panel">
              <div className="settings-panel-header">
                <h2>{activeTabInfo.label}</h2>
              </div>
              <div className="settings-panel-content">
                {renderTabContent()}
              </div>
            </div>

          </div>

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