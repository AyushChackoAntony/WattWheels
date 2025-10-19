import Image from "next/image";
import Link from "next/link";

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

export default function RecentTrips({ trips = [] }) {
    return (
        <>
            <section className="recent-trips-section">
                <div className="section-header">
                    <h2>Recent Trips</h2>
                    <Link href="/dashboard/customer/bookings?filter=completed" className="view-all-link">View All</Link>
                </div>
                <div className="trips-grid">
                    {trips.length === 0 ? (
                        <p>No recent trips found.</p>
                    ) : (
                        trips.map((trip) => (
                            <div key={trip.id} className="trip-card">
                                <div className="trip-header">
                                    <div className="trip-vehicle">
                                        <Image
                                            src={trip.vehicle?.image || "/images/ev-cars/tesla-model-3.svg"}
                                            alt={trip.vehicle?.name || "Vehicle"}
                                            width={60} height={40}
                                        />
                                        <div className="vehicle-info">
                                            <h4>{trip.vehicle?.name || "Unknown Vehicle"}</h4>
                                            <span className="trip-date">{formatDate(trip.endDate)}</span>
                                        </div>
                                    </div>
                                    <div className="trip-status completed">Completed</div>
                                </div>
                                <div className="trip-details">
                                    <div className="trip-location">
                                        <span><i className="fas fa-map-marker-alt"></i> {trip.vehicle?.location || 'Unknown'}</span>
                                    </div>
                                    <div className="trip-info">
                                        <span><i className="fas fa-rupee-sign"></i> ₹{trip.totalPrice?.toLocaleString() || 0}</span>
                                    </div>
                                </div>
                                <div className="trip-actions">
                                    <button className="action-btn">Book Again</button>
                                    <button className="action-btn">View Details</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    )
}