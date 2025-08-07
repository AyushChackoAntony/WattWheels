'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginSelection() {
  const router = useRouter();
  const redirectToLogin = (type) => {
    if (type === 'customer') router.push('/login/customer');
    else if (type === 'owner' || type === 'driver') router.push('/login/owner');
  };
  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <i className="fas fa-bolt"></i>
            <span>WattWheels</span>
          </div>
        </div>
        <div className="nav-right">
          <ul className="nav-links">
            <li>
              <Link href="/login" className="login-btn">Login</Link>
            </li>
            <li>
              <Link href="/signup" className="signup-btn">Sign Up</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="login-selection-container">
        <div className="login-selection-content">
          <div className="login-selection-header">
            <h1>Login to WattWheels</h1>
            <p>Choose how you want to login</p>
          </div>
          <div className="login-type-options">
            <div className="login-type-card" onClick={() => redirectToLogin('customer')} style={{cursor:'pointer'}}>
              <div className="login-type-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>Login as Customer</h3>
              <p>Access your customer account to rent electric vehicles</p>
            </div>
            <div className="login-type-card" onClick={() => redirectToLogin('owner')} style={{cursor:'pointer'}}>
              <div className="login-type-icon">
                <i className="fas fa-car"></i>
              </div>
              <h3>Login as Owner</h3>
              <p>Access your owner account to manage your vehicles</p>
            </div>
          </div>
          <div className="login-selection-footer">
            <p>Don't have an account? <Link href="/signup">Sign up here</Link></p>
            <Link href="/" className="back-home">&larr; Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
