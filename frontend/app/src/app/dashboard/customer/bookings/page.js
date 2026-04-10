'use client';
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';
import BookingsHeader from '@/components/dashboard/customer/bookings/BookingsHeader';
import BookingFilters from '@/components/dashboard/customer/bookings/BookingFilters';
import BookingsList from '@/components/dashboard/customer/bookings/BookingsList';
import BookingDetails from '@/components/dashboard/customer/bookings/BookingDetails';
import ReviewModal from '@/components/dashboard/customer/ReviewModal'; // <<< PHASE 4 IMPORT
import '@/styles/dashboard/customer/bookings/customerBookings.css';

export default function CustomerBookings() {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    // --- PHASE 4 STATE ---
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Wrapped in useCallback so it can be passed to the modal to refresh data
    const fetchBookings = useCallback(async () => {
        if (isAuthenticated && user?.id) {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('wattwheels_token');
                if (!token) throw new Error("Authentication token not found.");

                const res = await fetch('http://127.0.0.1:5000/api/bookings/', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
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
        }
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    if (authLoading || loading) {
         return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#6b7280' }}>Loading bookings...</div>;
    }

    if (!isAuthenticated || !user) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#ef4444' }}>Please log in to access your bookings</div>;
    }

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = selectedFilter === 'all' || booking.status === selectedFilter;
        const searchLower = searchTerm.toLowerCase();
        return matchesFilter && (
            (booking.vehicle_name?.toLowerCase().includes(searchLower)) ||
            (booking.location?.toLowerCase().includes(searchLower)) ||
            (booking.destination?.toLowerCase().includes(searchLower))
        );
    });

    const totalBookings = bookings.length;
    const upcomingBookings = bookings.filter(b => b.status === 'upcoming').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalSpent = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_price || 0), 0);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    // --- PHASE 4: Handler to open Review Modal ---
    const handleOpenReview = (booking) => {
        setSelectedBooking(booking);
        setShowReviewModal(true);
    };

    const handleCancelBooking = async (bookingId) => {
        try {
           const token = localStorage.getItem('wattwheels_token');
           const res = await fetch(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
             method: 'DELETE',
             headers: { 'Authorization': `Bearer ${token}` }
           });

           if (!res.ok) {
             const errorData = await res.json();
             throw new Error(errorData.error || 'Failed to cancel booking');
           }

           setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
           setShowDetailsModal(false);
         } catch (err) {
           setError(err.message);
         }
    };

    const handleModifyBooking = (bookingId) => {
        router.push(`/dashboard/customer/bookings/${bookingId}/modify`);
    };

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

                     {error && !loading && (
                      <div className="error-banner">
                          <h2>Error Loading Bookings</h2>
                          <p>{error}</p>
                          <button onClick={fetchBookings}>Retry</button>
                      </div>
                    )}

                    {!error && !loading && (
                        <BookingsList
                            bookings={filteredBookings}
                            onViewDetails={handleViewDetails}
                            onCancelBooking={handleCancelBooking}
                            onModifyBooking={handleModifyBooking}
                            onRateBooking={handleOpenReview} // <<< Pass this to the list component
                        />
                    )}

                    {showDetailsModal && selectedBooking && (
                        <BookingDetails
                            booking={selectedBooking}
                            onClose={() => setShowDetailsModal(false)}
                            onCancel={handleCancelBooking}
                            onModify={handleModifyBooking}
                        />
                    )}

                    {/* --- PHASE 4: REVIEW MODAL RENDER --- */}
                    {showReviewModal && selectedBooking && (
                        <ReviewModal 
                            booking={selectedBooking} 
                            onClose={() => setShowReviewModal(false)} 
                            onReviewSubmitted={fetchBookings} 
                        />
                    )}
                </div>
            </main>
        </>
    );
}