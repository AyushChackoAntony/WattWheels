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
                  <label htmlFor="pickup">Pickup date</label>
                  <input type="date" id="pickup" placeholder="Enter pickup date" />
                </div>
                <div className="form-group">
                  <label htmlFor="dropoff">Drop-off Date</label>
                  <input type="date" id="dropoff" placeholder="Enter drop-off date" />
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