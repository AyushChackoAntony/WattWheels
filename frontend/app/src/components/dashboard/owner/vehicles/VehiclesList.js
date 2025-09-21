import React from 'react';
import VehicleCard from './VehicleCard';
import '@/styles/dashboard/owner/vehicles/VehiclesList.css';

export default function VehiclesList({ vehicles, onDeleteVehicle, onToggleStatus }) {
  if (vehicles.length === 0) {
    return (
      <div className="vehicles-empty-state">
        <div className="empty-state-content">
          <div className="empty-state-icon">
            <i className="fas fa-car"></i>
          </div>
          <h3>No vehicles found</h3>
          <p>No vehicles match your current filter criteria.</p>
          <button className="primary-btn">
            <i className="fas fa-plus"></i>
            Add Your First Vehicle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicles-list-section">
      <div className="vehicles-grid">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={() => onDeleteVehicle(vehicle.id)}
            onToggleStatus={(newStatus) => onToggleStatus(vehicle.id, newStatus)}
          />
        ))}
      </div>
    </div>
  );
}