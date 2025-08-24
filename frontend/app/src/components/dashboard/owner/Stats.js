import Link from "next/link";

export default function Stats(){
    return (
        <>
            <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-wallet"></i></div>
                <div className="stat-content">
                  <h3>₹12,500</h3>
                  <p>This Month</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-car"></i></div>
                <div className="stat-content">
                  <h3>3</h3>
                  <p>Active Vehicles</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-star"></i></div>
                <div className="stat-content">
                  <h3>4.9</h3>
                  <p>Rating</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div className="stat-content">
                  <h3>45</h3>
                  <p>Happy Customers</p>
                </div>
              </div>
            </div>
            </section>
        </>
    )
}