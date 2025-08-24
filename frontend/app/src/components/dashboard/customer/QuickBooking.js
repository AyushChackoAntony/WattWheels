export default function QuickBooking(){
    return (
        <>
            <section className="quick-booking-section">
            <div className="section-header">
              <h2>Quick Booking</h2>
              <p>Book your next EV in seconds</p>
            </div>
            <form className="quick-booking-form" onSubmit={e => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickup">Pickup Location</label>
                  <input type="text" id="pickup" placeholder="Enter pickup location" />
                </div>
                <div className="form-group">
                  <label htmlFor="dropoff">Drop-off Location</label>
                  <input type="text" id="dropoff" placeholder="Enter drop-off location" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input type="time" id="time" />
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