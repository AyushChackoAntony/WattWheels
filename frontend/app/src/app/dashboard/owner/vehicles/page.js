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

  // This function fetches the vehicles specifically for the logged-in owner.
  const fetchVehicles = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/vehicles/?ownerId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setVehicles(data.vehicles || []);
        } else {
          console.error("Failed to fetch vehicles");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }
  };

  // This hook calls `fetchVehicles` as soon as the user is authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles();
    }
  }, [user, isAuthenticated]);


  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading vehicles...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Please log in to access your vehicles</div>;
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const filterValue = selectedFilter.toLowerCase();
    const matchesFilter = filterValue === 'all' ||
                         vehicle.status === filterValue ||
                         vehicle.type === filterValue.slice(0, -1);

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = vehicle.name.toLowerCase().includes(searchLower) ||
                         (vehicle.license_plate && vehicle.license_plate.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  // This function adds the newly created vehicle to the list without needing a page refresh.
  const handleAddVehicle = (newVehicleResponse) => {
    setVehicles(prevVehicles => [...prevVehicles, newVehicleResponse.vehicle]);
    setShowAddForm(false);
  };

  // This function sends a DELETE request to the backend to permanently remove a vehicle.
  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
        return;
    }
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

  // This function sends a PATCH request to the backend to update the vehicle's status.
  const handleToggleStatus = async (vehicleId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, owner_id: user.id }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setVehicles(vehicles.map(vehicle =>
          vehicle.id === vehicleId ? updatedData.vehicle : vehicle
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