'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import AvailabilityHeader from '@/components/dashboard/owner/setAvailability/AvailabilityHeader';
import AvailabilityCalendar from '@/components/dashboard/owner/setAvailability/AvailabilityCalendar';
import VehicleAvailabilityList from '@/components/dashboard/owner/setAvailability/VehicleAvailabilityList';
import BulkAvailabilityActions from '@/components/dashboard/owner/setAvailability/BulkAvailabilityActions';
import AvailabilitySettings from '@/components/dashboard/owner/setAvailability/AvailabilitySettings';

export default function SetAvailability() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [viewMode, setViewMode] = useState('calendar');
  const [vehicles, setVehicles] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  });

  // --- Fetch Vehicles & Availability Data ---
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        try {
            // Fetch vehicles
            const vehiclesRes = await fetch(`http://127.0.0.1:5000/api/vehicles/`);
            if (vehiclesRes.ok) {
                const vehiclesData = await vehiclesRes.json();
                // Filter vehicles by owner_id on the frontend
                const ownerVehicles = vehiclesData.filter(v => v.owner_id === user.id);
                setVehicles(ownerVehicles);
            }

            // Fetch availability
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

  const handleBulkUpdate = async (action, vehicleIds, dateRange, reason = '') => {
    const isAvailable = action === 'make_available';
    
    for (const vehicleId of vehicleIds) {
        const payload = {
            vehicle_id: vehicleId,
            start_date: dateRange.start,
            end_date: dateRange.end,
            is_available: isAvailable,
            reason: isAvailable ? null : reason
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/api/availability/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const newAvailability = await res.json();
                setAvailability(prev => [...prev, newAvailability]);
            } else {
                console.error(`Failed to update availability for vehicle ${vehicleId}`);
            }
        } catch (error) {
            console.error('Error in bulk update:', error);
        }
    }
  };

  const handleAvailabilityToggle = async (availabilityId) => {
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/availability/${availabilityId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            setAvailability(prev => prev.filter(a => a.id !== availabilityId));
        } else {
            console.error(`Failed to delete availability record ${availabilityId}`);
        }
    } catch (error) {
        console.error('Error toggling availability:', error);
    }
  };


  const vehiclesWithAvailability = vehicles.map(vehicle => {
    const vehicleAvailability = availability.filter(a => a.vehicle_id === vehicle.id);
    return {
      ...vehicle,
      availableDates: vehicleAvailability.filter(a => a.is_available).map(a => ({...a, start: a.start_date, end: a.end_date })),
      blockedDates: vehicleAvailability.filter(a => !a.is_available).map(a => ({...a, start: a.start_date, end: a.end_date })),
      currentAvailability: 85, 
      upcomingBookings: 0,
    };
  });

  const filteredVehicles = selectedVehicle === 'all'
    ? vehiclesWithAvailability
    : vehiclesWithAvailability.filter(v => v.id === parseInt(selectedVehicle));



    const totalVehicles = vehicles.length;
  const availableNowCount = vehicles.filter(v => v.status === 'active').length;
  const avgAvailability = totalVehicles > 0 ? Math.round(vehiclesWithAvailability.reduce((sum, v) => sum + v.currentAvailability, 0) / totalVehicles) : 0;
  const totalUpcomingBookings = vehiclesWithAvailability.reduce((sum, v) => sum + v.upcomingBookings, 0);

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">


          <AvailabilityHeader 
            totalVehicles={totalVehicles}
            availableVehicles={availableNowCount}
            avgAvailability={avgAvailability}
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