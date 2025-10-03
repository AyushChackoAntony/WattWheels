'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import ProfileHeader from '@/components/dashboard/owner/profile/ProfileHeader';
import PersonalInfo from '@/components/dashboard/owner/profile/PersonalInfo';
import AboutMe from '@/components/dashboard/owner/profile/AboutMe';
import AccountStatus from '@/components/dashboard/owner/profile/AccountStatus';
import RecentActivity from '@/components/dashboard/owner/profile/RecentActivity';

export default function OwnerProfile() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Sarah',
    lastName: user?.lastName || 'Johnson',
    email: user?.email || 'sarah.johnson@email.com',
    phone: '+1 234 567 8900',
    address: '123 Main Street, Anytown, AT 12345',
    bio: 'Passionate about sustainable transportation and electric vehicles. I own and rent out premium EVs to help build a greener future.',
    joinDate: 'January 15, 2023',
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
      const response = await fetch(`http://127.0.0.1:5000/api/auth/user/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // Update user context with new data from backend
        updateUser(result.user);
        showMessage('Profile updated successfully!', 'success');
        setIsEditing(false);
      } else {
        throw new Error(result.error || 'Failed to update profile.');
      }
    } catch (error) {
      showMessage('Failed to update profile. Please try again.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        joinDate: user.joinDate,
        verified: user.verified
    });
  };
  
  return (
    <>
      <OwnerHeader user={user} />
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