import Link from "next/link";
import Image from "next/image";

export default function CurrentBooking(){
    return (
        <>
            <section className="current-bookings-section">
            <div className="section-header">
              <h2>Current Bookings</h2>
              <Link href="#" className="view-all-link">View All</Link>
            </div>
            <div className="bookings-grid">
              <div className="booking-card">
                <div className="booking-header">
                  <div className="booking-vehicle">
                    <Image src="/images/ev-cars/tesla-model-3.svg" alt="Tesla Model 3" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Tesla Model 3</h4>
                      <span className="booking-date">Dec 18, 2024</span>
                    </div>
                  </div>
                  <div className="booking-status active">Active</div>
                </div>
                <div className="booking-details">
                  <div className="booking-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Delhi</span>
                  </div>
                  <div className="booking-info">
                    <span><i className="fas fa-clock"></i> 10:00 AM - 6:00 PM</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹2,500</span>
                  </div>
                  <div className="customer-info">
                    <span><i className="fas fa-user"></i> John Doe</span>
                    <span><i className="fas fa-phone"></i> +91 98765 43210</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn">Contact Customer</button>
                  <button className="action-btn">View Details</button>
                </div>
              </div>
              <div className="booking-card">
                <div className="booking-header">
                  <div className="booking-vehicle">
                    <Image src="/images/ev-cars/ola-s1.svg" alt="Ola S1 Pro" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Ola S1 Pro</h4>
                      <span className="booking-date">Dec 19, 2024</span>
                    </div>
                  </div>
                  <div className="booking-status upcoming">Upcoming</div>
                </div>
                <div className="booking-details">
                  <div className="booking-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Panchkula</span>
                  </div>
                  <div className="booking-info">
                    <span><i className="fas fa-clock"></i> 9:00 AM - 2:00 PM</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹800</span>
                  </div>
                  <div className="customer-info">
                    <span><i className="fas fa-user"></i> Alice Smith</span>
                    <span><i className="fas fa-phone"></i> +91 98765 43211</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn">Contact Customer</button>
                  <button className="action-btn">View Details</button>
                </div>
              </div>
            </div>
          </section>
        </>
    )
}