'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavbarLogSign from '@/components/NavbarLogSign';

export default function SignupSelection() {
  const router = useRouter();
  const redirectToSignup = (type) => {
    if (type === 'customer') router.push('/signup/customer');
    else if (type === 'owner' || type === 'driver') router.push('/signup/owner');
  };
  return (
    <>
      <NavbarLogSign />
      <div className="login-selection-container">
        <div className="login-selection-content">
          <div className="login-selection-header">
            <h1>Join WattWheels</h1>
            <p>Choose how you want to sign up</p>
          </div>
          <div className="login-type-options">
            <div className="login-type-card" onClick={() => redirectToSignup('customer')} style={{cursor:'pointer'}}>
              <div className="login-type-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>Sign up as Customer</h3>
              <p>Create a customer account to rent electric vehicles</p>
            </div>
            <div className="login-type-card" onClick={() => redirectToSignup('owner')} style={{cursor:'pointer'}}>
              <div className="login-type-icon">
                <i className="fas fa-car"></i>
              </div>
              <h3>Sign up as Owner</h3>
              <p>Create an owner account to list your vehicles</p>
            </div>
          </div>
          <div className="login-selection-footer">
            <p>Already have an account? <Link href="/login">Login here</Link></p>
            <Link href="/" className="back-home">&larr; Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
