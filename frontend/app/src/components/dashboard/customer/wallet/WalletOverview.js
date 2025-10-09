import React from 'react';
import '@/styles/dashboard/customer/wallet/walletOverview.css';

export default function WalletOverview({ data }) {
  return (
    <div className="wallet-overview-section">
      <div className="overview-cards-grid">
        <div className="overview-card">
          <div className="card-icon spent">
            <i className="fas fa-arrow-down"></i>
          </div>
          <div className="card-content">
            <span className="card-label">Total Spent</span>
            <h3 className="card-value">₹{data.totalSpent.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon added">
            <i className="fas fa-arrow-up"></i>
          </div>
          <div className="card-content">
            <span className="card-label">Total Added</span>
            <h3 className="card-value">₹{data.totalAdded.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon cashback">
            <i className="fas fa-gift"></i>
          </div>
          <div className="card-content">
            <span className="card-label">Cashback Earned</span>
            <h3 className="card-value">₹{data.cashback.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="card-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="card-content">
            <span className="card-label">Pending Refunds</span>
            <h3 className="card-value">₹{data.pendingRefunds.toLocaleString()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}