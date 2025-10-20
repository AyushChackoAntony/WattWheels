// frontend/app/src/app/dashboard/customer/profile/page.js
'use client';
import React, { useState, useEffect } from 'react'; 
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/dashboard/customer/CustomerHeader';
import ProfileHeader from '@/components/dashboard/customer/profile/ProfileHeader';
import PersonalInfo from '@/components/dashboard/customer/profile/PersonalInfo';
import AboutMe from '@/components/dashboard/customer/profile/AboutMe';
import AccountStatus from '@/components/dashboard/customer/profile/AccountStatus';
import RecentActivity from '@/components/dashboard/customer/profile/RecentActivity';
import '@/styles/dashboard/customer/profile/customerProfile.css';

export default function CustomerProfile() {
  const { user, loading: authLoading, isAuthenticated, updateUser } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null); 
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [pageLoading, setPageLoading] = useState(true); 

  // --- Fetch Profile Data ---
  useEffect(() => {
    const fetchProfileData = async () => {
      if (isAuthenticated && user?.id) {
        setPageLoading(true); 
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/auth/user/${user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add Authorization header if using JWT:
              // 'Authorization': `Bearer ${localStorage.getItem('wattwheels_token')}`
            },
          });
          if (!res.ok) {
            throw new Error('Failed to fetch profile data');
          }
          const data = await res.json();
          setFormData({ // Set fetched data into formData
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            bio: data.bio || '', // Use fetched bio
            joinDate: data.joinDate || 'N/A', // Use fetched joinDate
            verified: data.verified !== undefined ? data.verified : true // Use fetched verified status
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          showMessage('Could not load profile data.', 'error');
           // Set default data on error to prevent crashes
           setFormData({
            firstName: user?.firstName || 'John',
            lastName: user?.lastName || 'Doe',
            email: user?.email || 'john.doe@email.com',
            phone: '', address: '', bio: '', joinDate: 'N/A', verified: true
          });
        } finally {
          setPageLoading(false); // Finish loading profile data
        }
      } else if (!authLoading && !isAuthenticated) {
          // If auth finished and user is not authenticated, stop page loading
          setPageLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, user?.id, authLoading]); // Rerun when auth state or user ID changes

  // --- Combined Loading State ---
   // Show loading if either auth is loading or profile data is loading
  if (authLoading || pageLoading || formData === null) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontSize: '18px', color: '#6b7280'
      }}>
        Loading profile...
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontSize: '18px', color: '#ef4444'
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
    if (!user?.id) {
      showMessage('User not identified. Cannot save.', 'error');
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('wattwheels_token')}`
        },
        body: JSON.stringify(formData) 
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      const updatedProfileData = result.user;
      setFormData({ 
          firstName: updatedProfileData.firstName,
          lastName: updatedProfileData.lastName,
          email: updatedProfileData.email,
          phone: updatedProfileData.phone,
          address: updatedProfileData.address,
          bio: updatedProfileData.bio,
          joinDate: updatedProfileData.joinDate,
          verified: updatedProfileData.verified
      });
      updateUser({ 
        ...user, 
        firstName: updatedProfileData.firstName,
        lastName: updatedProfileData.lastName,
        email: updatedProfileData.email 
      });

      showMessage('Profile updated successfully!', 'success');
      setIsEditing(false);

    } catch (error) {
      console.error("Save profile error:", error);
      showMessage(error.message || 'Failed to update profile. Please try again.', 'error');
    }
  };

  const handleCancelEdit = async () => {

     if (isAuthenticated && user?.id) {
        setPageLoading(true);
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/auth/user/${user.id}`);
          if (!res.ok) throw new Error('Failed to refetch profile data');
          const data = await res.json();
          setFormData({
            firstName: data.firstName || '', lastName: data.lastName || '',
            email: data.email || '', phone: data.phone || '',
            address: data.address || '', bio: data.bio || '',
            joinDate: data.joinDate || 'N/A', verified: data.verified !== undefined ? data.verified : true
          });
        } catch (error) {
          console.error("Error refetching profile on cancel:", error);
          showMessage('Could not reset form data.', 'error');
        } finally {
            setPageLoading(false);
            setIsEditing(false); // Exit editing mode regardless of fetch success/fail
        }
      } else {
           setIsEditing(false); 
      }
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

          {message && (
            <div className={`auth-message ${messageType}`} style={{
              position: 'fixed', top: '100px', right: '20px',
              zIndex: 1000, minWidth: '300px'
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