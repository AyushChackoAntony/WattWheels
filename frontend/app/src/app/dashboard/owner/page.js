'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import Welcome from '@/components/dashboard/owner/Welcome';
import Stats from '@/components/dashboard/owner/Stats';
import Earning from '@/components/dashboard/owner/Earning';
import CurrentBooking from '@/components/dashboard/owner/CurrentBooking';
import VehicleManagement from '@/components/dashboard/owner/VehicleManagement';
import QuickAction from '@/components/dashboard/owner/QuickAction';



export default function OwnerDashboard() {
  // Demo user data
  const user = { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' };
  return (
    <>
      <OwnerHeader user = {user}/>
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <Welcome user = {user}/>
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
