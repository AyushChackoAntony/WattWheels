'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <<< Import useRouter
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';
import BookingsHeader from '@/components/dashboard/customer/bookings/BookingsHeader';
import BookingFilters from '@/components/dashboard/customer/bookings/BookingFilters';
import BookingsList from '@/components/dashboard/customer/bookings/BookingsList';
import BookingDetails from '@/components/dashboard/customer/bookings/BookingDetails';
import '@/styles/dashboard/customer/bookings/customerBookings.css';

export default function CustomerBookings() {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter(); // <<< Initialize router
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // --- useEffect for fetching bookings remains the same ---
    useEffect(() => {
        const fetchBookings = async () => {
            // ... (existing fetch logic)
            if (isAuthenticated && user?.id) {
                setLoading(true);
                setError(null);
                try {
                    const token = localStorage.getItem('wattwheels_token');
                    if (!token) {
                        throw new Error("Authentication token not found.");
                    }

                    const res = await fetch('http://127.0.0.1:5000/api/bookings/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!res.ok) {
                        let errorData;
                        try {
                           errorData = await res.json();
                        } catch (parseError) {
                           throw new Error(res.statusText || `HTTP error! status: ${res.status}`);
                        }
                        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
                    }

                    const data = await res.json();
                    setBookings(data.bookings || []);

                } catch (fetchError) {
                    console.error("Failed to fetch bookings:", fetchError);
                    setError(fetchError.message);
                    setBookings([]);
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading) {
                setLoading(false);
                setError("Please log in to view bookings.");
                setBookings([]);
            }
        };
        fetchBookings();
    }, [isAuthenticated, user, authLoading]);

    // --- Loading and Auth checks remain the same ---
    if (authLoading || loading) {
        // ... loading div
         return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#6b7280' }}>Loading bookings...</div>;
    }
    if (!isAuthenticated || !user) {
        // ... login prompt div
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#ef4444' }}>Please log in to access your bookings</div>;
    }

    // --- filteredBookings calculation and stats remain the same ---
    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = selectedFilter === 'all' || booking.status === selectedFilter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (booking.vehicleName?.toLowerCase().includes(searchLower)) ||
                             (booking.location?.toLowerCase().includes(searchLower)) ||
                             (booking.destination?.toLowerCase().includes(searchLower));
        return matchesFilter && matchesSearch;
    });
    const totalBookings = bookings.length;
    const upcomingBookings = bookings.filter(b => b.status === 'upcoming').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalSpent = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);


    // --- handleViewDetails remains the same ---
    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    // --- handleCancelBooking remains the same ---
    const handleCancelBooking = async (bookingId) => {
        // ... existing cancel logic
        try {
           const token = localStorage.getItem('wattwheels_token');
           if (!token) throw new Error("Authentication token not found.");

           const res = await fetch(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
             method: 'DELETE',
             headers: {
               'Authorization': `Bearer ${token}`
             }
           });

           if (!res.ok) {
             const errorData = await res.json();
             throw new Error(errorData.error || 'Failed to cancel booking');
           }

           setBookings(prevBookings => prevBookings.map(b =>
             b.id === bookingId ? { ...b, status: 'cancelled' } : b
           ));
           setShowDetailsModal(false);

         } catch (err) {
           console.error("Cancellation error:", err);
           setError(err.message);
         }
    };

    // <<< UPDATED handleModifyBooking >>>
    const handleModifyBooking = (bookingId) => {
        console.log('Navigating to modify booking:', bookingId);
        // Navigate to a dynamic route like /dashboard/customer/bookings/[bookingId]/modify
        router.push(`/dashboard/customer/bookings/${bookingId}/modify`);
    };
    // <<< END UPDATE >>>

    return (
        <>
            <CustomerHeader user={user} />
            <main className="dashboard-main">
                <div className="dashboard-container">
                    <BookingsHeader
                        totalBookings={totalBookings}
                        upcomingBookings={upcomingBookings}
                        completedBookings={completedBookings}
                        totalSpent={totalSpent}
                    />

                    <BookingFilters
                        selectedFilter={selectedFilter}
                        onFilterChange={setSelectedFilter}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        bookingCount={filteredBookings.length}
                    />

                    {/* ... (Error rendering) */}
                     {error && !loading && (
                      <div style={{ color: 'red', textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                          <h2>Error Loading Bookings</h2>
                          <p>{error}</p>
                          <button onClick={() => window.location.reload()} style={{ marginTop: '15px', padding: '10px 15px', cursor: 'pointer' }}>
                              Retry
                          </button>
                      </div>
                    )}

                    {!error && !loading && (
                        <BookingsList
                            bookings={filteredBookings}
                            onViewDetails={handleViewDetails}
                            onCancelBooking={handleCancelBooking}
                            onModifyBooking={handleModifyBooking} // Pass the updated handler
                        />
                    )}

                    {showDetailsModal && selectedBooking && (
                        <BookingDetails
                            booking={selectedBooking}
                            onClose={() => setShowDetailsModal(false)}
                            onCancel={handleCancelBooking}
                            onModify={handleModifyBooking} // Pass the updated handler here too if needed
                        />
                    )}
                </div>
            </main>
        </>
    );
}