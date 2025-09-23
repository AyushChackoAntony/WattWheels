'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import AvailabilityHeader from '@/components/dashboard/owner/availability/AvailabilityHeader';
import AvailabilityCalendar from '@/components/dashboard/owner/availability/AvailabilityCalendar';
import VehicleAvailabilityList from '@/components/dashboard/owner/availability/VehicleAvailabilityList';
import BulkAvailabilityActions from '@/components/dashboard/owner/availability/BulkAvailabilityActions';
import AvailabilitySettings from '@/components/dashboard/owner/availability/AvailabilitySettings';

export default function SetAvailability() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  });

  // Sample vehicle data - replace with API call
  const [vehicles] = useState([
    {
      id: 1,
      name: 'Tesla Model 3',
      type: 'car',
      image: '/images/ev-cars/tesla-model-3.svg',
      licensePlate: 'CH01EV1234',
      status: 'active',
      defaultAvailable: true,
      currentAvailability: 85,
      upcomingBookings: 3,
      blockedDates: [
        { start: '2025-01-15', end: '2025-01-17', reason: 'Maintenance' },
        { start: '2025-01-25', end: '2025-01-25', reason: 'Personal Use' }
      ],
      availableDates: [
        { start: '2025-01-10', end: '2025-01-14' },
        { start: '2025-01-18', end: '2025-01-24' },
        { start: '2025-01-26', end: '2025-01-31' }
      ]
    },
    {
      id: 2,
      name: 'Ola S1 Pro',
      type: 'bike',
      image: '/images/ev-cars/ola-s1.svg',
      licensePlate: 'CH01EV5678',
      status: 'active',
      defaultAvailable: true,
      currentAvailability: 92,
      upcomingBookings: 2,
      blockedDates: [
        { start: '2025-01-20', end: '2025-01-22', reason: 'Service' }
      ],
      availableDates: [
        { start: '2025-01-10', end: '2025-01-19' },
        { start: '2025-01-23', end: '2025-01-31' }
      ]
    },
    {
      id: 3,
      name: 'Ather 450X',
      type: 'bike',
      image: '/images/ev-cars/ather-450x.svg',
      licensePlate: 'CH01EV9876',
      status: 'maintenance',
      defaultAvailable: false,
      currentAvailability: 0,
      upcomingBookings: 0,
      blockedDates: [
        { start: '2025-01-10', end: '2025-01-20', reason: 'Major Service' }
      ],
      availableDates: [
        { start: '2025-01-21', end: '2025-01-31' }
      ]
    }
  ]);

  const [availabilityData, setAvailabilityData] = useState({
    defaultSettings: {
      makeAvailableByDefault: true,
      bufferTimeBetweenBookings: 30,
      advanceBookingLimit: 90,
      allowSameDayBooking: true,
      operatingHours: {
        start: '06:00',
        end: '22:00'
      },
      operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  });

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
        Loading availability settings...
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
        Please log in to manage vehicle availability
      </div>
    );
  }

  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicle(vehicleId);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setSelectedDateRange({ startDate, endDate });
  };

  const handleAvailabilityToggle = (vehicleId, dateRange, isAvailable, reason = '') => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        if (vehicle.id === vehicleId) {
          const updatedVehicle = { ...vehicle };
          
          if (isAvailable) {
            // Add to available dates
            updatedVehicle.availableDates.push(dateRange);
            // Remove from blocked dates if exists
            updatedVehicle.blockedDates = updatedVehicle.blockedDates.filter(
              blocked => !(blocked.start === dateRange.start && blocked.end === dateRange.end)
            );
          } else {
            // Add to blocked dates
            updatedVehicle.blockedDates.push({ ...dateRange, reason });
            // Remove from available dates if exists
            updatedVehicle.availableDates = updatedVehicle.availableDates.filter(
              available => !(available.start === dateRange.start && available.end === dateRange.end)
            );
          }
          
          return updatedVehicle;
        }
        return vehicle;
      })
    );
  };

  const handleBulkUpdate = (action, vehicles, dateRange, reason = '') => {
    const isAvailable = action === 'make_available';
    vehicles.forEach(vehicleId => {
      handleAvailabilityToggle(vehicleId, dateRange, isAvailable, reason);
    });
  };

  const handleSettingsUpdate = (newSettings) => {
    setAvailabilityData(prev => ({
      ...prev,
      defaultSettings: newSettings
    }));
  };

  // Filter vehicles based on selection
  const filteredVehicles = selectedVehicle === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.id === parseInt(selectedVehicle));

  // Calculate summary stats
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'active' && v.defaultAvailable).length;
  const avgAvailability = Math.round(vehicles.reduce((sum, v) => sum + v.currentAvailability, 0) / vehicles.length);
  const totalUpcomingBookings = vehicles.reduce((sum, v) => sum + v.upcomingBookings, 0);

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* Availability Header */}
          <AvailabilityHeader 
            totalVehicles={totalVehicles}
            availableVehicles={availableVehicles}
            avgAvailability={avgAvailability}
            totalUpcomingBookings={totalUpcomingBookings}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Vehicle Filter and Bulk Actions */}
          <BulkAvailabilityActions 
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={handleVehicleSelect}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={handleDateRangeChange}
            onBulkUpdate={handleBulkUpdate}
          />

          {/* Main Content */}
          <div className="availability-content">
            
            {viewMode === 'calendar' ? (
              <AvailabilityCalendar 
                vehicles={filteredVehicles}
                selectedDateRange={selectedDateRange}
                onAvailabilityToggle={handleAvailabilityToggle}
              />
            ) : (
              <VehicleAvailabilityList 
                vehicles={filteredVehicles}
                onAvailabilityToggle={handleAvailabilityToggle}
              />
            )}

          </div>

          {/* Availability Settings */}
          <AvailabilitySettings 
            settings={availabilityData.defaultSettings}
            onSettingsUpdate={handleSettingsUpdate}
          />

        </div>
      </main>
    </>
  );
}