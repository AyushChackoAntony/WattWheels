'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import Welcome from '@/components/dashboard/owner/Welcome';
import Stats from '@/components/dashboard/owner/Stats';
import Earning from '@/components/dashboard/owner/Earning';
import CurrentBooking from '@/components/dashboard/owner/CurrentBooking';
import VehicleManagement from '@/components/dashboard/owner/VehicleManagement';
import QuickAction from '@/components/dashboard/owner/QuickAction';

export default function OwnerDashboard() {
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
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <Welcome user={user} />
          {/* Stats Section */}
          <Stats />
          {/* Earnings Overview Section */}
          <Earning />
          {/* Current Bookings Section */}
          <CurrentBooking />
          {/* Vehicle Management Section */}
          <VehicleManagement />
          {/* Quick Actions Section */}
          <QuickAction />
        </div>
      </main>
    </>
  );
}