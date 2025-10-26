'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import Welcome from '@/components/dashboard/owner/Welcome';
import Stats from '@/components/dashboard/owner/Stats';
import Earning from '@/components/dashboard/owner/Earning';
import CurrentBooking from '@/components/dashboard/owner/CurrentBooking';
import VehicleManagement from '@/components/dashboard/owner/VehicleManagement';
import QuickAction from '@/components/dashboard/owner/QuickAction';
import '@/styles/dashboard/ownerDash.css';
export default function OwnerDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [Pageloading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

 // Fetch dashboard data when user is authenticated
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only fetch if authenticated and user object exists
      if (isAuthenticated && user?.id) {
        setPageLoading(true); // Start loading dashboard data
        setError(null);
        try {
          const token = localStorage.getItem('wattwheels_token'); // Get JWT token
          if (!token) {
            throw new Error("Authentication token not found.");
          }

          // Fetch from the new backend dashboard endpoint
          const res = await fetch(`http://127.0.0.1:5000/api/owner/${user.id}/dashboard`, {
             headers: {
                 // Include the Authorization header
                 'Authorization': `Bearer ${token}`
             }
          });

          // Check if the response status is OK
          if (!res.ok) {
             let errorData;
             try {
                // Try to parse error message from backend
                errorData = await res.json();
             } catch (parseError) {
                // Fallback if parsing fails
                throw new Error(res.statusText || `HTTP error! status: ${res.status}`);
             }
             // Throw error with message from backend or status text
             throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          setDashboardData(data); // Store fetched data in state

        } catch (fetchError) {
          console.error("Failed to fetch owner dashboard data:", fetchError);
          setError(fetchError.message); // Set error state
        } finally {
          setPageLoading(false); // Finish loading dashboard data
        }
      } else if (!authLoading) {
         // If auth check is done but user is not authenticated/available
         setPageLoading(false);
         if (!isAuthenticated || !user) {
             setError("Please log in to view the dashboard.");
         }
      }
    };

    fetchDashboardData();
    // Dependency array ensures this runs when auth state or user ID changes
  }, [isAuthenticated, user, authLoading]);

  // Combined loading state (show loading if auth OR dashboard data is loading)
  if (authLoading || Pageloading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#6b7280' }}>
        Loading dashboard...
      </div>
    );
  }

  // Handle error state or if user is not logged in
  if (!isAuthenticated || !user || error) {
    return (
      <>
        {/* Render header even in error state if user context exists */}
        {user && <OwnerHeader user={user} />}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 80px)', /* Adjusted height */ fontSize: '18px', color: '#ef4444', padding: '20px', textAlign: 'center' }}>
          {error || "Please log in to access the dashboard"}
          {error && <button onClick={() => window.location.reload()} style={{marginLeft: '10px', padding: '5px 10px'}}>Retry</button>}
        </div>
      </>
    );
  }

  // Extract data for child components (use optional chaining ?. for safety)
  const stats = dashboardData?.stats;
  const earnings = dashboardData?.earningsOverview;
  const bookings = dashboardData?.currentBookings;
  const vehicles = dashboardData?.vehicleManagement;

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <Welcome user={user} />
          {/* Pass fetched data as props to child components */}
          <Stats
            thisMonthEarnings={stats?.thisMonthEarnings}
            activeVehicles={stats?.activeVehicles}
            rating={stats?.rating}
            happyCustomers={stats?.happyCustomers}
          />
          <Earning
            thisMonth={earnings?.thisMonth}
            weeklyTrend={earnings?.weeklyTrend} // Pass trend data
          />
          <CurrentBooking bookings={bookings} /> {/* Pass bookings array */}
          <VehicleManagement vehicles={vehicles} /> {/* Pass vehicles array */}
          <QuickAction />
        </div>
      </main>
    </>
  );
}