import Link from "next/link"

export default function Welcome({user}){
    return (
        <>
            <section className="welcome-section">
            <div className="welcome-content">
              <h1>Welcome back, {user.firstName}! 👋</h1>
              <p>Ready for your next eco-friendly adventure?</p>
            </div>
            <div className="quick-actions">
              <Link href="/browse-vehicles" className="quick-action-btn">
                <i className="fas fa-search"></i> Find EVs
              </Link>
              <Link href="/dashboard/customer/bookings" className="quick-action-btn">
                <i className="fas fa-calendar"></i> My Bookings
              </Link>
            </div>
          </section>
        </>
    )
}