export default function Stats({ totalRides, co2Saved, totalSpent, rating }) {
    return (
        <>
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-car"></i></div>
                        <div className="stat-content">
                            <h3>{totalRides ?? 0}</h3>
                            <p>Total Rides</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-leaf"></i></div>
                        <div className="stat-content">
                            <h3>{co2Saved ?? '0kg'}</h3>
                            <p>CO2 Saved</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-wallet"></i></div>
                        <div className="stat-content">
                            <h3>₹{totalSpent?.toLocaleString() ?? 0}</h3>
                            <p>Total Spent</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-star"></i></div>
                        <div className="stat-content">
                            <h3>{rating ?? 'N/A'}</h3>
                            <p>Rating</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}