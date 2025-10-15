'use client';
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function VehicleManagement(){
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // This hook fetches a summary of the owner's vehicles.
    useEffect(() => {
        const fetchVehicleSummary = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/vehicles/?ownerId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setVehicles(data.vehicles || []);
                }
            } catch (error) {
                console.error("Failed to fetch vehicle summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleSummary();
    }, [user]);

    if (loading) {
        return <p>Loading vehicle information...</p>;
    }

    return (
        <section className="vehicle-management-section">
            <div className="section-header">
              <h2>Vehicle Management</h2>
              <Link href="/dashboard/owner/vehicles" className="view-all-link">Manage All</Link>
            </div>
            <div className="vehicles-grid">
                {vehicles.length > 0 ? (
                    // This will show a summary of the first 2 vehicles on the dashboard.
                    vehicles.slice(0, 2).map(vehicle => (
                        <div className="vehicle-card" key={vehicle.id}>
                            <div className="vehicle-header">
                                <div className="vehicle-info">
                                    <Image src={vehicle.image || '/images/ev-cars/tesla-model-3.svg'} alt={vehicle.name} width={60} height={40} />
                                    <div className="vehicle-details">
                                        <h4>{vehicle.name}</h4>
                                        <span className={`vehicle-status ${vehicle.status}`}>{vehicle.status}</span>
                                    </div>
                                </div>
                                <div className="vehicle-earnings">
                                    <span className="earning-amount">₹{(vehicle.monthlyEarnings || 0).toLocaleString()}</span>
                                    <span className="earning-period">This month</span>
                                </div>
                            </div>
                            <div className="vehicle-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Bookings</span>
                                    <span className="stat-value">{vehicle.monthlyBookings || 0}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Rating</span>
                                    <span className="stat-value">{vehicle.rating || 'N/A'}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Availability</span>
                                    <span className="stat-value">{vehicle.availability || 100}%</span>
                                </div>
                            </div>
                            <div className="vehicle-actions">
                                <button className="action-btn">Edit Details</button>
                                <button className="action-btn">View Bookings</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have not added any vehicles yet.</p>
                )}
            </div>
        </section>
    );
}