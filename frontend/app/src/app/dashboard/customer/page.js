'use client';
import React from 'react';

import Header from '@/components/dashboard/customer/Header';
import Welcome from '@/components/dashboard/customer/Welcome';
import Stats from '@/components/dashboard/customer/Stats';
import QuickBooking from '@/components/dashboard/customer/QuickBooking';
import RecentTrips from '@/components/dashboard/customer/RecentTrips';
import UpcomingBookings from '@/components/dashboard/customer/UpcomingBookings';
import QuickActions from '@/components/dashboard/customer/QuickActions';


export default function CustomerDashboard() {
  // Demo user data
  const user = { firstName: 'Vishnu', lastName: 'Jaswal', email: 'vishnu@example.com' };
  return (
    <>
      <Header user= {user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <Welcome user = {user}/>
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
