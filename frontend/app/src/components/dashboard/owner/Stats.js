// Remove Link import if not used
// import Link from "next/link";

// Accept props for dynamic data
export default function Stats({ thisMonthEarnings, activeVehicles, rating, happyCustomers }) {
    return (
        <>
            <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-wallet"></i></div>
                <div className="stat-content">
                  {/* Display dynamic earnings, provide default '0' */}
                  <h3>₹{thisMonthEarnings?.toLocaleString() ?? 0}</h3>
                  <p>This Month</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-car"></i></div>
                <div className="stat-content">
                  {/* Display dynamic active vehicles, provide default '0' */}
                  <h3>{activeVehicles ?? 0}</h3>
                  <p>Active Vehicles</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-star"></i></div>
                <div className="stat-content">
                  {/* Display dynamic rating (formatted), provide default 'N/A' */}
                  <h3>{rating ? rating.toFixed(1) : 'N/A'}</h3>
                  <p>Rating</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div className="stat-content">
                   {/* Display dynamic customer count, provide default '0' */}
                  <h3>{happyCustomers ?? 0}</h3>
                  <p>Happy Customers</p>
                </div>
              </div>
            </div>
            </section>
        </>
    )
}