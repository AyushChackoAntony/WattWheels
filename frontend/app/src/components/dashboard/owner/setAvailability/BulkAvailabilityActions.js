'use client';
import React from 'react';
import '@/styles/dashboard/owner/setAvailability/bulkAvailabilityActions.css';


export default function BulkAvailabilityActions({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  selectedDateRange,
  onDateRangeChange,
  onBulkUpdate
}) {
  return (
    <div className="bulk-actions-section">
      <div className="bulk-actions-header">
        <h2>Manage Availability</h2>
      </div>

      <div className="bulk-actions-controls">
        {/* Vehicle Filter */}
        <select
          className="vehicle-selector"
          value={selectedVehicle}
          onChange={(e) => onVehicleSelect(e.target.value)}
        >
          <option value="all">All Vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} ({vehicle.licensePlate})
            </option>
          ))}
        </select>

        {/* Date Range Selector */}
        <div className="date-range-selector">
          <label>From:</label>
          <input
            type="date"
            value={selectedDateRange.startDate.toISOString().split('T')[0]}
            onChange={(e) =>
              onDateRangeChange(new Date(e.target.value), selectedDateRange.endDate)
            }
          />
          <label>To:</label>
          <input
            type="date"
            value={selectedDateRange.endDate.toISOString().split('T')[0]}
            onChange={(e) =>
              onDateRangeChange(selectedDateRange.startDate, new Date(e.target.value))
            }
          />
        </div>

        {/* Bulk Action Buttons */}
        <div className="bulk-action-buttons">
          <button
            className="btn-available"
            onClick={() =>
              onBulkUpdate('make_available', selectedVehicle === 'all' ? vehicles.map(v => v.id) : [selectedVehicle], {
                start: selectedDateRange.startDate.toISOString().split('T')[0],
                end: selectedDateRange.endDate.toISOString().split('T')[0]
              })
            }
          >
            Make Available
          </button>

          <button
            className="btn-blocked"
            onClick={() =>
              onBulkUpdate('make_unavailable', selectedVehicle === 'all' ? vehicles.map(v => v.id) : [selectedVehicle], {
                start: selectedDateRange.startDate.toISOString().split('T')[0],
                end: selectedDateRange.endDate.toISOString().split('T')[0]
              }, 'Blocked by Owner')
            }
          >
            Block Dates
          </button>
        </div>
      </div>
    </div>
  );
}
