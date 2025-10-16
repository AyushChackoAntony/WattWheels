'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import AvailabilityHeader from '@/components/dashboard/owner/setAvailability/AvailabilityHeader';
import AvailabilityCalendar from '@/components/dashboard/owner/setAvailability/AvailabilityCalendar';
import VehicleAvailabilityList from '@/components/dashboard/owner/setAvailability/VehicleAvailabilityList';
import BulkAvailabilityActions from '@/components/dashboard/owner/setAvailability/BulkAvailabilityActions';

export default function SetAvailability() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [viewMode, setViewMode] = useState('calendar');
  const [vehicles, setVehicles] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  // This effect runs when the user is authenticated to fetch all necessary data from the backend.
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          // Fetch all vehicles that belong to the currently logged-in owner.
          const vehiclesRes = await fetch(`http://127.0.0.1:5000/api/vehicles/?ownerId=${user.id}`);
          if (vehiclesRes.ok) {
            const vehiclesData = await vehiclesRes.json();
            setVehicles(vehiclesData.vehicles || []);
          }

          // Fetch all availability records associated with that owner.
          const availabilityRes = await fetch(`http://127.0.0.1:5000/api/availability/${user.id}`);
          if (availabilityRes.ok) {
            const availabilityData = await availabilityRes.json();
            setAvailability(availabilityData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    if (isAuthenticated) {
      fetchData();
    }
  }, [user, isAuthenticated]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading availability settings...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Please log in to manage vehicle availability</div>;
  }

  // This function handles the "Make Available" and "Block Dates" buttons.
  const handleBulkUpdate = async (action, vehicleIds, dateRange, reason = '') => {
    const isAvailable = action === 'make_available';
    const targetVehicleIds = Array.isArray(vehicleIds) ? vehicleIds : [vehicleIds];

    for (const vehicleId of targetVehicleIds) {
      if (vehicleId === 'all') continue;

      const payload = {
        vehicle_id: parseInt(vehicleId),
        start_date: dateRange.start,
        end_date: dateRange.end,
        is_available: isAvailable,
        reason: isAvailable ? null : reason,
      };

      try {
        const res = await fetch('http://127.0.0.1:5000/api/availability/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const newAvailability = await res.json();
          setAvailability(prev => [...prev, newAvailability]);
        } else {
          const errorData = await res.json();
          alert(`Error for vehicle ${vehicleId}: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error during bulk update:', error);
      }
    }
  };

  // This function removes an existing availability or blocked period.
  const handleAvailabilityToggle = async (availabilityId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/availability/${availabilityId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAvailability(prev => prev.filter(a => a.id !== availabilityId));
      } else {
        alert('Failed to delete the availability period.');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  // This processes the raw vehicle and availability data into a structured format for the components.
  const vehiclesWithAvailability = vehicles.map(vehicle => {
    const vehicleAvailability = availability.filter(a => a.vehicle_id === vehicle.id);
    return {
      ...vehicle,
      availableDates: vehicleAvailability.filter(a => a.is_available).map(a => ({ ...a, start: a.start_date, end: a.end_date })),
      blockedDates: vehicleAvailability.filter(a => !a.is_available).map(a => ({ ...a, start: a.start_date, end: a.end_date })),
      // NOTE: `upcomingBookings` will require fetching from a bookings endpoint to be fully dynamic.
      upcomingBookings: vehicle.monthlyBookings || 0,
    };
  });

  const filteredVehicles = selectedVehicle === 'all'
    ? vehiclesWithAvailability
    : vehiclesWithAvailability.filter(v => v.id === parseInt(selectedVehicle));

  // Calculates the summary statistics for the header.
  const totalVehicles = vehicles.length;
  const availableNowCount = vehicles.filter(v => v.status === 'active').length;
  const totalUpcomingBookings = vehiclesWithAvailability.reduce((sum, v) => sum + v.upcomingBookings, 0);

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <AvailabilityHeader
            totalVehicles={totalVehicles}
            availableVehicles={availableNowCount}
            avgAvailability={85} // NOTE: This needs a dynamic calculation based on future dates.
            totalUpcomingBookings={totalUpcomingBookings}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <BulkAvailabilityActions
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
            onBulkUpdate={handleBulkUpdate}
          />

          <div className="availability-content">
            {viewMode === 'calendar' ? (
              <AvailabilityCalendar
                vehicles={filteredVehicles}
                onAvailabilityToggle={handleAvailabilityToggle}
              />
            ) : (
              <VehicleAvailabilityList
                vehicles={filteredVehicles}
                onAvailabilityToggle={handleAvailabilityToggle}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}