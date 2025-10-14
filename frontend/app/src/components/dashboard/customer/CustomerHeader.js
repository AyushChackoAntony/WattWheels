'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import '../../../styles/dashboard/custDash.css';

export default function Header({ user }) {
    const { logout } = useAuth();

    // This function calls the logout method to properly clear the session.
    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

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
                                <Image src="/images/avatar.png" alt="User Avatar" className="user-avatar" width={40} height={40} />
                                <div className="user-details">
                                    <span className="user-name">{user.firstName} {user.lastName}</span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="dropdown-menu">
                                <Link href="/dashboard/customer/profile"><i className="fas fa-user"></i> Profile</Link>
                                <Link href="#"><i className="fas fa-cog"></i> Settings</Link>
                                <Link href="#"><i className="fas fa-calendar"></i> My Bookings</Link>
                                <a href="#" className="logout-btn" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}