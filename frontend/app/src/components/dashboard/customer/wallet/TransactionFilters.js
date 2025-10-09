import React from 'react';
import '@/styles/dashboard/customer/wallet/transactionFilters.css';

export default function TransactionFilters({ selectedFilter, onFilterChange }) {
  const filterOptions = [
    { value: 'all', label: 'All Transactions', icon: 'fas fa-list' },
    { value: 'credit', label: 'Money Added', icon: 'fas fa-arrow-up' },
    { value: 'debit', label: 'Money Spent', icon: 'fas fa-arrow-down' }
  ];

  return (
    <div className="transaction-filters-section">
      <div className="filters-header">
        <h2>Transaction History</h2>
      </div>
      
      <div className="filter-tabs">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-tab ${selectedFilter === option.value ? 'active' : ''}`}
            onClick={() => onFilterChange(option.value)}
          >
            <i className={option.icon}></i>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}