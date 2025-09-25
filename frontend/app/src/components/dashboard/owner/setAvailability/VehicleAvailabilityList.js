'use client';
import React from 'react';
import Image from 'next/image';
import '@/styles/dashboard/owner/setAvailability/vehicleAvailabilityList.css';

export default function VehicleAvailabilityList({ vehicles, onAvailabilityToggle }) {
  return (
    <div className="vehicle-list-section">
      <h2>List View</h2>

      <table className="vehicle-list-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Status</th>
            <th>Availability</th>
            <th>Bookings</th>
            <th>Blocked Dates</th>
            <th>Available Dates</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                <div className="vehicle-info">
                  <Image src={vehicle.image} alt={vehicle.name} width={50} height={50} />
                  <span>{vehicle.name}</span>
                </div>
              </td>
              <td>{vehicle.status}</td>
              <td>{vehicle.currentAvailability}%</td>
              <td>{vehicle.upcomingBookings}</td>
              <td>
                {vehicle.blockedDates.map((date, idx) => (
                  <div key={idx} className="blocked-date">
                    {date.start} → {date.end} ({date.reason}){' '}
                    <button onClick={() => onAvailabilityToggle(vehicle.id, date, true)}>
                      Make Available
                    </button>
                  </div>
                ))}
              </td>
              <td>
                {vehicle.availableDates.map((date, idx) => (
                  <div key={idx} className="available-date">
                    {date.start} → {date.end}{' '}
                    <button
                      onClick={() => onAvailabilityToggle(vehicle.id, date, false, 'Blocked')}
                    >
                      Block
                    </button>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
