'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavbarLogSign from '@/components/NavbarLogSign';
import { useAuth } from '@/context/AuthContext';

export default function OwnerLogin() {
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
      const res = await fetch("http://127.0.0.1:5000/api/auth/login/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('wattwheels_token', data.access_token);
        // --- THIS IS THE CORRECTED PART ---
        // We use the real user data returned from the backend
        const userData = {
            firstName: data.user.firstName,
            email: email,
            id: data.user.id // Use the real ID from the database
        };
        // --- END OF CORRECTION ---

        // Store user data in context and localStorage
        login(userData, 'owner');

        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          router.push('/dashboard/owner')
        }, 1000);
      } else {
        showMessage(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      console.error("Error sending request:", error);
      showMessage('Could not connect to the server.', 'error');
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
            <h1>Owner Login</h1>
            <p>Welcome back! Please login to your owner account</p>
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
              <Link href="/signup/owner">Sign up as owner</Link>
            </p>
            <Link href="/login" className="back-link">&larr; Back to login options</Link>
          </div>
        </div>
      </div>
    </>
  );
}