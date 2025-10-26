import Link from "next/link";
import Image from "next/image";

// Helper function to format date (consider moving to a utils file)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Example format: Oct 26, 2025
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        // Ensure the dateString is treated correctly, potentially parse ISO if needed
        const date = new Date(dateString.includes('T') ? dateString : dateString.replace(/-/g, '/')); // Handle YYYY-MM-DD
        return date.toLocaleDateString('en-IN', options);
    } catch (e) {
        console.error("Error formatting date:", dateString, e); // Log error for debugging
        return "Invalid Date";
    }
};

// Helper function to format time (consider moving to a utils file)
const formatTime = (timeString) => {
     if (!timeString) return 'N/A';
     // The backend's booking.to_dict() provides pre-formatted time like '10:00 AM'
     // Just return it directly
     return timeString;

     // If backend sent full ISO string, you would parse:
     /*
     try {
         const options = { hour: 'numeric', minute: '2-digit', hour12: true };
         const date = new Date(timeString); // Assuming timeString is a full ISO date/time
         return date.toLocaleTimeString('en-IN', options);
     } catch (e) {
         console.error("Error formatting time:", timeString, e); // Log error
         return "Invalid Time";
     }
     */
}

// Accept 'bookings' prop, default to empty array
export default function CurrentBooking({ bookings = [] }){
    return (
        <>
            <section className="current-bookings-section">
            <div className="section-header">
              <h2>Current Bookings</h2>
              {/* Link to full bookings management page */}
              <Link href="/dashboard/owner/bookings" className="view-all-link">View All</Link>
            </div>
            <div className="bookings-grid">
              {/* Check if there are any bookings */}
              {bookings.length === 0 ? (
                  // Display message when no bookings are available
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
                      No current or upcoming bookings found.
                  </p>
              ) : (
                 // Map over the bookings array passed via props
                 bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <div className="booking-vehicle">
                        {/* Use dynamic image, alt text from booking data */}
                        <Image
                            // Use vehicleImage from booking data, fallback to default
                            src={booking.vehicleImage || "/images/ev-cars/default.svg"}
                            alt={booking.vehicleName || "Vehicle"}
                            width={60} height={40}
                            onError={(e) => e.target.src = '/images/ev-cars/default.svg'} // Fallback if image fails to load
                        />
                        <div className="vehicle-info">
                          {/* Use dynamic vehicle name and date */}
                          <h4>{booking.vehicleName || 'Unknown Vehicle'}</h4>
                          <span className="booking-date">{formatDate(booking.pickupDate)}</span>
                        </div>
                      </div>
                       {/* Use dynamic status and apply class based on status */}
                      <div className={`booking-status ${booking.status}`}>{booking.status}</div>
                    </div>
                    <div className="booking-details">
                      <div className="booking-location">
                         {/* Use dynamic locations, provide defaults */}
                        <span><i className="fas fa-map-marker-alt"></i> {booking.location || 'N/A'} → {booking.destination || 'N/A'}</span>
                      </div>
                      <div className="booking-info">
                         {/* Use dynamic time and price */}
                        <span><i className="fas fa-clock"></i> {formatTime(booking.pickupTime)} - {formatTime(booking.dropoffTime)}</span>
                        <span><i className="fas fa-rupee-sign"></i> ₹{booking.totalPrice?.toLocaleString() ?? 0}</span>
                      </div>
                      <div className="customer-info">
                         {/* Use dynamic customer details from nested object */}
                        <span><i className="fas fa-user"></i> {booking.customer?.firstName ?? 'Customer'} {booking.customer?.lastName ?? ''}</span>
                        <span><i className="fas fa-phone"></i> {booking.customer?.phone ?? 'N/A'}</span>
                      </div>
                    </div>
                    <div className="booking-actions">
                       {/* Actions can link to specific booking details page or trigger functions */}
                      <button className="action-btn">Contact Customer</button>
                      {/* Link to a potential booking detail page (adjust URL if needed) */}
                      <Link href={`/dashboard/owner/bookings/${booking.id}`} className="action-btn">View Details</Link>
                    </div>
                  </div>
                 ))
              )}
            </div>
          </section>
        </>
    )
}