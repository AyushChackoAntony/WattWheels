'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

import Header from '@/components/dashboard/customer/CustomerHeader';
import Welcome from '@/components/dashboard/customer/Welcome';
import Stats from '@/components/dashboard/customer/Stats';
import QuickBooking from '@/components/dashboard/customer/QuickBooking';
import RecentTrips from '@/components/dashboard/customer/RecentTrips';
import UpcomingBookings from '@/components/dashboard/customer/UpcomingBookings';
import QuickActions from '@/components/dashboard/customer/QuickActions';

export default function CustomerDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('wattwheels_token');
          if (!token) {
            throw new Error("Authentication token not found.");
          }

          const res = await fetch(`http://127.0.0.1:5000/api/customer/${user.id}/dashboard`, {
             headers: {
                 'Authorization': `Bearer ${token}`
             }
          });

          if (!res.ok) {
             let errorData;
             try {
                errorData = await res.json();
             } catch (parseError) {
                throw new Error(res.statusText || `HTTP error! status: ${res.status}`);
             }
             throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          setDashboardData(data);

        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    } else if (!authLoading) {
      setLoading(false);
      if (!user) {
        setError("User data not available. Please log in again.");
      }
    }
  }, [isAuthenticated, user, authLoading]);


  if (authLoading || (loading && !dashboardData && !error)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#6b7280' }}>
        Loading dashboard...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#ef4444' }}>
        Please log in to access the dashboard
      </div>
    );
  }

  if (error) {
      return (
        <>
          <Header user={user} />
          <main className="dashboard-main">
              <div className="dashboard-container" style={{ textAlign: 'center', color: '#ef4444', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                  <h2>Error Loading Dashboard Data</h2>
                  <p>{error}</p>
                  <p>Please try refreshing the page. If the problem persists, contact support.</p>
                  <button onClick={() => window.location.reload()} style={{ marginTop: '15px', padding: '10px 15px', cursor: 'pointer' }}>
                      Refresh Page
                  </button>
              </div>
          </main>
        </>
      );
  }

  return (
    <>
      <Header user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <Welcome user={user} />
          {dashboardData && (
            <>
              <Stats
                totalRides={dashboardData.totalRides}
                co2Saved={dashboardData.co2Saved}
                totalSpent={dashboardData.totalSpent}
                rating={dashboardData.rating}
              />
              <QuickBooking />
              <RecentTrips trips={dashboardData.recentTrips} />
              <UpcomingBookings bookings={dashboardData.upcomingBookings} />
              <QuickActions />
            </>
          )}
          {!dashboardData && !loading && !error && (
             <p>Could not load dashboard information.</p>
          )}
        </div>
      </main>
    </>
  );
}