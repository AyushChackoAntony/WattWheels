'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavbarLogSign from '@/components/NavbarLogSign';

export default function OwnerLogin() {
  const router = useRouter();
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
    setLoading(true);
    // Simulate login logic (replace with real API/authManager)
    setTimeout(() => {
      setLoading(false);
      if (email === 'owner@example.com' && password === 'password') {
        showMessage('Login successful!', 'success');
        setTimeout(() => router.push('/dashboard/owner'), 1000);
      } else {
        showMessage('Invalid credentials', 'error');
      }
    }, 1000);
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
