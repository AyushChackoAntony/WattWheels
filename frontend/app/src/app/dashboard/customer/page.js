'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import "./custDash.css";

import Header from '@/components/dashboard/customer/Header';
import Welcome from '@/components/dashboard/customer/Welcome';
import Stats from '@/components/dashboard/customer/Stats';
import QuickBooking from '@/components/dashboard/customer/QuickBooking';
import RecentTrips from '@/components/dashboard/customer/RecentTrips';
import UpcomingBookings from '@/components/dashboard/customer/UpcomingBookings';


export default function CustomerDashboard() {
  // Demo user data
  const user = { firstName: 'Vishnu', lastName: 'Jaswal', email: 'vishnu@example.com' };
  return (
    <>
      <Header user= {user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <Welcome />
          {/* Stats Section */}
          <Stats />
          {/* Quick Booking Section */}
          <QuickBooking />
          {/* Recent Trips Section */}
          <RecentTrips />
          {/* Upcoming Bookings Section */}
          <UpcomingBookings />
          {/* Quick Actions Section */}
          <section className="quick-actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-user"></i></div>
                <h3>Profile</h3>
                <p>Update your personal information</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-cog"></i></div>
                <h3>Settings</h3>
                <p>Manage your account preferences</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-credit-card"></i></div>
                <h3>Payments</h3>
                <p>Manage payment methods</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-headset"></i></div>
                <h3>Support</h3>
                <p>Get help and contact us</p>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
