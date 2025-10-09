'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
// import Header from '@/components/dashboard/customer/CustomerHeader';
import BookingsHeader from '@/components/dashboard/customer/bookings/BookingsHeader';
import BookingFilters from '@/components/dashboard/customer/bookings/BookingFilters';
import BookingsList from '@/components/dashboard/customer/bookings/BookingsList';
import BookingDetails from '@/components/dashboard/customer/bookings/BookingDetails';
import '@/styles/dashboard/customer/bookings/customerBookings.css';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';

export default function CustomerBookings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock bookings data
  const [bookings] = useState([
    {
      id: 1,
      vehicleName: 'Tesla Model 3',
      vehicleType: 'car',
      vehicleImage: '/images/ev-cars/tesla-model-3.svg',
      pickupDate: '2024-12-20',
      dropoffDate: '2024-12-22',
      pickupTime: '10:00 AM',
      dropoffTime: '10:00 AM',
      location: 'Chandigarh',
      destination: 'Delhi',
      totalPrice: 5000,
      status: 'upcoming',
      bookingDate: '2024-12-15',
      owner: 'Sarah Johnson',
      ownerPhone: '+91 98765 43210',
      ownerRating: 4.9,
      licensePlate: 'CH01EV1234',
      batteryRange: '350km',
      features: ['Autopilot', 'Premium Sound', 'Leather Seats'],
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
    },
    {
      id: 2,
      vehicleName: 'Ola S1 Pro',
      vehicleType: 'bike',
      vehicleImage: '/images/ev-cars/ola-s1.svg',
      pickupDate: '2024-12-18',
      dropoffDate: '2024-12-18',
      pickupTime: '9:00 AM',
      dropoffTime: '6:00 PM',
      location: 'Chandigarh',
      destination: 'Panchkula',
      totalPrice: 800,
      status: 'completed',
      bookingDate: '2024-12-16',
      owner: 'Raj Kumar',
      ownerPhone: '+91 98765 43211',
      ownerRating: 4.8,
      licensePlate: 'CH01EV5678',
      batteryRange: '180km',
      features: ['Cruise Control', 'Fast Charging'],
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
    },
    {
      id: 3,
      vehicleName: 'Ather 450X',
      vehicleType: 'bike',
      vehicleImage: '/images/ev-cars/ather-450x.svg',
      pickupDate: '2024-12-10',
      dropoffDate: '2024-12-10',
      pickupTime: '2:00 PM',
      dropoffTime: '8:00 PM',
      location: 'Chandigarh',
      destination: 'Mohali',
      totalPrice: 600,
      status: 'completed',
      bookingDate: '2024-12-08',
      owner: 'Priya Sharma',
      ownerPhone: '+91 98765 43212',
      ownerRating: 4.9,
      licensePlate: 'CH01EV9876',
      batteryRange: '150km',
      features: ['Smart Dashboard', 'Navigation'],
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
    },
    {
      id: 4,
      vehicleName: 'Tesla Model Y',
      vehicleType: 'car',
      vehicleImage: '/images/ev-cars/tesla-model-3.svg',
      pickupDate: '2024-11-25',
      dropoffDate: '2024-11-26',
      pickupTime: '8:00 AM',
      dropoffTime: '8:00 PM',
      location: 'Chandigarh',
      destination: 'Shimla',
      totalPrice: 8000,
      status: 'cancelled',
      bookingDate: '2024-11-20',
      owner: 'Mike Wilson',
      ownerPhone: '+91 98765 43213',
      ownerRating: 4.7,
      licensePlate: 'CH01EV4567',
      batteryRange: '400km',
      features: ['Full Self-Driving', 'Heated Seats', 'Premium Interior'],
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
      cancellationReason: 'Changed travel plans'
    }
  ]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading bookings...
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#ef4444'
      }}>
        Please log in to access your bookings
      </div>
    );
  }

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = selectedFilter === 'all' || booking.status === selectedFilter;
    const matchesSearch = booking.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => b.status === 'upcoming').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = (bookingId) => {
    console.log('Cancel booking:', bookingId);
    // API call to cancel booking
  };

  const handleModifyBooking = (bookingId) => {
    console.log('Modify booking:', bookingId);
    // Navigate to modification page or show modal
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
          
          <BookingsList
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onCancelBooking={handleCancelBooking}
            onModifyBooking={handleModifyBooking}
          />

          {showDetailsModal && selectedBooking && (
            <BookingDetails
              booking={selectedBooking}
              onClose={() => setShowDetailsModal(false)}
              onCancel={handleCancelBooking}
              onModify={handleModifyBooking}
            />
          )}
        </div>
      </main>
    </>
  );
}