'use client';
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function RecentTrips(){
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    // This hook fetches the booking history for the logged-in customer.
    useEffect(() => {
        const fetchTrips = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/bookings/?customerId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    // This component shows trips that are already completed.
                    const completedTrips = data.bookings.filter(b => b.status === 'completed');
                    setTrips(completedTrips);
                }
            } catch (error) {
                console.error("Failed to fetch recent trips:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [user]);

    if (loading) {
        return <p>Loading recent trips...</p>;
    }

    return (
        <section className="recent-trips-section">
            <div className="section-header">
              <h2>Recent Trips</h2>
              <Link href="/dashboard/customer/bookings" className="view-all-link">View All</Link>
            </div>
            <div className="trips-grid">
                {trips.length > 0 ? (
                    trips.slice(0, 2).map(trip => ( // We'll show the 2 most recent trips here.
                        <div className="trip-card" key={trip.id}>
                            <div className="trip-header">
                                <div className="trip-vehicle">
                                    <Image src={trip.vehicle.image || '/images/ev-cars/tesla-model-3.svg'} alt={trip.vehicle.name} width={60} height={40} />
                                    <div className="vehicle-info">
                                        <h4>{trip.vehicle.name}</h4>
                                        <span className="trip-date">{new Date(trip.endDate).toLocaleDateString('en-IN')}</span>
                                    </div>
                                </div>
                                <div className="trip-status completed">{trip.status}</div>
                            </div>
                            <div className="trip-details">
                                <div className="trip-location">
                                    <span><i className="fas fa-map-marker-alt"></i> {trip.vehicle.location}</span>
                                </div>
                                <div className="trip-info">
                                    <span><i className="fas fa-calendar-alt"></i> {trip.startDate} to {trip.endDate}</span>
                                    <span><i className="fas fa-rupee-sign"></i> {trip.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="trip-actions">
                                <button className="action-btn">Book Again</button>
                                <button className="action-btn">View Details</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no recent trips.</p>
                )}
            </div>
        </section>
    );
}