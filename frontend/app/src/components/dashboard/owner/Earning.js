import Link from "next/link";

export default function Earning(){
    return (
        <>
            <section className="earnings-overview-section">
            <div className="section-header">
              <h2>Earnings Overview</h2>
              <Link href="#" className="view-all-link">View Details</Link>
            </div>
            <div className="earnings-grid">
              <div className="earning-card">
                <div className="earning-header">
                  <h3>Weekly Earnings</h3>
                  <span className="earning-amount">₹3,200</span>
                </div>
                <div className="earning-chart">
                  <div className="chart-bar" style={{height: '60%'}}></div>
                  <div className="chart-bar" style={{height: '80%'}}></div>
                  <div className="chart-bar" style={{height: '45%'}}></div>
                  <div className="chart-bar" style={{height: '90%'}}></div>
                  <div className="chart-bar" style={{height: '70%'}}></div>
                  <div className="chart-bar" style={{height: '85%'}}></div>
                  <div className="chart-bar" style={{height: '75%'}}></div>
                </div>
                <div className="earning-stats">
                  <span>+12% from last week</span>
                </div>
              </div>
              <div className="earning-summary">
                <div className="summary-item">
                  <div className="summary-label">Total Earnings</div>
                  <div className="summary-value">₹45,800</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">This Month</div>
                  <div className="summary-value">₹12,500</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Active Rentals</div>
                  <div className="summary-value">8</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Commission Rate</div>
                  <div className="summary-value">15%</div>
                </div>
              </div>
            </div>
          </section>
        </>
    )
}