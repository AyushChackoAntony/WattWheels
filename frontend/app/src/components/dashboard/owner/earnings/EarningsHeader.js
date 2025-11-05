import React from 'react';
import '@/styles/dashboard/owner/earnings/earningsHeader.css';

export default function EarningsHeader({ 
  totalEarnings, 
  availableBalance, 
  thisMonthEarnings,
  // --- UPDATED: Add new props for dynamic data ---
  lastMonthEarnings,
  pendingPayouts,
  commissionRate,
  averagePerTrip,
  // --- END UPDATE ---
  onRequestPayout 
}) {
  
  // --- UPDATED: Calculate growth percentage dynamically ---
  const growthAmount = thisMonthEarnings - lastMonthEarnings;
  let growthPercentage = 0;
  if (lastMonthEarnings > 0) {
    growthPercentage = (growthAmount / lastMonthEarnings) * 100;
  } else if (thisMonthEarnings > 0) {
    growthPercentage = 100; // Show 100% growth if last month was 0
  }
  const isPositiveGrowth = growthAmount > 0;
  // --- END UPDATE ---

  return (
    <div className="earnings-header-section">
      <div className="earnings-header-content">
        <div className="earnings-header-info">
          <h1>My Earnings</h1>
          <p>Track your income and manage payouts</p>
        </div>
        <div className="earnings-header-actions">
          <button 
            className="payout-btn"
            onClick={onRequestPayout}
            disabled={availableBalance < 500} // Example minimum payout
          >
            <i className="fas fa-money-bill-wave"></i>
            Request Payout
          </button>
        </div>
      </div>

      {/* Main Earnings Display */}
      <div className="main-earnings-display">
        <div className="total-earnings-card">
          <div className="earnings-main">
            <div className="earnings-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="earnings-info">
              <h2>₹{totalEarnings.toLocaleString()}</h2>
              <p>Total Lifetime Earnings</p>
            </div>
          </div>
          
          <div className="earnings-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Available Balance</span>
              <span className="breakdown-value available">₹{availableBalance.toLocaleString()}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">This Month</span>
              <div className="breakdown-with-growth">
                <span className="breakdown-value">₹{thisMonthEarnings.toLocaleString()}</span>
                {/* --- UPDATED: Show dynamic growth --- */}
                {thisMonthEarnings > 0 || lastMonthEarnings > 0 ? (
                  <span className={`growth-indicator ${isPositiveGrowth ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-arrow-${isPositiveGrowth ? 'up' : 'down'}`}></i>
                    {growthPercentage.toFixed(1)}%
                  </span>
                ) : (
                  <span className="growth-indicator">
                    -
                  </span>
                )}
                {/* --- END UPDATE --- */}
              </div>
            </div>
          </div>
        </div>

        {/* --- UPDATED: Quick Stats Grid --- */}
        <div className="quick-stats-grid">
          <div className="quick-stat-item">
            <div className="stat-icon pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              {/* Use dynamic prop */}
              <h3>₹{pendingPayouts.toLocaleString()}</h3>
              <p>Pending Payouts</p>
            </div>
          </div>
          
          <div className="quick-stat-item">
            <div className="stat-icon commission">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-info">
              {/* Use dynamic prop */}
              <h3>{commissionRate}%</h3>
              <p>Commission Rate</p>
            </div>
          </div>
          
          <div className="quick-stat-item">
            <div className="stat-icon average">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              {/* Use dynamic prop */}
              <h3>₹{averagePerTrip.toLocaleString()}</h3>
              <p>Avg per Trip</p>
            </div>
          </div>
        </div>
        {/* --- END UPDATE --- */}
      </div>
    </div>
  );
}