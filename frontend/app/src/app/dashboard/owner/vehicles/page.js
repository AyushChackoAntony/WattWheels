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
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/vehicles/`);
          const data = await response.json();
          if (response.ok) {
            const vehiclesWithStats = data.map(vehicle => ({
              ...vehicle,
              // These will be replaced with real data in a later step
              monthlyEarnings: vehicle.monthlyEarnings || 0,
              monthlyBookings: vehicle.monthlyBookings || 0,
              rating: vehicle.rating || 0,
              availability: vehicle.availability || 100,
              status: vehicle.status || 'active'
            }));
            setVehicles(vehiclesWithStats);
          } else {
            console.error("Failed to fetch vehicles:", data.error);
          }
        } catch (error) {
          console.error("Failed to fetch vehicles:", error);
        }
      }
    };

    if (isAuthenticated) {
      fetchVehicles();
    }
  }, [user, isAuthenticated]); // Corrected dependency array

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading vehicles...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Please log in to access your vehicles</div>;
  }

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
    const vehicleWithStats = {
      ...newlyAddedVehicle,
      id: vehicles.length + 1,
      monthlyEarnings: 0,
      monthlyBookings: 0,
      rating: 0,
      availability: 100,
      status: 'active'
    };
    setVehicles(prevVehicles => [...prevVehicles, vehicleWithStats]);
    setShowAddForm(false);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_id: user.id }),
      });

      if (response.ok) {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      } else {
        const errorData = await response.json();
        alert(`Failed to delete vehicle: ${errorData.error}`);
      }
    } catch (error) {
      alert('An error occurred while deleting the vehicle.');
    }
  };

  const handleToggleStatus = async (vehicleId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, owner_id: user.id }),
      });

      if (response.ok) {
        const updatedVehicle = await response.json();
        setVehicles(vehicles.map(vehicle =>
          vehicle.id === vehicleId ? { ...vehicle, ...updatedVehicle.vehicle } : vehicle
        ));
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.error}`);
      }
    } catch (error) {
      alert('An error occurred while updating the vehicle status.');
    }
  };

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const totalMonthlyEarnings = vehicles.reduce((sum, v) => sum + (v.monthlyEarnings || 0), 0);
  const totalMonthlyBookings = vehicles.reduce((sum, v) => sum + (v.monthlyBookings || 0), 0);

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