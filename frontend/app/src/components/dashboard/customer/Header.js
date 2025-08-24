import Link from 'next/link';
import '../../../styles/dashboard/custDash.css';

export default function Header({ user }) {
    return (
        <>
            <header className="dashboard-header">
                <div className="header-content">
                <div className="header-left">
                    <div className="logo">
                    <i className="fas fa-bolt"></i>
                    <span>WattWheels</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="user-menu">
                    <div className="user-info">
                        {/* <Image src="/images/avatar.png" alt="User Avatar" className="user-avatar" width={40} height={40} /> */}
                        <div className="user-details">
                        <span className="user-name">{user.firstName} {user.lastName}</span>
                        <span className="user-email">{user.email}</span>
                        </div>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="dropdown-menu">
                        <Link href="#"><i className="fas fa-user"></i> Profile</Link>
                        <Link href="#"><i className="fas fa-cog"></i> Settings</Link>
                        <Link href="#"><i className="fas fa-calendar"></i> My Bookings</Link>
                        <button className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button>
                    </div>
                    </div>
                </div>
                </div>
            </header>
        </>
    )
}