import Link from "next/link";

// Accept props for dynamic data, provide default for weeklyTrend
export default function Earning({ thisMonth, weeklyTrend = [] }){

    // Function to render chart bars based on data
    const renderChartBars = () => {
        // Handle case where trend data might be missing or empty
        if (!weeklyTrend || weeklyTrend.length === 0) {
             // Display a message if no trend data is available
             return <div style={{height: '60px', color: 'var(--text-secondary)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Trend data unavailable</div>;
        }
        // Find max earning in the trend data to scale bars (ensure it's not zero)
        const maxEarning = Math.max(...weeklyTrend.map(d => d.earning), 1); // Use 1 as minimum max to avoid division by zero
        return weeklyTrend.map((data, index) => (
            <div
                key={index}
                className="chart-bar"
                // Calculate height percentage, ensuring minimum height (e.g., 5%) for visibility
                style={{ height: `${Math.max((data.earning / maxEarning) * 100, 5)}%` }}
                // Add a title attribute for tooltip on hover
                title={`${data.day || `Day ${index+1}`}: ₹${data.earning?.toLocaleString() ?? 0}`}
            ></div>
        ));
    };

    return (
        <>
            <section className="earnings-overview-section">
            <div className="section-header">
              <h2>Earnings Overview</h2>
              {/* Link to the detailed earnings page */}
              <Link href="/dashboard/owner/earnings" className="view-all-link">View Details</Link>
            </div>
            <div className="earnings-grid">
              <div className="earning-card">
                <div className="earning-header">
                  {/* Title can be adjusted based on the trend data (e.g., Weekly/Monthly Trend) */}
                  <h3>Weekly Trend</h3>
                  {/* Optionally, display the total earnings for the trend period */}
                   {/* <span className="earning-amount">₹{weeklyTrend.reduce((sum, d) => sum + d.earning, 0).toLocaleString()}</span> */}
                </div>
                <div className="earning-chart">
                   {/* Render bars dynamically */}
                  {renderChartBars()}
                </div>
                {/* Comparison text can be made dynamic if backend provides previous period data */}
                {/* <div className="earning-stats">
                  <span>+12% from last week</span>
                </div> */}
              </div>
              <div className="earning-summary">
                {/* Total Lifetime Earnings might require a separate prop or calculation */}
                {/* <div className="summary-item">
                  <div className="summary-label">Total Earnings</div>
                  <div className="summary-value">₹ --,--</div>
                </div> */}
                <div className="summary-item">
                  <div className="summary-label">This Month</div>
                  {/* Display dynamic monthly earnings from prop */}
                  <div className="summary-value">₹{thisMonth?.toLocaleString() ?? 0}</div>
                </div>
                 {/* Active Rentals could be passed as another prop if needed */}
                <div className="summary-item">
                  <div className="summary-label">Active Rentals</div>
                  <div className="summary-value">--</div> {/* Placeholder */}
                </div>
                <div className="summary-item">
                  <div className="summary-label">Commission Rate</div>
                  <div className="summary-value">15%</div> {/* Assuming fixed */}
                </div>
              </div>
            </div>
          </section>
        </>
    )
}