'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CustomerHeader from '@/components/dashboard/customer/CustomerHeader';
import Navbar from '@/components/Navbar';
import '@/styles/browse-vehicles.css';

export default function BrowseVehicles() {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pickupDate = searchParams.get('pickup');
  const dropoffDate = searchParams.get('dropoff');

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = 'http://127.0.0.1:5000/api/vehicles/';
        const queryParams = new URLSearchParams();
        if (pickupDate) {
          queryParams.append('startDate', pickupDate);
        }
        if (dropoffDate) {
          queryParams.append('endDate', dropoffDate);
        }
        const queryString = queryParams.toString();
        if (queryString) {
          apiUrl += `?${queryString}`;
        }

        const res = await fetch(apiUrl);

        if (!res.ok) {
          let errorData;
          try {
            errorData = await res.json();
          } catch (parseError) {
            throw new Error(res.statusText || `HTTP error! status: ${res.status}`);
          }
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setVehicles(data.vehicles || []);

      } catch (fetchError) {
        console.error("Failed to fetch vehicles:", fetchError);
        setError(fetchError.message);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [pickupDate, dropoffDate]);

  return (
    <>
      {isAuthenticated && user ? <CustomerHeader user={user} /> : <Navbar />}

      <main className="browse-main">
        <div className="browse-container">
          <div className="browse-header">
            <h1>Available Electric Vehicles</h1>
            {pickupDate && dropoffDate && (
              <p>Showing vehicles available from <strong>{pickupDate}</strong> to <strong>{dropoffDate}</strong></p>
            )}
             {!pickupDate && !dropoffDate && (
              <p>Showing all currently active vehicles</p>
            )}
          </div>

          {loading && (
            <div className="loading-message">Loading available vehicles...</div>
          )}

          {error && (
            <div className="error-message">
              Error loading vehicles: {error}. Please try again later.
            </div>
          )}

          {!loading && !error && vehicles.length === 0 && (
            <div className="no-vehicles-message">
              No vehicles available for the selected criteria.
            </div>
          )}

          {!loading && !error && vehicles.length > 0 && (
            <div className="vehicles-grid">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="vehicle-card-browse">
                  <div className="vehicle-image-browse">
                    <Image
                      src={vehicle.image || "/images/ev-cars/default.svg"}
                      alt={vehicle.name}
                      width={200}
                      height={120}
                      onError={(e) => e.target.src = '/images/ev-cars/default.svg'}
                    />
                  </div>
                  <div className="vehicle-info-browse">
                    <h3>{vehicle.name}</h3>
                    <div className="vehicle-specs-browse">
                      <span><i className="fas fa-map-marker-alt"></i> {vehicle.location}</span>
                      {vehicle.batteryRange && <span><i className="fas fa-battery-three-quarters"></i> {vehicle.batteryRange}</span>}
                      {vehicle.type && <span><i className={vehicle.type === 'car' ? "fas fa-car" : "fas fa-motorcycle"}></i> {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</span>}
                    </div>
                    <div className="vehicle-price-browse">
                      <span className="price">₹{vehicle.pricePerDay.toLocaleString()}</span>
                      <span className="period">/day</span>
                    </div>
                    <Link
                       href={{
                         pathname: `/vehicles/${vehicle.id}`,
                         query: {
                           ...(pickupDate && { pickup: pickupDate }),
                           ...(dropoffDate && { dropoff: dropoffDate })
                         }
                       }}
                       className="book-btn-browse"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}