'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import EarningsHeader from '@/components/dashboard/owner/earnings/EarningsHeader';
import EarningsOverview from '@/components/dashboard/owner/earnings/EarningsOverview';
import EarningsChart from '@/components/dashboard/owner/earnings/EarningsChart';
import EarningsFilters from '@/components/dashboard/owner/earnings/EarningsFilters';
import TransactionHistory from '@/components/dashboard/owner/earnings/TransactionHistory';
import PayoutSection from '@/components/dashboard/owner/earnings/PayoutSection';

export default function MyEarnings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // --- State to hold data from the API ---
  const [earningsData, setEarningsData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // --- Fetch earnings data from the backend ---
  useEffect(() => {
    // --- UPDATED: Added isAuthenticated check ---
    if (user && user.id && isAuthenticated) {
      const fetchEarnings = async () => {
        try {
          // --- UPDATED: Get token from localStorage ---
          const token = localStorage.getItem('wattwheels_token');
          
          // --- UPDATED: Check if token exists before fetching ---
          if (!token) {
            // This will be caught by the catch block below
            throw new Error("Authentication token not found. Please log in again.");
          }
          // --- END UPDATE ---

          const res = await fetch(`http://127.0.0.1:5000/api/earnings/${user.id}`, {
            // --- UPDATED: Add Authorization header ---
            headers: {
              'Authorization': `Bearer ${token}`
            }
            // --- END UPDATE ---
          });
          const data = await res.json();

          if (res.ok) {
            // Set the fetched data into state
            setEarningsData({
              totalEarnings: data.total_earnings,
              availableBalance: data.availableBalance,
              thisMonthEarnings: data.thisMonthEarnings,
              lastMonthEarnings: data.lastMonthEarnings,
              thisWeekEarnings: data.thisWeekEarnings,
              pendingPayouts: data.pendingPayouts,
              totalTrips: data.totalTrips,
              averagePerTrip: data.averagePerTrip,
              commissionRate: data.commissionRate,
              nextPayoutDate: data.nextPayoutDate,
              monthlyData: data.monthlyData || [],
              weeklyData: data.weeklyData || [],
              yearlyData: data.yearlyData || [],
              // Add placeholders for metrics not yet in backend
              tripSuccessRate: 'N/A',
              averageRating: 'N/A',
              avgResponseTime: 'N/A',
              vehicleUtilization: 'N/A'
            });

            // Map the backend transactions to the format our component expects
            const formattedTransactions = data.transactions.map(t => ({
                id: t.booking_id,
                description: `Booking #${t.booking_id} - ${t.vehicle_name}`,
                amount: t.earning,
                date: t.date,
                type: 'earning', 
                status: 'completed',
                vehicle: t.vehicle_name,
                customer: `ID: ${t.customer_id}`,
                commission: (t.total_price * (data.commissionRate / 100)),
                netAmount: t.earning
            }));
            setTransactions(formattedTransactions);

          } else {
            console.error("Failed to fetch earnings:", data.error);
          }
        } catch (error) {
          console.error("Error fetching earnings:", error.message); // --- UPDATED: Log error.message
        }
      };
      fetchEarnings();
    }
  }, [user, isAuthenticated]); // --- UPDATED: Added isAuthenticated dependency ---

  // Loading state for user and earnings data
  if (loading || !earningsData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading earnings...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Please log in to access your earnings
      </div>
    );
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const getChartData = () => {
    switch (selectedTimeframe) {
      case 'week':
        return earningsData.weeklyData;
      case 'year':
        return earningsData.yearlyData;
      default:
        return earningsData.monthlyData;
    }
  };

  const handleRequestPayout = (amount) => {
    console.log('Requesting payout:', amount);
    setEarningsData(prevData => ({
      ...prevData,
      availableBalance: prevData.availableBalance - amount,
      pendingPayouts: prevData.pendingPayouts + amount
    }));
    setShowPayoutModal(false);
  };

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <EarningsHeader
            totalEarnings={earningsData.totalEarnings}
            availableBalance={earningsData.availableBalance}
            thisMonthEarnings={earningsData.thisMonthEarnings}
            lastMonthEarnings={earningsData.lastMonthEarnings}
            pendingPayouts={earningsData.pendingPayouts}
            commissionRate={earningsData.commissionRate}
            averagePerTrip={earningsData.averagePerTrip}
            onRequestPayout={() => setShowPayoutModal(true)}
          />
          <EarningsOverview
            data={{
              thisMonthEarnings: earningsData.thisMonthEarnings,
              lastMonthEarnings: earningsData.lastMonthEarnings,
              thisWeekEarnings: earningsData.thisWeekEarnings,
              totalTrips: earningsData.totalTrips,
              averagePerTrip: earningsData.averagePerTrip,
              commissionRate: earningsData.commissionRate,
              tripSuccessRate: earningsData.tripSuccessRate,
              averageRating: earningsData.averageRating,
              avgResponseTime: earningsData.avgResponseTime,
              vehicleUtilization: earningsData.vehicleUtilization
            }}
            selectedTimeframe={selectedTimeframe}
          />
          <div className="earnings-chart-section">
            <EarningsFilters
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
            <EarningsChart
              data={getChartData()}
              timeframe={selectedTimeframe}
            />
          </div>
          <TransactionHistory
            transactions={filteredTransactions}
            selectedFilter={selectedFilter}
          />
          {showPayoutModal && (
            <PayoutSection
              availableBalance={earningsData.availableBalance}
              nextPayoutDate={earningsData.nextPayoutDate}
              onRequestPayout={handleRequestPayout}
              onClose={() => setShowPayoutModal(false)}
            />
          )}
        </div>
      </main>
    </>
  );
}