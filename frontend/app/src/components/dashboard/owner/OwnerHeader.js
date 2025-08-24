import Link from 'next/link';
import Image from 'next/image';
import '../../../styles/dashboard/ownerDash.css';

export default function OwnerHeader({ user }){
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
                        <Image src="/images/avatar.png" alt="Owner Avatar" className="user-avatar" width={40} height={40} />
                        <div className="user-details">
                        <span className="user-name">{user.firstName} {user.lastName}</span>
                        <span className="user-email">{user.email}</span>
                        </div>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="dropdown-menu">
                        <Link href="#"><i className="fas fa-user"></i> Profile</Link>
                        <Link href="#"><i className="fas fa-cog"></i> Settings</Link>
                        <Link href="#"><i className="fas fa-car"></i> My Vehicles</Link>
                        <Link href="#"><i className="fas fa-wallet"></i> Earnings</Link>
                        <button className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button>
                    </div>
                    </div>
                </div>
                </div>
            </header>
        </>
    )
}
