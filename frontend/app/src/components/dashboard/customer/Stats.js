export default function Stats(){
    return (
        <>
            <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-car"></i></div>
                <div className="stat-content">
                  <h3>12</h3>
                  <p>Total Rides</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-leaf"></i></div>
                <div className="stat-content">
                  <h3>45kg</h3>
                  <p>CO2 Saved</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-wallet"></i></div>
                <div className="stat-content">
                  <h3>₹8,500</h3>
                  <p>Total Spent</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-star"></i></div>
                <div className="stat-content">
                  <h3>4.8</h3>
                  <p>Rating</p>
                </div>
              </div>
            </div>
          </section>
        </>
    )
}