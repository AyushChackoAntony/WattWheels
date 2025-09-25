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
    if (user && user.id) {
      const fetchEarnings = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/earnings/${user.id}`);
          const data = await res.json();

          if (res.ok) {
            // Set the fetched data into state
            setEarningsData({
              totalEarnings: data.total_earnings,
              totalTrips: data.transaction_count,
              availableBalance: data.total_earnings, // Placeholder
              thisMonthEarnings: data.total_earnings, // Placeholder
              // Add other placeholder values until backend provides them
              pendingPayouts: 0,
              lastMonthEarnings: 0,
              thisWeekEarnings: 0,
              averagePerTrip: data.transaction_count > 0 ? data.total_earnings / data.transaction_count : 0,
              commissionRate: 15,
              nextPayoutDate: '2025-01-15',
              monthlyData: [], 
              weeklyData: [], 
              yearlyData: [] 
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
                commission: t.total_price * 0.15,
                netAmount: t.earning
            }));
            setTransactions(formattedTransactions);

          } else {
            console.error("Failed to fetch earnings:", data.error);
          }
        } catch (error) {
          console.error("Error fetching earnings:", error);
        }
      };
      fetchEarnings();
    }
  }, [user]); // Re-run when the user object is available

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
    return earningsData.monthlyData;
  };

  const handleRequestPayout = (amount) => {
    console.log('Requesting payout:', amount);
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
            onRequestPayout={() => setShowPayoutModal(true)}
          />
          <EarningsOverview
            data={earningsData}
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