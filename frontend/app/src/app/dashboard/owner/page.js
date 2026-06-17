'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import Welcome from '@/components/dashboard/owner/Welcome';
import Stats from '@/components/dashboard/owner/Stats';
import Earning from '@/components/dashboard/owner/Earning';
import CurrentBooking from '@/components/dashboard/owner/CurrentBooking';
import VehicleManagement from '@/components/dashboard/owner/VehicleManagement';
import QuickAction from '@/components/dashboard/owner/QuickAction';
import PendingRequests from '@/components/dashboard/owner/PendingRequests'; // Phase 2 Addition
import '@/styles/dashboard/ownerDash.css';

export default function OwnerDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phase 2 Update: Wrapped fetch in useCallback so it can be passed as a prop without causing infinite loops
  const fetchDashboardData = useCallback(async () => {
      if (isAuthenticated && user?.id) {
        setPageLoading(true); 
        setError(null);
        try {
          const token = localStorage.getItem('wattwheels_token'); 
          if (!token) throw new Error("Authentication token not found.");

          const res = await fetch(`http://127.0.0.1:5000/api/owner/${user.id}/dashboard`, {
             headers: { 'Authorization': `Bearer ${token}` }
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

        } catch (fetchError) {
          console.error("Failed to fetch owner dashboard data:", fetchError);
          setError(fetchError.message); 
        } finally {
          setPageLoading(false); 
        }
      } else if (!authLoading) {
         setPageLoading(false);
         if (!isAuthenticated || !user) {
             setError("Please log in to view the dashboard.");
         }
      }
  }, [isAuthenticated, user, authLoading]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  if (authLoading || pageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#6b7280' }}>
        Loading dashboard...
      </div>
    );
  }

  if (!isAuthenticated || !user || error) {
    return (
      <>
        {user && <OwnerHeader user={user} />}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 80px)', fontSize: '18px', color: '#ef4444', padding: '20px', textAlign: 'center' }}>
          {error || "Please log in to access the dashboard"}
          {error && <button onClick={() => fetchDashboardData()} style={{marginLeft: '10px', padding: '5px 10px'}}>Retry</button>}
        </div>
      </>
    );
  }

  const stats = dashboardData?.stats;
  const earnings = dashboardData?.earningsOverview;
  const bookings = dashboardData?.currentBookings;
  const vehicles = dashboardData?.vehicleManagement;
  const pendingRequests = dashboardData?.pendingRequests; // Extract pending requests

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <Welcome user={user} />
          
          <Stats
            thisMonthEarnings={stats?.thisMonthEarnings}
            activeVehicles={stats?.activeVehicles}
            rating={stats?.rating}
            happyCustomers={stats?.happyCustomers}
          />
          
          {/* Phase 2: Render Pending Requests if they exist */}
          {pendingRequests && pendingRequests.length > 0 && (
              <PendingRequests 
                  requests={pendingRequests} 
                  onRefresh={fetchDashboardData} 
              />
          )}

          <Earning
            thisMonth={earnings?.thisMonth}
            weeklyTrend={earnings?.weeklyTrend} 
          />
          <CurrentBooking bookings={bookings} /> 
          <VehicleManagement vehicles={vehicles} /> 
          <QuickAction />
        </div>
      </main>
    </>
  );
}