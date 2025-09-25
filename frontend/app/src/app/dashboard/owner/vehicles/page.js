'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import VehiclesHeader from '@/components/dashboard/owner/vehicles/VehiclesHeader';
import VehicleFilters from '@/components/dashboard/owner/vehicles/VehicleFilters';
import VehiclesList from '@/components/dashboard/owner/vehicles/VehiclesList';
import AddVehicleForm from '@/components/dashboard/owner/vehicles/AddVehicleForm';

export default function MyVehicles() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState([]); // Start with an empty array

  // --- Fetch vehicles from the backend when the page loads ---
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/vehicles/');
        const data = await response.json();
        if (response.ok) {
          // The backend API for GET /vehicles doesn't return all stats, so we add placeholders
          const vehiclesWithStats = data.map(vehicle => ({
            ...vehicle,
            monthlyEarnings: 0,
            monthlyBookings: 0,
            rating: 0,
            availability: 100,
            status: 'active' // Assuming default status
          }));
          setVehicles(vehiclesWithStats);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };
    fetchVehicles();
  }, []); // The empty array ensures this runs only once when the component mounts

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading vehicles...
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Please log in to access your vehicles
      </div>
    );
  }

  // Filter vehicles based on selected filter and search term
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && vehicle.status === 'active') ||
                         (selectedFilter === 'maintenance' && vehicle.status === 'maintenance') ||
                         (selectedFilter === 'inactive' && vehicle.status === 'inactive') ||
                         (selectedFilter === 'cars' && vehicle.type === 'car') ||
                         (selectedFilter === 'bikes' && vehicle.type === 'bike');

    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.license_plate && vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleAddVehicle = (newlyAddedVehicle) => {
    // Add the new vehicle to the state to update the UI instantly
    const vehicleWithStats = {
      ...newlyAddedVehicle,
      id: vehicles.length + 1, // Use a temporary ID for the key
      monthlyEarnings: 0,
      monthlyBookings: 0,
      rating: 0,
      availability: 100,
      status: 'active'
    };
    setVehicles(prevVehicles => [...prevVehicles, vehicleWithStats]);
    setShowAddForm(false);
  };

  const handleDeleteVehicle = (vehicleId) => {
    // This would also involve an API call in a real app
    setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  const handleToggleStatus = (vehicleId, newStatus) => {
    // This would also involve an API call in a real app
    setVehicles(vehicles.map(vehicle =>
      vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
    ));
  };

  // Calculate summary stats
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const totalMonthlyEarnings = vehicles.reduce((sum, v) => sum + v.monthlyEarnings, 0);
  const totalMonthlyBookings = vehicles.reduce((sum, v) => sum + v.monthlyBookings, 0);

  return (
    <>
      <OwnerHeader user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <VehiclesHeader
            totalVehicles={totalVehicles}
            activeVehicles={activeVehicles}
            totalMonthlyEarnings={totalMonthlyEarnings}
            totalMonthlyBookings={totalMonthlyBookings}
            onAddVehicle={() => setShowAddForm(true)}
          />
          <VehicleFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            vehicleCount={filteredVehicles.length}
          />
          <VehiclesList
            vehicles={filteredVehicles}
            onDeleteVehicle={handleDeleteVehicle}
            onToggleStatus={handleToggleStatus}
          />
          {showAddForm && (
            <AddVehicleForm
              onSubmit={handleAddVehicle}
              onClose={() => setShowAddForm(false)}
            />
          )}
        </div>
      </main>
    </>
  );
}