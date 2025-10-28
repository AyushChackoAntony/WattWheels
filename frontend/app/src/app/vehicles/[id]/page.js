'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';
import Navbar from '@/components/Navbar';
import '@/styles/vehicle-details.css'; // Ensure CSS is imported

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

    // --- NEW: State for dates selected ON THIS PAGE ---
    const initialPickupDate = searchParams.get('pickup') || '';
    const initialDropoffDate = searchParams.get('dropoff') || '';
    const [selectedPickupDate, setSelectedPickupDate] = useState(initialPickupDate);
    const [selectedDropoffDate, setSelectedDropoffDate] = useState(initialDropoffDate);
    // --- END NEW ---

    const vehicleId = params.id;

    // Fetch Vehicle Details (remains the same)
    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (!vehicleId) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/vehicles/${vehicleId}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setVehicle(data);
            } catch (err) {
                console.error("Failed to fetch vehicle details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicleDetails();
    }, [vehicleId]);

    // Handle Booking (uses state dates now)
    const handleBookNow = async () => {
        if (!isAuthenticated) {
            router.push('/login/customer');
            return;
        }
        // --- UPDATED: Use state dates for validation ---
        if (!selectedPickupDate || !selectedDropoffDate) {
            setBookingError("Please select pickup and dropoff dates to book.");
            return;
        }
        if (new Date(selectedPickupDate) >= new Date(selectedDropoffDate)) {
             setBookingError("Drop-off date must be after pickup date.");
             return;
        }
        // --- END UPDATED ---

        setIsBooking(true);
        setBookingError(null);
        try {
            const token = localStorage.getItem('wattwheels_token');
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }

            const startTime = 'T12:00:00.000Z'; // Example: Noon UTC
            const endTime = 'T12:00:00.000Z';   // Example: Noon UTC

            const bookingData = {
                vehicle_id: parseInt(vehicleId),
                // --- UPDATED: Use state dates for booking ---
                start_date: `${selectedPickupDate}${startTime}`,
                end_date: `${selectedDropoffDate}${endTime}`,
                // --- END UPDATED ---
            };

            const res = await fetch('http://127.0.0.1:5000/api/bookings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Booking failed. Vehicle might be unavailable for these dates.");
            }

            alert("Booking successful! Redirecting to My Bookings.");
            router.push('/dashboard/customer/bookings');

        } catch (err) {
            console.error("Booking failed:", err);
            setBookingError(err.message);
        } finally {
            setIsBooking(false);
        }
    };

    // Calculate number of days based on STATE dates
    let numberOfDays = 0;
    let estimatedPrice = 0;
    if (selectedPickupDate && selectedDropoffDate && vehicle) {
        try {
            const start = new Date(selectedPickupDate);
            const end = new Date(selectedDropoffDate);
            if (end > start) {
                const diffTime = Math.abs(end - start);
                numberOfDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // Min 1 day
                estimatedPrice = vehicle.pricePerDay * numberOfDays;
            } else {
                 numberOfDays = 0; // Reset if dates are invalid
                 estimatedPrice = 0;
            }
        } catch (e) {
            console.error("Error calculating days:", e);
            numberOfDays = 0;
            estimatedPrice = 0;
        }
    }


    if (loading || authLoading) {
        return <div className="status-message">Loading vehicle details...</div>;
    }
    if (error) {
        return <div className="status-message error">Error loading vehicle: {error}</div>;
    }
    if (!vehicle) {
        return <div className="status-message">Vehicle not found.</div>;
    }

    // --- Get today's date for min attribute in date inputs ---
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            {isAuthenticated && user ? <CustomerHeader user={user} /> : <Navbar />}
            <main className="vehicle-details-main">
                <div className="vehicle-details-container">
                    {/* Vehicle Image Gallery (Simplified) */}
                    <div className="vehicle-image-gallery">
                         {/* ... Image component ... */}
                         <Image
                            src={vehicle.image || "/images/ev-cars/default.svg"}
                            alt={vehicle.name}
                            width={600}
                            height={400}
                            className="main-vehicle-image"
                            priority
                            onError={(e) => e.target.src = '/images/ev-cars/default.svg'}
                        />
                    </div>

                    {/* Vehicle Info & Booking Section */}
                    <div className="vehicle-info-booking">
                        <h1>{vehicle.name}</h1>
                         {/* ... other vehicle details (location, specs, features, owner) ... */}
                         <p className="vehicle-location"><i className="fas fa-map-marker-alt"></i> {vehicle.location}</p>

                        <div className="vehicle-specs-detailed">
                          <span><i className={vehicle.type === 'car' ? "fas fa-car" : "fas fa-motorcycle"}></i> {vehicle.type?.toUpperCase()}</span>
                          {vehicle.year && <span><i className="fas fa-calendar-alt"></i> {vehicle.year}</span>}
                          {vehicle.batteryRange && <span><i className="fas fa-battery-three-quarters"></i> {vehicle.batteryRange} Range</span>}
                          {vehicle.acceleration && <span><i className="fas fa-tachometer-alt"></i> {vehicle.acceleration}</span>}
                        </div>

                         {vehicle.features && vehicle.features.length > 0 && (
                            <div className="vehicle-features-list">
                                <h4>Features:</h4>
                                <ul>
                                {vehicle.features.map((feature, index) => (
                                    <li key={index}><i className="fas fa-check-circle"></i> {feature}</li>
                                ))}
                                </ul>
                            </div>
                        )}

                        {vehicle.ownerInfo && (
                            <div className="owner-info-details">
                                <h4>Hosted by {vehicle.ownerInfo.firstName}</h4>
                            </div>
                        )}

                        {/* --- UPDATED Booking Summary --- */}
                        <div className="booking-summary">
                            <h3>Select Dates & Book</h3>

                            {/* --- NEW: Date Inputs --- */}
                            <div className="date-selection-inputs">
                                <div className="date-input-group">
                                    <label htmlFor="pickupDate">Pickup Date</label>
                                    <input
                                        type="date"
                                        id="pickupDate"
                                        value={selectedPickupDate}
                                        min={today} // Prevent selecting past dates
                                        onChange={(e) => setSelectedPickupDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="date-input-group">
                                    <label htmlFor="dropoffDate">Dropoff Date</label>
                                    <input
                                        type="date"
                                        id="dropoffDate"
                                        value={selectedDropoffDate}
                                        min={selectedPickupDate || today} // Min dropoff is pickup date or today
                                        onChange={(e) => setSelectedDropoffDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {/* --- END NEW --- */}


                            {/* Display calculated price if dates are valid */}
                            {numberOfDays > 0 && (
                                <>
                                    <p><strong>Duration:</strong> {numberOfDays} day{numberOfDays > 1 ? 's' : ''}</p>
                                    <div className="estimated-price">
                                        Estimated Price: <span>₹{estimatedPrice.toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                             {/* Show prompt if dates invalid/not selected */}
                             {numberOfDays <= 0 && (!selectedPickupDate || !selectedDropoffDate) && (
                                <p className="select-dates-prompt info">
                                    Select your pickup and dropoff dates above.
                                </p>
                             )}
                              {numberOfDays <= 0 && selectedPickupDate && selectedDropoffDate && (
                                <p className="select-dates-prompt error">
                                    Dropoff date must be after pickup date.
                                </p>
                             )}

                            {bookingError && <p className="booking-error">{bookingError}</p>}

                            <button
                                className="book-now-button"
                                onClick={handleBookNow}
                                disabled={!selectedPickupDate || !selectedDropoffDate || numberOfDays <= 0 || isBooking || !isAuthenticated}
                            >
                                {isBooking ? (
                                    <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                                ) : (
                                    isAuthenticated ? 'Book Now' : 'Login to Book'
                                )}
                            </button>
                        </div>
                        {/* --- END UPDATED Booking Summary --- */}


                        {/* ... (Description, Policies etc.) ... */}
                        {vehicle.description && (
                            <div className="vehicle-description">
                                <h4>Description</h4>
                                <p>{vehicle.description}</p>
                            </div>
                        )}

                         <div className="cancellation-policy-details">
                             <h4>Cancellation Policy</h4>
                             <p>{vehicle.cancellationPolicy || 'Standard Policy. Please contact owner for details.'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}