'use client';
import React, { useState } from 'react';
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

  // Sample earnings data - replace with API call
  const [earningsData] = useState({
    totalEarnings: 125800,
    availableBalance: 23500,
    pendingPayouts: 8200,
    thisMonthEarnings: 18750,
    lastMonthEarnings: 15400,
    thisWeekEarnings: 4200,
    totalTrips: 342,
    averagePerTrip: 368,
    commissionRate: 15,
    nextPayoutDate: '2025-01-15',
    
    // Monthly chart data
    monthlyData: [
      { month: 'Jul', earnings: 12800, trips: 28 },
      { month: 'Aug', earnings: 15600, trips: 34 },
      { month: 'Sep', earnings: 18200, trips: 41 },
      { month: 'Oct', earnings: 16800, trips: 38 },
      { month: 'Nov', earnings: 21400, trips: 47 },
      { month: 'Dec', earnings: 18750, trips: 42 }
    ],

    // Weekly chart data
    weeklyData: [
      { week: 'Week 1', earnings: 3800, trips: 8 },
      { week: 'Week 2', earnings: 4200, trips: 12 },
      { week: 'Week 3', earnings: 5100, trips: 14 },
      { week: 'Week 4', earnings: 4650, trips: 11 },
      { week: 'Week 5', earnings: 1000, trips: 3 }
    ],

    // Yearly data
    yearlyData: [
      { year: '2023', earnings: 145800, trips: 312 },
      { year: '2024', earnings: 186400, trips: 398 },
      { year: '2025', earnings: 125800, trips: 342 }
    ]
  });

  // Sample transaction data
  const [transactions] = useState([
    {
      id: 1,
      type: 'earning',
      description: 'Tesla Model 3 rental - John Doe',
      amount: 2125,
      commission: 375,
      netAmount: 1750,
      date: '2025-01-10T14:30:00',
      status: 'completed',
      vehicle: 'Tesla Model 3',
      customer: 'John Doe',
      duration: '2 days'
    },
    {
      id: 2,
      type: 'payout',
      description: 'Payout to bank account',
      amount: 15000,
      date: '2025-01-08T09:00:00',
      status: 'completed',
      payoutMethod: 'Bank Transfer'
    },
    {
      id: 3,
      type: 'earning',
      description: 'Ola S1 Pro rental - Alice Smith',
      amount: 640,
      commission: 160,
      netAmount: 480,
      date: '2025-01-07T16:45:00',
      status: 'completed',
      vehicle: 'Ola S1 Pro',
      customer: 'Alice Smith',
      duration: '1 day'
    },
    {
      id: 4,
      type: 'earning',
      description: 'Tesla Model 3 rental - Mike Johnson',
      amount: 5000,
      commission: 750,
      netAmount: 4250,
      date: '2025-01-05T11:20:00',
      status: 'pending',
      vehicle: 'Tesla Model 3',
      customer: 'Mike Johnson',
      duration: '3 days'
    },
    {
      id: 5,
      type: 'commission',
      description: 'Platform commission adjustment',
      amount: 125,
      date: '2025-01-03T12:00:00',
      status: 'completed'
    }
  ]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading earnings...
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#ef4444'
      }}>
        Please log in to access your earnings
      </div>
    );
  }

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'earnings') return transaction.type === 'earning';
    if (selectedFilter === 'payouts') return transaction.type === 'payout';
    if (selectedFilter === 'pending') return transaction.status === 'pending';
    return true;
  });

  // Get chart data based on timeframe
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
    // Handle payout request - integrate with API
    console.log('Requesting payout:', amount);
    setShowPayoutModal(false);
    // Add new payout transaction to the list
    // Update available balance
  };

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* Earnings Header */}
          <EarningsHeader 
            totalEarnings={earningsData.totalEarnings}
            availableBalance={earningsData.availableBalance}
            thisMonthEarnings={earningsData.thisMonthEarnings}
            onRequestPayout={() => setShowPayoutModal(true)}
          />

          {/* Earnings Overview Cards */}
          <EarningsOverview 
            data={earningsData}
            selectedTimeframe={selectedTimeframe}
          />

          {/* Chart Section with Filters */}
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

          {/* Transaction History */}
          <TransactionHistory 
            transactions={filteredTransactions}
            selectedFilter={selectedFilter}
          />

          {/* Payout Section Modal */}
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