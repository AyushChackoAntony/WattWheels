'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';
import '@/styles/booking-modify.css'; 

export default function ModifyBookingPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const params = useParams(); // Gets { bookingId: '...' } from route
    const router = useRouter();
    const bookingId = params.bookingId;

    const [booking, setBooking] = useState(null);
    const [newPickupDate, setNewPickupDate] = useState('');
    const [newDropoffDate, setNewDropoffDate] = useState('');
    // Add state for times if you want to modify those too
    // const [newPickupTime, setNewPickupTime] = useState('');
    // const [newDropoffTime, setNewDropoffTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Fetch original booking details
    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId || !isAuthenticated) return;
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('wattwheels_token');
                if (!token) throw new Error("Authentication token missing.");

                const res = await fetch(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `HTTP error ${res.status}`);
                }
                const data = await res.json();
                setBooking(data);
                // Pre-fill date inputs with current booking dates
                setNewPickupDate(data.pickupDate); // Assuming format is YYYY-MM-DD
                setNewDropoffDate(data.dropoffDate);
                // Pre-fill times if modifying them
                // setNewPickupTime(data.pickupTime); // Assuming format is HH:MM (adjust parsing if needed)
                // setNewDropoffTime(data.dropoffTime);

            } catch (err) {
                console.error("Failed to fetch booking details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookingDetails();
    }, [bookingId, isAuthenticated]);

    // Handle saving modifications
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!newPickupDate || !newDropoffDate) {
            setSaveError("Please select both new pickup and dropoff dates.");
            return;
        }
         if (new Date(newPickupDate) >= new Date(newDropoffDate)) {
             setSaveError("New dropoff date must be after new pickup date.");
             return;
         }
         // Optional: Add check if dates actually changed

        setIsSaving(true);
        setSaveError(null);
        try {
            const token = localStorage.getItem('wattwheels_token');
            if (!token) throw new Error("Authentication token missing.");

            // --- Construct ISO dates with time (similar to create booking) ---
            const startTime = 'T12:00:00.000Z'; // Or use time state
            const endTime = 'T12:00:00.000Z';   // Or use time state

            const updateData = {
                start_date: `${newPickupDate}${startTime}`,
                end_date: `${newDropoffDate}${endTime}`,
                // Add other fields being modified (e.g., destination)
            };

            const res = await fetch(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
                method: 'PUT', // Use PUT or PATCH based on your backend API design
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const result = await res.json();

            if (!res.ok) {
                // Handle potential conflicts (e.g., new dates unavailable)
                throw new Error(result.error || "Failed to update booking. New dates might be unavailable.");
            }

            alert("Booking updated successfully!");
            router.push('/dashboard/customer/bookings'); // Go back to bookings list

        } catch (err) {
            console.error("Failed to save booking changes:", err);
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Loading/Auth/Error checks ---
    if (authLoading || loading) {
         return <div style={{ padding: '20px', textAlign: 'center' }}>Loading booking details...</div>;
    }
     if (!isAuthenticated || !user) {
         return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Please log in to modify bookings.</div>;
     }
    if (error) {
        return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Error loading booking: {error}</div>;
    }
     if (!booking) {
         return <div style={{ padding: '20px', textAlign: 'center' }}>Booking not found.</div>;
     }
     // Check if booking is actually modifiable (e.g., upcoming)
     if (booking.status !== 'upcoming') {
         return (
            <>
                <CustomerHeader user={user} />
                <main className="dashboard-main">
                    <div className="dashboard-container" style={{ padding: '20px', textAlign: 'center' }}>
                         <h2>Cannot Modify Booking</h2>
                         <p>This booking is already '{booking.status}' and cannot be modified.</p>
                         <button onClick={() => router.back()}>Go Back</button>
                    </div>
                </main>
            </>
         );
     }

     const today = new Date().toISOString().split('T')[0];

    // --- Render Form ---
    return (
        <>
            <CustomerHeader user={user} />
            <main className="dashboard-main">
                <div className="dashboard-container modify-booking-container"> {/* Add a class for styling */}
                    <h2>Modify Booking #{bookingId}</h2>
                    <p>Vehicle: <strong>{booking.vehicleName}</strong></p>

                    <form onSubmit={handleSaveChanges} className="modify-form">
                        <div className="form-section">
                            <h3>Select New Dates</h3>
                             <div className="date-inputs-modify">
                                <div>
                                    <label htmlFor="newPickupDate">New Pickup Date:</label>
                                    <input
                                        type="date"
                                        id="newPickupDate"
                                        value={newPickupDate}
                                        min={today}
                                        onChange={(e) => setNewPickupDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newDropoffDate">New Dropoff Date:</label>
                                    <input
                                        type="date"
                                        id="newDropoffDate"
                                        value={newDropoffDate}
                                        min={newPickupDate || today}
                                        onChange={(e) => setNewDropoffDate(e.target.value)}
                                        required
                                    />
                                </div>
                             </div>
                             {/* Add time inputs here if needed */}
                        </div>

                        {saveError && <p className="error-message">{saveError}</p>}

                        <div className="form-actions-modify">
                            <button
                                type="button"
                                onClick={() => router.back()} // Go back without saving
                                disabled={isSaving}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving || !newPickupDate || !newDropoffDate || (newPickupDate === booking.pickupDate && newDropoffDate === booking.dropoffDate)} // Disable if no changes
                                className="save-btn"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}