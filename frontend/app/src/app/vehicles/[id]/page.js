'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';
import Navbar from '@/components/Navbar';
import '@/styles/vehicle-details.css';

export default function VehicleDetailsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingError, setBookingError] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    // Phase 1 Update: Use datetime-local strings for hourly granularity
    const initialPickup = searchParams.get('pickup') ? `${searchParams.get('pickup')}T10:00` : '';
    const initialDropoff = searchParams.get('dropoff') ? `${searchParams.get('dropoff')}T10:00` : '';
    
    const [selectedPickup, setSelectedPickup] = useState(initialPickup);
    const [selectedDropoff, setSelectedDropoff] = useState(initialDropoff);

    const vehicleId = params.id;

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (!vehicleId) return;
            setLoading(true);
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/vehicles/${vehicleId}`);
                if (!res.ok) throw new Error("Failed to load vehicle details");
                const data = await res.json();
                setVehicle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicleDetails();
    }, [vehicleId]);

    // Phase 1 Update: Logic to trigger Stripe Checkout
    const handleBookNow = async () => {
        if (!isAuthenticated) {
            router.push('/login/customer');
            return;
        }
        if (!selectedPickup || !selectedDropoff) {
            setBookingError("Please select pickup and dropoff times.");
            return;
        }

        setIsBooking(true);
        setBookingError(null);

        try {
            const token = localStorage.getItem('wattwheels_token');
            
            // 1. Create the Pending Booking and get ID/Total Price
            const bookingRes = await fetch('http://127.0.0.1:5000/api/bookings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicle_id: vehicleId,
                    start_date: selectedPickup, // backend now parses this ISO string
                    end_date: selectedDropoff,
                }),
            });

            const bookingData = await bookingRes.json();
            if (!bookingRes.ok) throw new Error(bookingData.error || "Booking failed");

            // 2. Create Stripe Checkout Session using the new booking ID
            const paymentRes = await fetch('http://127.0.0.1:5000/api/payments/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bookingId: bookingData.booking_id }),
            });

            const paymentData = await paymentRes.json();
            if (!paymentRes.ok) throw new Error(paymentData.error || "Payment initialization failed");

            // 3. Redirect user to Stripe secure payment page
            window.location.href = paymentData.url;

        } catch (err) {
            setBookingError(err.message);
            setIsBooking(false);
        }
    };

    // Phase 1 Update: Calculation based on exact hours
    let hours = 0;
    let estimatedPrice = 0;
    if (selectedPickup && selectedDropoff && vehicle) {
        const start = new Date(selectedPickup);
        const end = new Date(selectedDropoff);
        if (end > start) {
            hours = Math.ceil((end - start) / (1000 * 60 * 60));
            // Use pricePerHour if available, otherwise day/24
            const rate = vehicle.pricePerHour || (vehicle.pricePerDay / 24);
            estimatedPrice = hours * rate;
        }
    }

    if (loading || authLoading) return <div className="status-message">Loading...</div>;
    if (!vehicle) return <div className="status-message">Vehicle not found.</div>;

    const now = new Date().toISOString().slice(0, 16);

    return (
        <>
            {isAuthenticated && user ? <CustomerHeader user={user} /> : <Navbar />}
            <main className="vehicle-details-main">
                <div className="vehicle-details-container">
                    <div className="vehicle-image-gallery">
                        <Image 
                            src={vehicle.image || "/images/ev-cars/default.svg"} 
                            alt={vehicle.name} 
                            width={600} height={400} 
                            className="main-vehicle-image"
                        />
                    </div>

                    <div className="vehicle-info-booking">
                        <h1>{vehicle.name}</h1>
                        <p className="vehicle-location">{vehicle.location}</p>

                        <div className="booking-summary">
                            <h3>Select Time & Book</h3>
                            
                            <div className="date-selection-inputs">
                                <div className="date-input-group">
                                    <label>Pickup Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={selectedPickup}
                                        min={now}
                                        onChange={(e) => setSelectedPickup(e.target.value)}
                                    />
                                </div>
                                <div className="date-input-group">
                                    <label>Dropoff Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={selectedDropoff}
                                        min={selectedPickup || now}
                                        onChange={(e) => setSelectedDropoff(e.target.value)}
                                    />
                                </div>
                            </div>

                            {hours > 0 && (
                                <div className="price-details">
                                    <p><strong>Duration:</strong> {hours} Hour{hours > 1 ? 's' : ''}</p>
                                    <div className="estimated-price">
                                        Total: <span>₹{Math.round(estimatedPrice).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            {bookingError && <p className="booking-error">{bookingError}</p>}

                            <button
                                className="book-now-button"
                                onClick={handleBookNow}
                                disabled={hours <= 0 || isBooking}
                            >
                                {isBooking ? 'Processing...' : isAuthenticated ? 'Pay & Confirm' : 'Login to Book'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}