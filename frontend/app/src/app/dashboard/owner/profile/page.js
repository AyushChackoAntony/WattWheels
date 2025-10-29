'use client';
// Import useState and useEffect
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import ProfileHeader from '@/components/dashboard/owner/profile/ProfileHeader';
import PersonalInfo from '@/components/dashboard/owner/profile/PersonalInfo';
import AboutMe from '@/components/dashboard/owner/profile/AboutMe';
import AccountStatus from '@/components/dashboard/owner/profile/AccountStatus';
import RecentActivity from '@/components/dashboard/owner/profile/RecentActivity';
// Import CSS if not global
//import '@/styles/dashboard/owner/profile/ownerProfile.css'; // Make sure styles are imported

export default function OwnerProfile() {
  // Keep useAuth hook
  const { user, loading: authLoading, isAuthenticated, updateUser } = useAuth(); // Destructure updateUser
  const [isEditing, setIsEditing] = useState(false);
  // Initialize formData as null to indicate data hasn't been fetched yet
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  // Add loading state specific to profile data fetching
  const [pageLoading, setPageLoading] = useState(true);

  // *** MOVED showMessage DEFINITION HERE - BEFORE useEffect ***
  // Function to show messages
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    // Auto-dismiss message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

   // --- Fetch Profile Data ---
  useEffect(() => {
    const fetchProfileData = async () => {
      // Check for authentication and user ID before fetching
      if (isAuthenticated && user?.id) {
        setPageLoading(true); // Start loading profile data
        try {
          const token = localStorage.getItem('wattwheels_token'); // Get token
          // Fetch from the updated backend endpoint
          const res = await fetch(`http://127.0.0.1:5000/api/auth/user/${user.id}`, { //
            method: 'GET', //
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Include token
            },
          });
          if (!res.ok) {
             const errorData = await res.json();
             throw new Error(errorData.error || 'Failed to fetch profile data'); //
          }
          const data = await res.json(); //
          // Set fetched data into formData state, using defaults for safety
          setFormData({ //
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            bio: data.bio || '',
            joinDate: data.joinDate || 'N/A', // Use formatted date from backend
            verified: data.verified !== undefined ? data.verified : false, // Overall verified status
            emailVerified: data.emailVerified !== undefined ? data.emailVerified : false,
            phoneVerified: data.phoneVerified !== undefined ? data.phoneVerified : false,
            identityVerified: data.identityVerified !== undefined ? data.identityVerified : false,
            // Add any other fields returned by get_profile_data if needed
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          // showMessage is now accessible
          showMessage(`Could not load profile data: ${error.message}`, 'error');
           // Set default structure on error to prevent render crashes
           setFormData({
            firstName: user?.firstName || '', lastName: user?.lastName || '',
            email: user?.email || '', phone: '', address: '', bio: '', joinDate: 'N/A',
            verified: false, emailVerified: false, phoneVerified: false, identityVerified: false,
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
    // Re-run effect if authentication state or user ID changes
  }, [isAuthenticated, user?.id, authLoading]); // Added user?.id dependency

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle saving the profile
 const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      showMessage('User not identified. Cannot save.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('wattwheels_token'); //
      const res = await fetch(`http://127.0.0.1:5000/api/auth/user/${user.id}`, { //
        method: 'PUT', //
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` //
        },
        body: JSON.stringify({ //
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            bio: formData.bio
        })
      });

      const result = await res.json(); //

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update profile.'); //
      }

      const updatedProfileData = result.user; //
      setFormData({ //
          firstName: updatedProfileData.firstName,
          lastName: updatedProfileData.lastName,
          email: updatedProfileData.email,
          phone: updatedProfileData.phone,
          address: updatedProfileData.address,
          bio: updatedProfileData.bio,
          joinDate: updatedProfileData.joinDate,
          verified: updatedProfileData.verified,
          emailVerified: updatedProfileData.emailVerified,
          phoneVerified: updatedProfileData.phoneVerified,
          identityVerified: updatedProfileData.identityVerified,
      });
      updateUser({ //
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


   // Handle cancelling edit mode - refetch original data to discard changes
  const handleCancelEdit = async () => {
     if (isAuthenticated && user?.id) {
        setPageLoading(true);
        try {
          const token = localStorage.getItem('wattwheels_token'); //
          const res = await fetch(`http://127.0.0.1:5000/api/auth/user/${user.id}`, { //
              headers: { 'Authorization': `Bearer ${token}` } //
          });
          if (!res.ok) throw new Error('Failed to refetch profile data on cancel');
          const data = await res.json(); //
           setFormData({ //
            firstName: data.firstName || '', lastName: data.lastName || '',
            email: data.email || '', phone: data.phone || '',
            address: data.address || '', bio: data.bio || '',
            joinDate: data.joinDate || 'N/A',
            verified: data.verified !== undefined ? data.verified : false,
            emailVerified: data.emailVerified !== undefined ? data.emailVerified : false,
            phoneVerified: data.phoneVerified !== undefined ? data.phoneVerified : false,
            identityVerified: data.identityVerified !== undefined ? data.identityVerified : false,
          });
        } catch (error) {
          console.error("Error refetching profile on cancel:", error);
          showMessage('Could not reset form data.', 'error');
        } finally {
            setPageLoading(false);
            setIsEditing(false);
        }
      } else {
           setIsEditing(false);
      }
  };

  // --- Combined Loading State ---
  if (authLoading || pageLoading || formData === null) {
    return (
      <>
        {user && <OwnerHeader user={user} />}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 80px)', fontSize: '18px', color: '#6b7280' }}>
          Loading profile...
        </div>
      </>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <>
        {/* <OwnerHeader user={null} /> */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#ef4444' }}>
          Please log in to access your profile
        </div>
      </>
    );
  }

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {formData && (
            <>
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
                  <AccountStatus
                     emailVerified={formData.emailVerified} //
                     phoneVerified={formData.phoneVerified} //
                     identityVerified={formData.identityVerified} //
                  />
                  <RecentActivity />
                </div>
              </div>
            </>
          )}
          {message && (
            <div className={`auth-message ${messageType}`} style={{
                position: 'fixed', bottom: '20px', right: '20px',
                zIndex: 1000, minWidth: '300px', maxWidth: '400px',
                boxShadow: 'var(--shadow-lg)'
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