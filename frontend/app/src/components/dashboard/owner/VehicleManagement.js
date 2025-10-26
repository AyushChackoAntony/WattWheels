import Link from "next/link";
import Image from "next/image";

// Accept 'vehicles' prop, default to empty array
export default function VehicleManagement({ vehicles = [] }){
    return (
        <>
           <section className="vehicle-management-section">
            <div className="section-header">
              <h2>Vehicle Management</h2>
              {/* Link to the main vehicle management page */}
              <Link href="/dashboard/owner/vehicles" className="view-all-link">Manage All</Link>
            </div>
            <div className="vehicles-grid">
              {/* Check if there are any vehicles */}
              {vehicles.length === 0 ? (
                 // Display a message and a link to add vehicles if the list is empty
                 <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
                      You haven't listed any vehicles yet. {' '}
                      <Link href="/dashboard/owner/vehicles" style={{color: 'var(--primary-color)', fontWeight: '500'}}>
                          Add your first vehicle!
                      </Link>
                  </p>
              ) : (
                // Map over the vehicles array passed via props
                vehicles.map(vehicle => (
                  <div key={vehicle.id} className="vehicle-card">
                    <div className="vehicle-header">
                      <div className="vehicle-info">
                        {/* Use dynamic image and name from vehicle data */}
                        <Image
                            src={vehicle.image || "/images/ev-cars/default.svg"} // Use vehicle.image
                            alt={vehicle.name} width={60} height={40}
                            onError={(e) => e.target.src = '/images/ev-cars/default.svg'} // Fallback image
                        />
                        <div className="vehicle-details">
                          <h4>{vehicle.name}</h4>
                           {/* Use dynamic status and apply class */}
                          <span className={`vehicle-status ${vehicle.status}`}>{vehicle.status}</span>
                        </div>
                      </div>
                      <div className="vehicle-earnings">
                         {/* Use dynamic earnings, provide default */}
                        <span className="earning-amount">₹{vehicle.monthlyEarnings?.toLocaleString() ?? 0}</span>
                        <span className="earning-period">This month</span>
                      </div>
                    </div>
                    <div className="vehicle-stats">
                      <div className="stat-item">
                        <span className="stat-label">Bookings</span>
                         {/* Use dynamic bookings, provide default */}
                        <span className="stat-value">{vehicle.monthlyBookings ?? 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Rating</span>
                         {/* Use dynamic rating, provide default */}
                        <span className="stat-value">{vehicle.rating ? vehicle.rating.toFixed(1) : 'N/A'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Availability</span>
                         {/* Use dynamic availability, provide default */}
                        <span className="stat-value">{vehicle.availability ?? 0}%</span>
                      </div>
                    </div>
                    <div className="vehicle-actions">
                       {/* Link to specific vehicle page for editing */}
                      <Link href={`/dashboard/owner/vehicles/${vehicle.id}/edit`} className="action-btn">Edit Details</Link>
                       {/* Link to specific vehicle's bookings page */}
                      <Link href={`/dashboard/owner/vehicles/${vehicle.id}/bookings`} className="action-btn">View Bookings</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
    )
}