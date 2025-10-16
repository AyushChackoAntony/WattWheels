import Link from "next/link";
import Image from "next/image";

export default function UpcomingBookings(){
    return (
        <>
            <section className="upcoming-bookings-section">
            <div className="section-header">
              <h2>Upcoming Bookings</h2>
              <Link href="#" className="view-all-link">View All</Link>
            </div>
            <div className="bookings-grid">
              <div className="booking-card">
                <div className="booking-header">
                  <div className="booking-vehicle">
                    <Image src="/images/ev-cars/ather-450x.svg" alt="Ather 450X" width={60} height={40} />
                    <div className="vehicle-info">
                      <h4>Ather 450X</h4>
                      <span className="booking-date">Dec 20, 2024</span>
                    </div>
                  </div>
                  <div className="booking-status upcoming">Upcoming</div>
                </div>
                <div className="booking-details">
                  <div className="booking-location">
                    <span><i className="fas fa-map-marker-alt"></i> Chandigarh → Mohali</span>
                  </div>
                  <div className="booking-info">
                    <span><i className="fas fa-clock"></i> 10:00 AM</span>
                    <span><i className="fas fa-rupee-sign"></i> ₹600</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn modify">Modify</button>
                  <button className="action-btn cancel">Cancel</button>
                </div>
              </div>
            </div>
          </section>
        </>
    )
}