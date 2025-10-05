import React, { useState } from 'react';
import '@/styles/dashboard/customer/wallet/transactionHistory.css';

export default function TransactionHistory({ transactions, selectedFilter }) {
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const toggleTransaction = (transactionId) => {
    setExpandedTransaction(
      expandedTransaction === transactionId ? null : transactionId
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="transactions-empty-state">
        <div className="empty-icon">
          <i className="fas fa-receipt"></i>
        </div>
        <h3>No transactions found</h3>
        <p>No transactions match your current filter.</p>
      </div>
    );
  }

  return (
    <div className="transaction-history-section">
      <div className="transactions-list">
        {transactions.map((transaction) => {
          const dateTime = formatDate(transaction.date);
          const isExpanded = expandedTransaction === transaction.id;
          const isCredit = transaction.type === 'credit';

          return (
            <div 
              key={transaction.id} 
              className={`transaction-item ${transaction.type} ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleTransaction(transaction.id)}
            >
              <div className="transaction-main">
                {/* Transaction Icon */}
                <div className={`transaction-icon ${transaction.type}`}>
                  <i className={isCredit ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}></i>
                </div>

                {/* Transaction Info */}
                <div className="transaction-info">
                  <div className="transaction-primary">
                    <h4>{transaction.description}</h4>
                    <span className={`transaction-amount ${transaction.type}`}>
                      {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="transaction-secondary">
                    <span className="transaction-date">
                      {dateTime.date} • {dateTime.time}
                    </span>
                    <span className={`transaction-status ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>

                {/* Expand Button */}
                <button className="expand-btn">
                  <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="transaction-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Transaction ID</span>
                      <span className="detail-value">#{transaction.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </div>
                    {transaction.bookingId && (
                      <div className="detail-item">
                        <span className="detail-label">Booking ID</span>
                        <span className="detail-value">{transaction.bookingId}</span>
                      </div>
                    )}
                    {transaction.method && (
                      <div className="detail-item">
                        <span className="detail-label">Method</span>
                        <span className="detail-value">{transaction.method}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Balance After</span>
                      <span className="detail-value balance">
                        ₹{transaction.balanceAfter.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-actions">
                    <button className="action-btn secondary">
                      <i className="fas fa-download"></i>
                      Download Receipt
                    </button>
                    {transaction.bookingId && (
                      <button className="action-btn primary">
                        <i className="fas fa-eye"></i>
                        View Booking
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}