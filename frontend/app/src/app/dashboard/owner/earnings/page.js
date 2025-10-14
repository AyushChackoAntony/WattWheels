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
  const [earningsData, setEarningsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  // This hook fetches the owner's earnings data from the backend when the user is logged in.
  useEffect(() => {
    if (user && user.id) {
      const fetchEarnings = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/earnings/${user.id}`);
          const data = await res.json();

          if (res.ok) {
            setEarningsData(data);
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
            // We'll initially show the monthly data in the chart.
            setChartData(data.monthlyData || []);
          } else {
            console.error("Failed to fetch earnings:", data.error);
          }
        } catch (error) {
          console.error("Error fetching earnings:", error);
        }
      };
      fetchEarnings();
    }
  }, [user, isAuthenticated]);

  // Display a loading message while the data is being fetched.
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
    if (selectedFilter === 'earnings') return transaction.type === 'earning';
    if (selectedFilter === 'payouts') return transaction.type === 'payout';
    if (selectedFilter === 'pending') return transaction.status === 'pending';
    return true;
  });
  
  // This function updates the chart data when the user selects a different time frame.
  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    if (earningsData) {
      if (timeframe === 'week') setChartData(earningsData.weeklyData || []);
      else if (timeframe === 'month') setChartData(earningsData.monthlyData || []);
      else if (timeframe === 'year') setChartData(earningsData.yearlyData || []);
    }
  };
  
  const handleRequestPayout = (payoutDetails) => {
    console.log('Requesting payout:', payoutDetails);
    // The API call to the backend to process the payout would be added here.
    setShowPayoutModal(false);
    alert(`Payout of ₹${payoutDetails.amount} requested via ${payoutDetails.method}!`);
  };

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <EarningsHeader
            totalEarnings={earningsData.total_earnings || 0}
            availableBalance={earningsData.availableBalance || 0}
            thisMonthEarnings={earningsData.thisMonthEarnings || 0}
            onRequestPayout={() => setShowPayoutModal(true)}
          />
          <EarningsOverview
            data={earningsData}
            selectedTimeframe={selectedTimeframe}
          />
          <div className="earnings-chart-section">
            <EarningsFilters
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={handleTimeframeChange}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
            <EarningsChart
              data={chartData}
              timeframe={selectedTimeframe}
            />
          </div>
          <TransactionHistory
            transactions={filteredTransactions}
            selectedFilter={selectedFilter}
          />
          {showPayoutModal && (
            <PayoutSection
              availableBalance={earningsData.availableBalance || 0}
              nextPayoutDate={earningsData.nextPayoutDate || ''}
              onRequestPayout={handleRequestPayout}
              onClose={() => setShowPayoutModal(false)}
            />
          )}
        </div>
      </main>
    </>
  );
}