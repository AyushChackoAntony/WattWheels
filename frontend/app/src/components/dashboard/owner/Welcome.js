import Link from "next/link";

export default function Welcome({user}){
    return (
        <>
            <section className="welcome-section">
                <div className="welcome-content">
                <h1>Welcome back, {user.firstName}! 👋</h1>
                <p>Your EVs are helping people go green!</p>
                </div>
                <div className="quick-actions">
                <Link href="/dashboard/owner/vehicles" className="quick-action-btn">
                    <i className="fas fa-car"></i> Manage Vehicles
                </Link>
                <Link href="/dashboard/owner/earnings" className="quick-action-btn">
                    <i className="fas fa-wallet"></i> View Earnings
                </Link>
                </div>
            </section>
        </>
    )
}