// frontend/app/src/app/dashboard/customer/profile/page.js
'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/dashboard/customer/Header';
import ProfileHeader from '@/components/dashboard/customer/profile/ProfileHeader';
import PersonalInfo from '@/components/dashboard/customer/profile/PersonalInfo';
import AboutMe from '@/components/dashboard/customer/profile/AboutMe';
import AccountStatus from '@/components/dashboard/customer/profile/AccountStatus';
import RecentActivity from '@/components/dashboard/customer/profile/RecentActivity';
import '@/styles/dashboard/customer/profile/customerProfile.css';

export default function CustomerProfile() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@email.com',
    phone: '+91 98765 43210',
    address: '123 Green Street, Sector 22, Chandigarh, 160022',
    bio: 'Eco-conscious traveler who loves exploring new places with electric vehicles. Passionate about sustainable transportation and reducing carbon footprint.',
    joinDate: 'January 15, 2024',
    verified: true
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

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
        Loading profile...
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
        Please log in to access your profile
      </div>
    );
  }

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically make an API call to update the profile
      // const response = await fetch('/api/updateProfile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      showMessage('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      showMessage('Failed to update profile. Please try again.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: user?.firstName || 'John',
      lastName: user?.lastName || 'Doe',
      email: user?.email || 'john.doe@email.com',
      phone: '+91 98765 43210',
      address: '123 Green Street, Sector 22, Chandigarh, 160022',
      bio: 'Eco-conscious traveler who loves exploring new places with electric vehicles. Passionate about sustainable transportation and reducing carbon footprint.',
      joinDate: 'January 15, 2024',
      verified: true
    });
  };

  return (
    <>
      <Header user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <ProfileHeader 
            formData={formData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
          
          <div className="profile-content-section">
            <div className="profile-content-grid">
              <PersonalInfo 
                formData={formData}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              
              <AboutMe 
                formData={formData}
                isEditing={isEditing}
                onChange={handleInputChange}
              />
              
              <AccountStatus formData={formData} />
              
              <RecentActivity />
            </div>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className={`auth-message ${messageType}`} style={{ 
              position: 'fixed', 
              top: '100px', 
              right: '20px', 
              zIndex: 1000,
              minWidth: '300px'
            }}>
              <i className={`fas fa-${messageType === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              <span>{message}</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
}