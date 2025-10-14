'use client';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function UpcomingBookings(){
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // This hook fetches booking data for the logged-in customer.
    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/bookings/?customerId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    // This component only shows trips that are 'upcoming' or 'active'.
                    const upcoming = data.bookings.filter(b => b.status === 'upcoming' || b.status === 'active');
                    setBookings(upcoming);
                }
            } catch (error) {
                console.error("Failed to fetch upcoming bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    if (loading) {
        return <p>Loading upcoming bookings...</p>;
    }

    return (
        <section className="upcoming-bookings-section">
            <div className="section-header">
              <h2>Upcoming Bookings</h2>
              <Link href="/dashboard/customer/bookings" className="view-all-link">View All</Link>
            </div>
            <div className="bookings-grid">
                {bookings.length > 0 ? (
                    bookings.slice(0, 1).map(booking => ( // Show only the next upcoming booking on the dashboard.
                        <div className="booking-card" key={booking.id}>
                            <div className="booking-header">
                                <div className="booking-vehicle">
                                    <Image src={booking.vehicle.image || '/images/ev-cars/ather-450x.svg'} alt={booking.vehicle.name} width={60} height={40} />
                                    <div className="vehicle-info">
                                        <h4>{booking.vehicle.name}</h4>
                                        <span className="booking-date">{new Date(booking.startDate).toLocaleDateString('en-IN')}</span>
                                    </div>
                                </div>
                                <div className={`booking-status ${booking.status}`}>{booking.status}</div>
                            </div>
                            <div className="booking-details">
                                <div className="booking-location">
                                    <span><i className="fas fa-map-marker-alt"></i> {booking.vehicle.location}</span>
                                </div>
                                <div className="booking-info">
                                    <span><i className="fas fa-calendar-alt"></i> {booking.startDate}</span>
                                    <span><i className="fas fa-rupee-sign"></i> {booking.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="booking-actions">
                                <button className="action-btn modify">Modify</button>
                                <button className="action-btn cancel">Cancel</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no upcoming bookings.</p>
                )}
            </div>
        </section>
    );
}