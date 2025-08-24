import Link from "next/link";
import Image from "next/image";

export default function VehicleManagement(){
    return (
        <>
           <section className="vehicle-management-section">
            <div className="section-header">
              <h2>Vehicle Management</h2>
              <Link href="#" className="view-all-link">Manage All</Link>
            </div>
            <div className="vehicles-grid">
              <div className="vehicle-card">
                <div className="vehicle-header">
                  <div className="vehicle-info">
                    <Image src="/images/ev-cars/tesla-model-3.svg" alt="Tesla Model 3" width={60} height={40} />
                    <div className="vehicle-details">
                      <h4>Tesla Model 3</h4>
                      <span className="vehicle-status active">Active</span>
                    </div>
                  </div>
                  <div className="vehicle-earnings">
                    <span className="earning-amount">₹8,500</span>
                    <span className="earning-period">This month</span>
                  </div>
                </div>
                <div className="vehicle-stats">
                  <div className="stat-item">
                    <span className="stat-label">Bookings</span>
                    <span className="stat-value">12</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">4.9</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Availability</span>
                    <span className="stat-value">85%</span>
                  </div>
                </div>
                <div className="vehicle-actions">
                  <button className="action-btn">Edit Details</button>
                  <button className="action-btn">View Bookings</button>
                </div>
              </div>
              <div className="vehicle-card">
                <div className="vehicle-header">
                  <div className="vehicle-info">
                    <Image src="/images/ev-cars/ola-s1.svg" alt="Ola S1 Pro" width={60} height={40} />
                    <div className="vehicle-details">
                      <h4>Ola S1 Pro</h4>
                      <span className="vehicle-status active">Active</span>
                    </div>
                  </div>
                  <div className="vehicle-earnings">
                    <span className="earning-amount">₹4,200</span>
                    <span className="earning-period">This month</span>
                  </div>
                </div>
                <div className="vehicle-stats">
                  <div className="stat-item">
                    <span className="stat-label">Bookings</span>
                    <span className="stat-value">8</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Rating</span>
                    <span className="stat-value">4.8</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Availability</span>
                    <span className="stat-value">90%</span>
                  </div>
                </div>
                <div className="vehicle-actions">
                  <button className="action-btn">Edit Details</button>
                  <button className="action-btn">View Bookings</button>
                </div>
              </div>
            </div>
          </section>
        </>
    )
}