import React from 'react';
import '@/styles/dashboard/owner/earnings/earningsChart.css';

export default function EarningsChart({ data, timeframe }) {
  
  // Find the maximum earnings value for scaling
  const maxEarnings = Math.max(...data.map(item => item.earnings));
  const maxTrips = Math.max(...data.map(item => item.trips));

  // Get the appropriate key based on timeframe
  const getXAxisKey = () => {
    switch (timeframe) {
      case 'week':
        return 'week';
      case 'year':
        return 'year';
      default:
        return 'month';
    }
  };

  const xAxisKey = getXAxisKey();

  // Calculate bar height percentage
  const getBarHeight = (value, max) => {
    return Math.max((value / max) * 100, 5); // Minimum 5% height for visibility
  };

  // Format earnings for display
  const formatEarnings = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
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
        {/* Chart Grid Lines */}
        <div className="chart-grid">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="grid-line" style={{
              bottom: `${(index + 1) * 20}%`
            }}>
              <span className="grid-label">
                {formatEarnings((maxEarnings / 5) * (index + 1))}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Bars */}
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="bar-group">
              {/* Earnings Bar */}
              <div className="bar-container">
                <div 
                  className="bar earnings-bar"
                  style={{ 
                    height: `${getBarHeight(item.earnings, maxEarnings)}%` 
                  }}
                  data-tooltip={`${formatEarnings(item.earnings)}`}
                >
                  <div className="bar-value">
                    {formatEarnings(item.earnings)}
                  </div>
                </div>
                
                {/* Trips Bar (smaller, overlaid) */}
                <div 
                  className="bar trips-bar"
                  style={{ 
                    height: `${getBarHeight((item.trips / maxTrips) * maxEarnings, maxEarnings)}%` 
                  }}
                  data-tooltip={`${item.trips} trips`}
                >
                  <div className="trips-indicator">
                    {item.trips}
                  </div>
                </div>
              </div>
              
              {/* X-Axis Label */}
              <div className="bar-label">
                {item[xAxisKey]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Summary */}
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