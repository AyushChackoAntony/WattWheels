import Link from "next/link";
import Image from "next/image";

export default function QuickAction(){
    return(
        <>
            <section className="quick-actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="actions-grid">
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-car"></i></div>
                <h3>Add Vehicle</h3>
                <p>List a new electric vehicle</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-wallet"></i></div>
                <h3>Withdraw Earnings</h3>
                <p>Transfer money to your account</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-calendar"></i></div>
                <h3>Set Availability</h3>
                <p>Manage your vehicle availability</p>
              </Link>
              <Link href="#" className="action-card">
                <div className="action-icon"><i className="fas fa-headset"></i></div>
                <h3>Owner Support</h3>
                <p>Get help and contact us</p>
              </Link>
            </div>
          </section>
        </>
    )
}