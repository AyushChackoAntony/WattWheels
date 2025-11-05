import React from 'react';
import '@/styles/dashboard/owner/earnings/earningsOverview.css';

export default function EarningsOverview({ data, selectedTimeframe }) {
  
  // Get comparison data based on timeframe
  const getComparisonData = () => {
    switch (selectedTimeframe) {
      case 'week':
        return {
          current: data.thisWeekEarnings,
          previous: 0, // Backend doesn't provide last week, so default to 0
          label: 'This Week',
          compareLabel: 'vs Last Week'
        };
      case 'year':
        return {
          current: 0, // Backend doesn't provide this year summary
          previous: 0, // Backend doesn't provide last year summary
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

  // --- UPDATED: Fix for NaN% ---
  let growthPercentage = 0;
  if (comparisonData.previous > 0) {
    growthPercentage = (growthAmount / comparisonData.previous) * 100;
  } else if (comparisonData.current > 0) {
    growthPercentage = 100; // Grew from 0 to something
  }
  const isPositiveGrowth = growthAmount > 0;
  // --- END UPDATE ---

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
              {/* --- UPDATED: Show dynamic percentage with NaN check --- */}
              {comparisonData.current > 0 || comparisonData.previous > 0 ? (
                <span className={`growth-change ${isPositiveGrowth ? 'positive' : 'negative'}`}>
                  <i className={`fas fa-arrow-${isPositiveGrowth ? 'up' : 'down'}`}></i>
                  ₹{Math.abs(growthAmount).toLocaleString()} ({Math.abs(growthPercentage).toFixed(1)}%)
                </span>
              ) : (
                 <span className="growth-change">
                   ₹0 (0.0%)
                 </span>
              )}
              <span className="comparison-label">{comparisonData.compareLabel}</span>
              {/* --- END UPDATE --- */}
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
              {/* --- UPDATED: Use dynamic data --- */}
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
              {/* --- UPDATED: Use dynamic data --- */}
              <span className="amount">₹{data.averagePerTrip.toLocaleString()}</span>
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
              {/* --- UPDATED: Use dynamic data --- */}
              <span className="amount">{data.commissionRate}%</span>
            </div>
            <div className="sub-info">
              <span>Platform fee</span>
            </div>
          </div>
        </div>

      </div>

      {/* --- UPDATED: Performance Metrics --- */}
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
              {/* Use dynamic prop */}
              <span className="metric-value">{data.tripSuccessRate}</span>
              <span className="metric-label">Trip Success Rate</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon rating">
              <i className="fas fa-star"></i>
            </div>
            <div className="metric-info">
              {/* Use dynamic prop */}
              <span className="metric-value">{data.averageRating}</span>
              <span className="metric-label">Average Rating</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon response">
              <i className="fas fa-reply"></i>
            </div>
            <div className="metric-info">
              {/* Use dynamic prop */}
              <span className="metric-value">{data.avgResponseTime}</span>
              <span className="metric-label">Avg Response Time</span>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon utilization">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="metric-info">
              {/* Use dynamic prop */}
              <span className="metric-value">{data.vehicleUtilization}</span>
              <span className="metric-label">Vehicle Utilization</span>
            </div>
          </div>

        </div>
      </div>
      {/* --- END UPDATE --- */}
    </div>
  );
}