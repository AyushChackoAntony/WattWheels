'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavbarLogSign from '@/components/NavbarLogSign';
import { useAuth } from '@/context/AuthContext';

export default function CustomerLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    const loginData = {
      email: email,
      password: password
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customerLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();
      console.log("Response from API route:", data);

      if (res.ok) {
        // Extract user data from response
        // Adjust this based on what your Flask API returns
        const userData = {
          firstName: data.user?.firstName || 'John', // Replace with actual API response
          lastName: data.user?.lastName || 'Doe',
          email: data.user?.email || email,
          id: data.user?.id || '12345'
        };

        // Store user data in context and localStorage
        login(userData, 'customer');
        
        showMessage('Login successful!', 'success');
        setTimeout(() => {
          router.push('/dashboard/customer');
        }, 1000);
      } else {
        showMessage(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      console.error("Error sending request:", error);
      showMessage('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarLogSign />
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Customer Login</h1>
            <p>Welcome back! Please login to your customer account</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={loading}>
                <span className="btn-text" style={{ display: loading ? 'none' : 'inline-block' }}>Login</span>
                <span className="btn-loading" style={{ display: loading ? 'inline-block' : 'none' }}>
                  <i className="fas fa-spinner fa-spin"></i> Logging in...
                </span>
              </button>
            </div>
          </form>
          {message && (
            <div className={`auth-message ${messageType}`}>
              <i className={`fas fa-${messageType === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
              <span>{message}</span>
            </div>
          )}
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link href="/signup/customer">Sign up as customer</Link>
            </p>
            <Link href="/login" className="back-link">&larr; Back to login options</Link>
          </div>
        </div>
      </div>
    </>
  );
}