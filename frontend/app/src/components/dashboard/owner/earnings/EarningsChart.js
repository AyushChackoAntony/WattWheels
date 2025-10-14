import React from 'react';
import '@/styles/dashboard/owner/earnings/earningsChart.css';

export default function EarningsChart({ data, timeframe }) {
  if (!data || data.length === 0) {
    return (
      <div className="earnings-chart-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>No chart data available for this period.</p>
      </div>
    );
  }

  const maxEarnings = Math.max(...data.map(item => item.earnings));
  const maxTrips = Math.max(...data.map(item => item.trips));

  const getXAxisKey = (item) => {
    if (item.month) return item.month;
    if (item.week) return item.week;
    if (item.year) return item.year;
    return '';
  };

  const getBarHeight = (value, max) => {
    if (max === 0) return 5; // Prevent division by zero
    return Math.max((value / max) * 100, 5);
  };

  const formatEarnings = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  return (
    <div className="earnings-chart-container">
      <div className="chart-header">
        <h3>Earnings Trend</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color earnings"></div>
            <span>Earnings</span>
          </div>
          <div className="legend-item">
            <div className="legend-color trips"></div>
            <span>Trips</span>
          </div>
        </div>
      </div>

      <div className="chart-content">
        <div className="chart-grid">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="grid-line" style={{ bottom: `${(index + 1) * 20}%` }}>
              <span className="grid-label">
                {formatEarnings(maxEarnings > 0 ? (maxEarnings / 5) * (index + 1) : 0)}
              </span>
            </div>
          ))}
        </div>

        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="bar-group">
              <div className="bar-container">
                <div 
                  className="bar earnings-bar"
                  style={{ height: `${getBarHeight(item.earnings, maxEarnings)}%` }}
                >
                  <div className="bar-value">
                    {formatEarnings(item.earnings)}
                  </div>
                </div>
                
                <div 
                  className="bar trips-bar"
                  style={{ height: `${getBarHeight((item.trips / (maxTrips || 1)) * maxEarnings, maxEarnings)}%` }}
                >
                  <div className="trips-indicator">
                    {item.trips}
                  </div>
                </div>
              </div>
              
              <div className="bar-label">
                {getXAxisKey(item)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-summary">
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total Period Earnings</span>
            <span className="summary-value">
              ₹{data.reduce((sum, item) => sum + item.earnings, 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Trips</span>
            <span className="summary-value">
              {data.reduce((sum, item) => sum + item.trips, 0)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Average per Period</span>
            <span className="summary-value">
              ₹{Math.round(data.reduce((sum, item) => sum + item.earnings, 0) / data.length).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}