'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

import Header from '@/components/dashboard/customer/CustomerHeader';
import Welcome from '@/components/dashboard/customer/Welcome';
import Stats from '@/components/dashboard/customer/Stats';
import QuickBooking from '@/components/dashboard/customer/QuickBooking';
import RecentTrips from '@/components/dashboard/customer/RecentTrips';
import UpcomingBookings from '@/components/dashboard/customer/UpcomingBookings';
import QuickActions from '@/components/dashboard/customer/QuickActions';

export default function CustomerDashboard() {
  const { user, loading, isAuthenticated } = useAuth();

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
        Loading user data...
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
        Please log in to access the dashboard
      </div>
    );
  }

  return (
    <>
      <Header user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <Welcome user={user} />
          {/* Stats Section */}
          <Stats />
          {/* Quick Booking Section */}
          <QuickBooking />
          {/* Recent Trips Section */}
          <RecentTrips />
          {/* Upcoming Bookings Section */}
          <UpcomingBookings />
          {/* Quick Actions Section */}
          <QuickActions />
        </div>
      </main>
    </>
  );
}