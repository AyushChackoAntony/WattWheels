import React from 'react';
import '@/styles/dashboard/owner/earnings/earningsOverview.css';

export default function EarningsOverview({ data, selectedTimeframe }) {
  
  // Get comparison data based on timeframe
  const getComparisonData = () => {
    switch (selectedTimeframe) {
      case 'week':
        return {
          current: data.thisWeekEarnings,
          previous: 3800, // last week
          label: 'This Week',
          compareLabel: 'vs Last Week'
        };
      case 'year':
        return {
          current: 125800, // current year
          previous: 186400, // last year
          label: 'This Year',
          compareLabel: 'vs Last Year'
        };
      default:
        return {
          current: data.thisMonthEarnings,
          previous: data.lastMonthEarnings,
          label: 'This Month',
          compareLabel: 'vs Last Month'
        };
    }
  };

  const comparisonData = getComparisonData();
  const growthAmount = comparisonData.current - comparisonData.previous;
  const growthPercentage = ((growthAmount / comparisonData.previous) * 100).toFixed(1);
  const isPositiveGrowth = growthAmount > 0;

  return (
    <div className="earnings-overview-section">
      <div className="overview-cards-grid">
        
        {/* Period Earnings Card */}
        <div className="overview-card primary">
          <div className="card-header">
            <h3>{comparisonData.label}</h3>
            <div className="card-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">
              <span className="amount">₹{comparisonData.current.toLocaleString()}</span>
            </div>
            <div className="comparison">
              <span className={`growth-change ${isPositiveGrowth ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${isPositiveGrowth ? 'up' : 'down'}`}></i>
                ₹{Math.abs(growthAmount).toLocaleString()} ({Math.abs(growthPercentage)}%)
              </span>
              <span className="comparison-label">{comparisonData.compareLabel}</span>
            </div>
          </div>
        </div>

        {/* Total Trips Card */}
        <div className="overview-card">
          <div className="card-header">
            <h3>Total Trips</h3>
            <div className="card-icon trips">
              <i className="fas fa-route"></i>
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">
              <span className="amount">{data.totalTrips}</span>
            </div>
            <div className="sub-info">
              <span>Lifetime bookings</span>
            </div>
          </div>
        </div>

        {/* Average per Trip Card */}
        <div className="overview-card">
          <div className="card-header">
            <h3>Average per Trip</h3>
            <div className="card-icon average">
              <i className="fas fa-calculator"></i>
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">
              <span className="amount">₹{data.averagePerTrip}</span>
            </div>
            <div className="sub-info">
              <span>Before commission</span>
            </div>
          </div>
        </div>

        {/* Commission Rate Card */}
        <div className="overview-card">
          <div className="card-header">
            <h3>Commission Rate</h3>
            <div className="card-icon commission">
              <i className="fas fa-percentage"></i>
            </div>
          </div>
          <div className="card-content">
            <div className="main-value">
              <span className="amount">{data.commissionRate}%</span>
            </div>
            <div className="sub-info">
              <span>Platform fee</span>
            </div>
          </div>
        </div>

      </div>

      {/* Performance Metrics */}
      <div className="performance-metrics">
        <div className="metrics-header">
          <h3>Performance Metrics</h3>
        </div>
        <div className="metrics-grid">
          
          <div className="metric-item">
            <div className="metric-icon success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="metric-info">
              <span className="metric-value">98.5%</span>
              <span className="metric-label">Trip Success Rate</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon rating">
              <i className="fas fa-star"></i>
            </div>
            <div className="metric-info">
              <span className="metric-value">4.9</span>
              <span className="metric-label">Average Rating</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon response">
              <i className="fas fa-reply"></i>
            </div>
            <div className="metric-info">
              <span className="metric-value">12 min</span>
              <span className="metric-label">Avg Response Time</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon utilization">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="metric-info">
              <span className="metric-value">87%</span>
              <span className="metric-label">Vehicle Utilization</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}