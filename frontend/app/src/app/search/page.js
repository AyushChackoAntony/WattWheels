'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleCard from '@/components/dashboard/owner/vehicles/VehicleCard';
import '@/styles/dashboard/owner/vehicles/vehiclesList.css';

function SearchResults() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = searchParams.get('location');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // In the future, you can add the search params to the query
        const response = await fetch(`http://127.0.0.1:5000/api/vehicles/`);
        if (response.ok) {
          const data = await response.json();
          // For now, we'll just show all vehicles.
          // Later, you'll filter these on the backend based on location/dates.
          setVehicles(data.vehicles || []);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [location, startDate, endDate]);

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="vehicles-header-section">
            <div className="vehicles-header-info">
              <h1>Search Results</h1>
              <p>Showing vehicles available {location ? `in ${location}` : ''}</p>
            </div>
          </div>

          {loading ? (
            <p>Loading vehicles...</p>
          ) : (
            <div className="vehicles-list-section">
              <div className="vehicles-grid">
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))
                ) : (
                  <p>No vehicles found for your search criteria.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Wrap the component in Suspense to handle dynamic search params
export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}