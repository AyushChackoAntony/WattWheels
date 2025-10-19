'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuickBooking() {
    const router = useRouter();
    const [pickupDate, setPickupDate] = useState('');
    const [dropoffDate, setDropoffDate] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!pickupDate || !dropoffDate) {
            alert("Please select both pickup and drop-off dates.");
            return;
        }
        if (new Date(pickupDate) >= new Date(dropoffDate)) {
             alert("Drop-off date must be after pickup date.");
             return;
        }
        router.push(`/browse-vehicles?pickup=${pickupDate}&dropoff=${dropoffDate}`);
    };

    return (
        <>
            <section className="quick-booking-section">
                <div className="section-header">
                    <h2>Quick Booking</h2>
                    <p>Book your next EV in seconds</p>
                </div>
                <form className="quick-booking-form" onSubmit={handleSearch}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pickup">Pickup date</label>
                            <input
                                type="date"
                                id="pickup"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dropoff">Drop-off Date</label>
                            <input
                                type="date"
                                id="dropoff"
                                value={dropoffDate}
                                onChange={(e) => setDropoffDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="primary-btn">
                        <i className="fas fa-search"></i> Find Available EVs
                    </button>
                </form>
            </section>
        </>
    )
}