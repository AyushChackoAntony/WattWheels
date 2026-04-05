import Link from "next/link";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
          <div className="nav-left">
            <div className="logo">
              <i className="fas fa-bolt"></i>
              {/* <span>WattWheels</span> */}
              <span><Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>WattWheels</Link></span>
            </div>
            <ul className="nav-links">
              <li><a href="#about">About</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#vehicles">Our EVs</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="nav-right">
            <ul className="nav-links">
              <li>
                <Link href="/login" className="login-btn">Login</Link>
              </li>
              <li>
                <Link href="/signup" className="signup-btn">Sign Up</Link>
              </li>
              <li>
                <Link href="/pages/customer/dashboard.html" className="dashboard-link" style={{display: 'none'}}>
                  <i className="fas fa-user"></i> Dashboard
                </Link>
              </li>
              <li>
                <div className="user-menu" style={{display: 'none'}}>
                  <button className="logout-btn" onClick={() => alert("Logout")}> <i className="fas fa-sign-out-alt"></i> Logout </button>
                </div>
          </li>
            </ul>
          </div>
        </nav>
  );
}