import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import '@/styles/dashboard/ownerDash.css';

export default function OwnerHeader({ user }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirect will be handled by AuthContext
    window.location.href = '/';
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <i className="fas fa-bolt"></i>
              <span>
                <Link href="/dashboard/owner" style={{ textDecoration: 'none', color: 'inherit' }}>
                  WattWheels
                </Link>
              </span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="user-info">
                <Image 
                  src="/images/avatar.png" 
                  alt="Owner Avatar" 
                  className="user-avatar" 
                  width={40} 
                  height={40} 
                />
                <div className="user-details">
                  <span className="user-name">{user.firstName} {user.lastName}</span>
                  <span className="user-email">Owner</span>
                </div>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="dropdown-menu">
                <Link href="/dashboard/owner/profile">
                  <i className="fas fa-user"></i> Profile
                </Link>
                <Link href="/dashboard/owner/vehicles">
                  <i className="fas fa-car"></i> My Vehicles
                </Link>
                <Link href="/dashboard/owner/earnings">
                  <i className="fas fa-wallet"></i> My Earnings
                </Link>
                <Link href="/dashboard/owner/settings">
                  <i className="fas fa-cog"></i> Settings
                </Link>
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