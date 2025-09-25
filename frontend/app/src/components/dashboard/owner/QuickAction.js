import Link from "next/link";
import Image from "next/image";

export default function QuickAction() {
  return (
    <>
      <section className="quick-actions-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="actions-grid">
          {/* Add Vehicle */}
          <Link href="/dashboard/owner/vehicles" className="action-card">
            <div className="action-icon">
              <i className="fas fa-car"></i>
            </div>
            <h3>Add Vehicle</h3>
            <p>List a new electric vehicle</p>
          </Link>

          {/* Withdraw Earnings */}
          <Link href="/dashboard/owner/earnings" className="action-card">
            <div className="action-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <h3>Withdraw Earnings</h3>
            <p>Transfer money to your account</p>
          </Link>

          {/* Set Availability */}
          <Link href="/dashboard/owner/setAvailability" className="action-card">
            <div className="action-icon">
              <i className="fas fa-calendar"></i>
            </div>
            <h3>Set Availability</h3>
            <p>Manage your vehicle availability</p>
          </Link>

          {/* Owner Support */}
          <Link href="/dashboard/owner/support" className="action-card">
            <div className="action-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>Owner Support</h3>
            <p>Get help and contact us</p>
          </Link>
        </div>
      </section>
    </>
  );
}
