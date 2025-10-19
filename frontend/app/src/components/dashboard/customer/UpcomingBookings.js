import Link from "next/link";
import Image from "next/image";

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

export default function UpcomingBookings({ bookings = [] }) {
    return (
        <>
            <section className="upcoming-bookings-section">
                <div className="section-header">
                    <h2>Upcoming Bookings</h2>
                    <Link href="/dashboard/customer/bookings?filter=upcoming" className="view-all-link">View All</Link>
                </div>
                <div className="bookings-grid">
                    {bookings.length === 0 ? (
                        <p>No upcoming bookings.</p>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-header">
                                    <div className="booking-vehicle">
                                        <Image
                                            src={booking.vehicle?.image || "/images/ev-cars/ather-450x.svg"}
                                            alt={booking.vehicle?.name || "Vehicle"}
                                            width={60} height={40}
                                        />
                                        <div className="vehicle-info">
                                            <h4>{booking.vehicle?.name || "Unknown Vehicle"}</h4>
                                            <span className="booking-date">{formatDate(booking.startDate)}</span>
                                        </div>
                                    </div>
                                    <div className="booking-status upcoming">Upcoming</div>
                                </div>
                                <div className="booking-details">
                                    <div className="booking-location">
                                        <span><i className="fas fa-map-marker-alt"></i> {booking.vehicle?.location || 'Unknown'}</span>
                                    </div>
                                    <div className="booking-info">
                                        <span><i className="fas fa-rupee-sign"></i> ₹{booking.totalPrice?.toLocaleString() || 0}</span>
                                    </div>
                                </div>
                                <div className="booking-actions">
                                    <button className="action-btn modify">Modify</button>
                                    <button className="action-btn cancel">Cancel</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    )
}