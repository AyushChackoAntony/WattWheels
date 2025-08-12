'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import "./ownerDash.css";

export default function OwnerDashboard() {
  // Demo user data
  const user = { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com' };
  return (
    <>
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <i className="fas fa-bolt"></i>
              <span>WattWheels</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="user-info">
                <Image src="/images/avatar.png" alt="Owner Avatar" className="user-avatar" width={40} height={40} />
                <div className="user-details">
                  <span className="user-name">{user.firstName} {user.lastName}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="dropdown-menu">
                <Link href="#"><i className="fas fa-user"></i> Profile</Link>
                <Link href="#"><i className="fas fa-cog"></i> Settings</Link>
                <Link href="#"><i className="fas fa-car"></i> My Vehicles</Link>
                <Link href="#"><i className="fas fa-wallet"></i> Earnings</Link>
                <button className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h1>Welcome back, {user.firstName}! 👋</h1>
              <p>Your EVs are helping people go green!</p>
            </div>
            <div className="quick-actions">
              <Link href="#" className="quick-action-btn">
                <i className="fas fa-car"></i> Manage Vehicles
              </Link>
              <Link href="#" className="quick-action-btn">
                <i className="fas fa-wallet"></i> View Earnings
              </Link>
            </div>
          </section>
          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-wallet"></i></div>
                <div className="stat-content">
                  <h3>₹12,500</h3>
                  <p>This Month</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-car"></i></div>
                <div className="stat-content">
                  <h3>3</h3>
                  <p>Active Vehicles</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-star"></i></div>
                <div className="stat-content">
                  <h3>4.9</h3>
                  <p>Rating</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div className="stat-content">
                  <h3>45</h3>
                  <p>Happy Customers</p>
                </div>
              </div>
            </div>
          </section>
          {/* Earnings Overview Section */}
          <section className="earnings-overview-section">
            <div className="section-header">
              <h2>Earnings Overview</h2>
              <Link href="#" className="view-all-link">View Details</Link>
            </div>
            <div className="earnings-grid">
              <div className="earning-card">
                <div className="earning-header">
                  <h3>Weekly Earnings</h3>
                  <span className="earning-amount">₹3,200</span>
                </div>
                <div className="earning-chart">
                  <div className="chart-bar" style={{height: '60%'}}></div>
                  <div className="chart-bar" style={{height: '80%'}}></div>
                  <div className="chart-bar" style={{height: '45%'}}></div>
                  <div className="chart-bar" style={{height: '90%'}}></div>
                  <div className="chart-bar" style={{height: '70%'}}></div>
                  <div className="chart-bar" style={{height: '85%'}}></div>
                  <div className="chart-bar" style={{height: '75%'}}></div>
                </div>
                <div className="earning-stats">
                  <span>+12% from last week</span>
                </div>
              </div>
              <div className="earning-summary">
                <div className="summary-item">
                  <div className="summary-label">Total Earnings</div>
                  <div className="summary-value">₹45,800</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">This Month</div>
                  <div className="summary-value">₹12,500</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Active Rentals</div>
                  <div className="summary-value">8</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Commission Rate</div>
                  <div className="summary-value">15%</div>
                </div>
              </div>
            </div>
          </section>
          {/* Current Bookings Section */}
          <section className="current-bookings-section">
            <div className="section-header">
              <h2>Current Bookings</h2>
              <Link href="#" className="view-all-link">View All</Link>
            </div>
            <div className="bookings-grid">
              <div className="booking-card">
                <div className="booking-header">
                  <div className="booking-vehicle">
                    <Image src="/images/ev-cars/tesla-model-3.svg" alt="Tesla Model 3" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Tesla Model 3</h4>
                      <span className="booking-date">Dec 18, 2024</span>
                    </div>
                  </div>
                  <div className="booking-status active">Active</div>
                </div>
                <div className="booking-details">
                  <div className="booking-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Delhi</span>
                  </div>
                  <div className="booking-info">
                    <span><i className="fas fa-clock"></i> 10:00 AM - 6:00 PM</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹2,500</span>
                  </div>
                  <div className="customer-info">
                    <span><i className="fas fa-user"></i> John Doe</span>
                    <span><i className="fas fa-phone"></i> +91 98765 43210</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn">Contact Customer</button>
                  <button className="action-btn">View Details</button>
                </div>
              </div>
              <div className="booking-card">
                <div className="booking-header">
                  <div className="booking-vehicle">
                    <Image src="/images/ev-cars/ola-s1.svg" alt="Ola S1 Pro" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Ola S1 Pro</h4>
                      <span className="booking-date">Dec 19, 2024</span>
                    </div>
                  </div>
                  <div className="booking-status upcoming">Upcoming</div>
                </div>
                <div className="booking-details">
                  <div className="booking-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Panchkula</span>
                  </div>
                  <div className="booking-info">
                    <span><i className="fas fa-clock"></i> 9:00 AM - 2:00 PM</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹800</span>
                  </div>
                  <div className="customer-info">
                    <span><i className="fas fa-user"></i> Alice Smith</span>
                    <span><i className="fas fa-phone"></i> +91 98765 43211</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn">Contact Customer</button>
                  <button className="action-btn">View Details</button>
                </div>
              </div>
            </div>
          </section>
          {/* Vehicle Management Section */}
          <section className="vehicle-management-section">
            <div className="section-header">
              <h2>Vehicle Management</h2>
              <Link href="#" className="view-all-link">Manage All</Link>
            </div>
            <div className="vehicles-grid">
              <div className="vehicle-card">
                <div className="vehicle-header">
                  <div className="vehicle-info">
                    <Image src="/images/ev-cars/tesla-model-3.svg" alt="Tesla Model 3" width={60} height={40} />
                    <div className="vehicle-details">
                      <h4>Tesla Model 3</h4>
                      <span className="vehicle-status active">Active</span>
                    </div>
                  </div>
                  <div className="vehicle-earnings">
                    <span className="earning-amount">₹8,500</span>
                    <span className="earning-period">This month</span>
                  </div>
                </div>
                <div className="vehicle-stats">
                  <div className="stat-item">
                    <span className="stat-label">Bookings</span>
                    <span className="stat-value">12</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">4.9</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Availability</span>
                    <span className="stat-value">85%</span>
                  </div>
                </div>
                <div className="vehicle-actions">
                  <button className="action-btn">Edit Details</button>
                  <button className="action-btn">View Bookings</button>
                </div>
              </div>
              <div className="vehicle-card">
                <div className="vehicle-header">
                  <div className="vehicle-info">
                    <Image src="/images/ev-cars/ola-s1.svg" alt="Ola S1 Pro" width={60} height={40} />
                    <div className="vehicle-details">
                      <h4>Ola S1 Pro</h4>
                      <span className="vehicle-status active">Active</span>
                    </div>
                  </div>
                  <div className="vehicle-earnings">
                    <span className="earning-amount">₹4,200</span>
                    <span className="earning-period">This month</span>
                  </div>
                </div>
                <div className="vehicle-stats">
                  <div className="stat-item">
                    <span className="stat-label">Bookings</span>
                    <span className="stat-value">8</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">4.8</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Availability</span>
                    <span className="stat-value">90%</span>
                  </div>
                </div>
                <div className="vehicle-actions">
                  <button className="action-btn">Edit Details</button>
                  <button className="action-btn">View Bookings</button>
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
                <div className="action-icon"><i className="fas fa-car"></i></div>
                <h3>Add Vehicle</h3>
                <p>List a new electric vehicle</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-wallet"></i></div>
                <h3>Withdraw Earnings</h3>
                <p>Transfer money to your account</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-calendar"></i></div>
                <h3>Set Availability</h3>
                <p>Manage your vehicle availability</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-headset"></i></div>
                <h3>Owner Support</h3>
                <p>Get help and contact us</p>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
