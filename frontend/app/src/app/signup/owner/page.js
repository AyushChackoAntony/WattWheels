'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavbarLogSign from '@/components/NavbarLogSign';

export default function OwnerSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', address: '', terms: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.address) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    if (form.password.length < 6) {
      showMessage('Password must be at least 6 characters long', 'error');
      return;
    }
    if (!form.terms) {
      showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
      return;
    }

    const formData = {
      firstName: form.firstName, 
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      address: form.address
    };

    setLoading(true);

    // Static data check
    // setTimeout(() => {
    //   setLoading(false);
    //   showMessage('Account created successfully!', 'success');
    //   setTimeout(() => router.push('/owner/dashboard'), 1000);
    // }, 1000);

    // Dynamic data integration
    try{
      const res = await fetch("/api/ownerSignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.error || "Signup failed");
      }

      showMessage("Account created successfully!", 'success');
      router.push("/login/owner");
    } catch(e){
      showMessage(e.message, 'error');
    } finally{
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarLogSign />
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>Create Owner Account</h1>
            <p>Join WattWheels to list and manage your electric vehicles</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" rows={3} value={form.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange} required />
                <span>
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </span>
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={loading}>
                <span className="btn-text" style={{ display: loading ? 'none' : 'inline-block' }}>Create Account</span>
                <span className="btn-loading" style={{ display: loading ? 'inline-block' : 'none' }}>
                  <i className="fas fa-spinner fa-spin"></i> Creating account...
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
              Already have an account?{' '}
              <Link href="/login/owner">Login here</Link>
            </p>
            <Link href="/signup" className="back-link">&larr; Back to signup options</Link>
          </div>
        </div>
      </div>
    </>
  );
}
