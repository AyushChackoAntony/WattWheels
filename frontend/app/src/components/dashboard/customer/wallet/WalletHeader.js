import React from 'react';
import '@/styles/dashboard/customer/wallet/walletHeader.css';

export default function WalletHeader({ balance, onAddMoney }) {
  return (
    <div className="wallet-header-section">
      <div className="wallet-header-content">
        <div className="wallet-balance-card">
          <div className="balance-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="balance-info">
            <span className="balance-label">Available Balance</span>
            <h1 className="balance-amount">₹{balance.toLocaleString()}</h1>
          </div>
        </div>
        
        <div className="wallet-actions">
          <button className="add-money-btn" onClick={onAddMoney}>
            <i className="fas fa-plus"></i>
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
}