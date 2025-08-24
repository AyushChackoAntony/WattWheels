import Image from "next/image";
import Link from "next/link";

export default function RecentTrips(){
    return (
        <>
            <section className="recent-trips-section">
            <div className="section-header">
              <h2>Recent Trips</h2>
              <Link href="#" className="view-all-link">View All</Link>
            </div>
            <div className="trips-grid">
              <div className="trip-card">
                <div className="trip-header">
                  <div className="trip-vehicle">
                    <Image src="/images/ev-cars/tesla-model-3.svg" alt="Tesla Model 3" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Tesla Model 3</h4>
                      <span className="trip-date">Dec 15, 2024</span>
                    </div>
                  </div>
                  <div className="trip-status completed">Completed</div>
                </div>
                <div className="trip-details">
                  <div className="trip-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Delhi</span>
                  </div>
                  <div className="trip-info">
                    <span><i className="fas fa-clock"></i> 2 hours</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹2,500</span>
                  </div>
                </div>
                <div className="trip-actions">
                  <button className="action-btn">Book Again</button>
                  <button className="action-btn">View Details</button>
                </div>
              </div>
              <div className="trip-card">
                <div className="trip-header">
                  <div className="trip-vehicle">
                    <Image src="/images/ev-cars/ola-s1.svg" alt="Ola S1 Pro" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Ola S1 Pro</h4>
                      <span className="trip-date">Dec 12, 2024</span>
                    </div>
                  </div>
                  <div className="trip-status completed">Completed</div>
                </div>
                <div className="trip-details">
                  <div className="trip-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Panchkula</span>
                  </div>
                  <div className="trip-info">
                    <span><i className="fas fa-clock"></i> 45 mins</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹800</span>
                  </div>
                </div>
                <div className="trip-actions">
                  <button className="action-btn">Book Again</button>
                  <button className="action-btn">View Details</button>
                </div>
              </div>
            </div>
          </section>
        </>
    )
}