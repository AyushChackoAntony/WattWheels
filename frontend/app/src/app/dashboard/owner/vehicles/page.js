'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import OwnerHeader from '@/components/dashboard/owner/OwnerHeader';
import VehiclesHeader from '@/components/dashboard/owner/vehicles/VehiclesHeader';
import VehicleFilters from '@/components/dashboard/owner/vehicles/VehicleFilters';
import VehiclesList from '@/components/dashboard/owner/vehicles/VehiclesList';
import AddVehicleForm from '@/components/dashboard/owner/vehicles/AddVehicleForm';
import '@/styles/dashboard/owner/ownerDash.css';
import '@/styles/dashboard/owner/vehicles/vehicles-shared.css';

export default function MyVehicles() {
  const { user, loading, isAuthenticated } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample vehicle data - replace with API call
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Tesla Model 3',
      type: 'car',
      status: 'active',
      image: '/images/ev-cars/tesla-model-3.svg',
      batteryRange: '350km',
      acceleration: '0-60 in 3.1s',
      pricePerDay: 2500,
      totalEarnings: 45800,
      monthlyEarnings: 8500,
      totalBookings: 256,
      monthlyBookings: 12,
      rating: 4.9,
      availability: 85,
      location: 'Chandigarh',
      year: 2023,
      color: 'White',
      licensePlate: 'CH01EV1234'
    },
    {
      id: 2,
      name: 'Ola S1 Pro',
      type: 'bike',
      status: 'active',
      image: '/images/ev-cars/ola-s1.svg',
      batteryRange: '180km',
      acceleration: '0-40 in 3.0s',
      pricePerDay: 800,
      totalEarnings: 24500,
      monthlyEarnings: 4200,
      totalBookings: 158,
      monthlyBookings: 8,
      rating: 4.8,
      availability: 90,
      location: 'Chandigarh',
      year: 2023,
      color: 'Blue',
      licensePlate: 'CH01EV5678'
    },
    {
      id: 3,
      name: 'Ather 450X',
      type: 'bike',
      status: 'maintenance',
      image: '/images/ev-cars/ather-450x.svg',
      batteryRange: '150km',
      acceleration: '0-40 in 3.9s',
      pricePerDay: 600,
      totalEarnings: 18200,
      monthlyEarnings: 0,
      totalBookings: 89,
      monthlyBookings: 0,
      rating: 4.7,
      availability: 0,
      location: 'Chandigarh',
      year: 2022,
      color: 'Red',
      licensePlate: 'CH01EV9876'
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
        Loading vehicles...
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
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleAddVehicle = (vehicleData) => {
    const newVehicle = {
      id: vehicles.length + 1,
      ...vehicleData,
      totalEarnings: 0,
      monthlyEarnings: 0,
      totalBookings: 0,
      monthlyBookings: 0,
      rating: 0,
      availability: 100,
      status: 'active'
    };
    setVehicles([...vehicles, newVehicle]);
    setShowAddForm(false);
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  const handleToggleStatus = (vehicleId, newStatus) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, status: newStatus }
        : vehicle
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
          
          {/* Vehicles Header with Stats */}
          <VehiclesHeader 
            totalVehicles={totalVehicles}
            activeVehicles={activeVehicles}
            totalMonthlyEarnings={totalMonthlyEarnings}
            totalMonthlyBookings={totalMonthlyBookings}
            onAddVehicle={() => setShowAddForm(true)}
          />

          {/* Filters and Search */}
          <VehicleFilters 
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            vehicleCount={filteredVehicles.length}
          />

          {/* Vehicles List */}
          <VehiclesList 
            vehicles={filteredVehicles}
            onDeleteVehicle={handleDeleteVehicle}
            onToggleStatus={handleToggleStatus}
          />

          {/* Add Vehicle Form Modal */}
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