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
          <section className="upcoming-bookings-section">
            <div className="section-header">
              <h2>Upcoming Bookings</h2>
              <Link href="#" className="view-all-link">View All</Link>
            </div>
            <div className="bookings-grid">
              <div className="booking-card">
                <div className="booking-header">
                  <div className="booking-vehicle">
                    <Image src="/images/ev-cars/ather-450x.svg" alt="Ather 450X" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Ather 450X</h4>
                      <span className="booking-date">Dec 20, 2024</span>
                    </div>
                  </div>
                  <div className="booking-status upcoming">Upcoming</div>
                </div>
                <div className="booking-details">
                  <div className="booking-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Mohali</span>
                  </div>
                  <div className="booking-info">
                    <span><i className="fas fa-clock"></i> 10:00 AM</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹600</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn modify">Modify</button>
                  <button className="action-btn cancel">Cancel</button>
                </div>
              </div>
            </div>
          </section>
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
