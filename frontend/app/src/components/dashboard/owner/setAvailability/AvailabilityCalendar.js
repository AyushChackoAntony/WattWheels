'use client';
import React, { useState } from 'react';
import '@/styles/dashboard/owner/setAvailability/availabilityCalendar.css';

export default function AvailabilityCalendar({
  vehicles,
  selectedDateRange,
  onAvailabilityToggle
}) {
  return (
    <div className="availability-calendar-section">
      <h2>Calendar View</h2>

      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="calendar-vehicle-card">
          <h3>
            <i className={`fas fa-${vehicle.type === 'car' ? 'car' : 'motorcycle'}`}></i>{' '}
            {vehicle.name} ({vehicle.licensePlate})
          </h3>

          <div className="calendar-dates">
            <p><strong>Available:</strong></p>
            <ul>
              {vehicle.availableDates.map((date, idx) => (
                <li key={idx}>
                  {date.start} → {date.end}{' '}
                  <button
                    onClick={() =>
                      onAvailabilityToggle(vehicle.id, date, false, 'Blocked manually')
                    }
                  >
                    Block
                  </button>
                </li>
              ))}
            </ul>

            <p><strong>Blocked:</strong></p>
            <ul>
              {vehicle.blockedDates.map((date, idx) => (
                <li key={idx}>
                  {date.start} → {date.end} ({date.reason}){' '}
                  <button
                    onClick={() =>
                      onAvailabilityToggle(vehicle.id, date, true)
                    }
                  >
                    Make Available
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
