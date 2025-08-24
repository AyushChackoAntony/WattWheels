import Link from "next/link";

export default function QuickActions(){
    return (
        <>
            <section className="quick-actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-user"></i></div>
                <h3>Profile</h3>
                <p>Update your personal information</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-cog"></i></div>
                <h3>Settings</h3>
                <p>Manage your account preferences</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-credit-card"></i></div>
                <h3>Payments</h3>
                <p>Manage payment methods</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-headset"></i></div>
                <h3>Support</h3>
                <p>Get help and contact us</p>
              </Link>
            </div>
          </section>
        </>
    )
}