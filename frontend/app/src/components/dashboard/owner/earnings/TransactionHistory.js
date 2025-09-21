import React, { useState } from 'react';
import '@/styles/dashboard/owner/earnings/transactionHistory.css';

export default function TransactionHistory({ transactions, selectedFilter }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  // Format date
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

  // Get transaction type config
  const getTransactionConfig = (type, status) => {
    const configs = {
      earning: {
        icon: 'fas fa-arrow-up',
        color: 'success',
        title: 'Earning',
        bgClass: 'earning'
      },
      payout: {
        icon: 'fas fa-arrow-down',
        color: 'info',
        title: 'Payout',
        bgClass: 'payout'
      },
      commission: {
        icon: 'fas fa-percentage',
        color: 'warning',
        title: 'Commission',
        bgClass: 'commission'
      }
    };
    
    const config = configs[type] || configs.earning;
    
    if (status === 'pending') {
      config.color = 'pending';
      config.bgClass = 'pending';
    }
    
    return config;
  };

  // Toggle transaction details
  const toggleTransactionDetails = (transactionId) => {
    setExpandedTransaction(
      expandedTransaction === transactionId ? null : transactionId
    );
  };

  return (
    <div className="transaction-history-section">
      <div className="history-header">
        <h3>Transaction History</h3>
        <div className="history-summary">
          <span>{transactions.length} transactions found</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-transactions">
          <div className="empty-icon">
            <i className="fas fa-receipt"></i>
          </div>
          <h4>No transactions found</h4>
          <p>No transactions match your current filter criteria.</p>
        </div>
      ) : (
        <>
          {/* Transactions List */}
          <div className="transactions-list">
            {paginatedTransactions.map((transaction) => {
              const config = getTransactionConfig(transaction.type, transaction.status);
              const dateTime = formatDate(transaction.date);
              const isExpanded = expandedTransaction === transaction.id;

              return (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${config.bgClass} ${isExpanded ? 'expanded' : ''}`}
                >
                  <div 
                    className="transaction-main"
                    onClick={() => toggleTransactionDetails(transaction.id)}
                  >
                    {/* Transaction Icon */}
                    <div className={`transaction-icon ${config.color}`}>
                      <i className={config.icon}></i>
                    </div>

                    {/* Transaction Info */}
                    <div className="transaction-info">
                      <div className="transaction-primary">
                        <h4>{transaction.description}</h4>
                        <span className={`transaction-status ${transaction.status}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="transaction-secondary">
                        <span className="transaction-date">
                          {dateTime.date} • {dateTime.time}
                        </span>
                        {transaction.vehicle && (
                          <span className="transaction-vehicle">
                            <i className="fas fa-car"></i>
                            {transaction.vehicle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Transaction Amount */}
                    <div className="transaction-amount">
                      <span className={`amount ${transaction.type === 'payout' ? 'negative' : 'positive'}`}>
                        {transaction.type === 'payout' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                      </span>
                      <button className="expand-btn">
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="transaction-details">
                      {transaction.type === 'earning' && (
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="detail-label">Gross Amount</span>
                            <span className="detail-value">₹{transaction.amount.toLocaleString()}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Commission (15%)</span>
                            <span className="detail-value negative">-₹{transaction.commission.toLocaleString()}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Net Amount</span>
                            <span className="detail-value positive">₹{transaction.netAmount.toLocaleString()}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Customer</span>
                            <span className="detail-value">{transaction.customer}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Duration</span>
                            <span className="detail-value">{transaction.duration}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className={`status-badge ${transaction.status}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {transaction.type === 'payout' && (
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="detail-label">Payout Amount</span>
                            <span className="detail-value">₹{transaction.amount.toLocaleString()}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Method</span>
                            <span className="detail-value">{transaction.payoutMethod}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className={`status-badge ${transaction.status}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="transaction-actions">
                        <button className="action-btn secondary">
                          <i className="fas fa-download"></i>
                          Download Receipt
                        </button>
                        {transaction.type === 'earning' && (
                          <button className="action-btn primary">
                            <i className="fas fa-eye"></i>
                            View Booking Details
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Previous
              </button>
              
              <div className="pagination-info">
                <span>
                  Page {currentPage} of {totalPages} 
                  ({transactions.length} total transactions)
                </span>
              </div>
              
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}