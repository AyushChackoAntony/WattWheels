'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';
import WalletHeader from '@/components/dashboard/customer/wallet/WalletHeader';
import WalletOverview from '@/components/dashboard/customer/wallet/WalletOverview';
import TransactionFilters from '@/components/dashboard/customer/wallet/TransactionFilters';
import TransactionHistory from '@/components/dashboard/customer/wallet/TransactionHistory';
import AddMoneyModal from '@/components/dashboard/customer/wallet/AddMoneyModal';
import '@/styles/dashboard/customer/wallet/customerWallet.css';

export default function CustomerWallet() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);

  // Mock wallet data
  const [walletData] = useState({
    balance: 2500,
    totalSpent: 15800,
    totalAdded: 18300,
    cashback: 250,
    pendingRefunds: 0
  });

  // Mock transactions
  const [transactions] = useState([
    {
      id: 1,
      type: 'debit',
      description: 'Booking Payment - Tesla Model 3',
      amount: 5000,
      date: '2024-12-20T10:30:00Z',
      status: 'completed',
      bookingId: 'BK123456',
      balanceAfter: 2500
    },
    {
      id: 2,
      type: 'credit',
      description: 'Money Added via UPI',
      amount: 5000,
      date: '2024-12-19T15:20:00Z',
      status: 'completed',
      method: 'UPI',
      balanceAfter: 7500
    },
    {
      id: 3,
      type: 'debit',
      description: 'Booking Payment - Ola S1 Pro',
      amount: 800,
      date: '2024-12-18T09:15:00Z',
      status: 'completed',
      bookingId: 'BK123455',
      balanceAfter: 2500
    },
    {
      id: 4,
      type: 'credit',
      description: 'Cashback Reward',
      amount: 250,
      date: '2024-12-17T12:00:00Z',
      status: 'completed',
      method: 'Cashback',
      balanceAfter: 3300
    },
    {
      id: 5,
      type: 'credit',
      description: 'Money Added via Credit Card',
      amount: 10000,
      date: '2024-12-15T14:30:00Z',
      status: 'completed',
      method: 'Credit Card',
      balanceAfter: 3050
    },
    {
      id: 6,
      type: 'debit',
      description: 'Booking Payment - Ather 450X',
      amount: 600,
      date: '2024-12-10T16:45:00Z',
      status: 'completed',
      bookingId: 'BK123454',
      balanceAfter: 2450
    },
    {
      id: 7,
      type: 'credit',
      description: 'Refund - Cancelled Booking',
      amount: 8000,
      date: '2024-11-26T11:00:00Z',
      status: 'completed',
      method: 'Refund',
      balanceAfter: 3050
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
        Loading wallet...
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
        Please log in to access your wallet
      </div>
    );
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const handleAddMoney = (amount, method) => {
    console.log('Adding money:', amount, method);
    // API call to add money
    setShowAddMoneyModal(false);
  };

  return (
    <>
      <CustomerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <WalletHeader 
            balance={walletData.balance}
            onAddMoney={() => setShowAddMoneyModal(true)}
          />
          
          <WalletOverview data={walletData} />
          
          <TransactionFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          
          <TransactionHistory
            transactions={filteredTransactions}
            selectedFilter={selectedFilter}
          />

          {showAddMoneyModal && (
            <AddMoneyModal
              onClose={() => setShowAddMoneyModal(false)}
              onAddMoney={handleAddMoney}
            />
          )}
        </div>
      </main>
    </>
  );
}