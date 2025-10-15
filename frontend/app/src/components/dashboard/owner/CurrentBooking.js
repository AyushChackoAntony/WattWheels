'use client';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function CurrentBooking() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // This hook fetches bookings for the vehicles owned by the logged-in user.
    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/bookings/?ownerId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    // This component shows currently active or upcoming bookings.
                    const currentBookings = data.bookings.filter(
                        b => b.status === 'upcoming' || b.status === 'active'
                    );
                    setBookings(currentBookings);
                }
            } catch (error) {
                console.error("Failed to fetch current bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    if (loading) {
        return (
            <section className="current-bookings-section">
                <div className="section-header">
                    <h2>Current Bookings</h2>
                </div>
                <p>Loading bookings...</p>
            </section>
        );
    }

    return (
        <section className="current-bookings-section">
            <div className="section-header">
                <h2>Current Bookings</h2>
                <Link href="#" className="view-all-link">View All</Link>
            </div>
            <div className="bookings-grid">
                {bookings.length > 0 ? (
                    bookings.slice(0, 2).map(booking => ( // Show the next 2 upcoming/active bookings.
                        <div className="booking-card" key={booking.id}>
                            <div className="booking-header">
                                <div className="booking-vehicle">
                                    <Image src={booking.vehicle.image || '/images/ev-cars/tesla-model-3.svg'} alt={booking.vehicle.name} width={60} height={40} />
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
                                    <span><i className="fas fa-calendar-alt"></i> {booking.startDate} to {booking.endDate}</span>
                                    <span><i className="fas fa-rupee-sign"></i> {booking.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="customer-info">
                                    <span><i className="fas fa-user"></i> {booking.customer.firstName} {booking.customer.lastName}</span>
                                    <span><i className="fas fa-phone"></i> {booking.customer.phone}</span>
                                </div>
                            </div>
                            <div className="booking-actions">
                                <button className="action-btn">Contact Customer</button>
                                <button className="action-btn">View Details</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No current or upcoming bookings found.</p>
                )}
            </div>
        </section>
    );
}