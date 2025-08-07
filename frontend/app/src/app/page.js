'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export default function Home() {
  const handleBookNowClick = (vehicleId) => {
    alert(vehicleId ? `Book Now: ${vehicleId}` : "Find EVs clicked");
  };
  return (
    <>
      <header>
        <nav className="navbar">
          <div className="nav-left">
            <div className="logo">
              <i className="fas fa-bolt"></i>
              <span>WattWheels</span>
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
      </header>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <i className="fas fa-leaf"></i>
                <span>Eco-Friendly Transportation</span>
              </div>
              <h1>
                Drive the Future with <span className="highlight">Electric Vehicles</span>
              </h1>
              <p className="hero-subtitle">
                Rent premium electric cars and bikes for your daily commute. Zero emissions, maximum convenience.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">EVs Available</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Cities</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Happy Users</span>
                </div>
              </div>
              <form className="booking-form" onSubmit={e => e.preventDefault()}>
                <div className="form-container">
                  <div className="form-header">
                    <h3>Find Your Perfect EV</h3>
                    <p>Quick and easy booking process</p>
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><i className="fas fa-map-marker-alt"></i></div>
                    <input type="text" placeholder="Pickup location" />
                  </div>
                  <div className="input-group">
                    <div className="input-icon"><i className="fas fa-map-marker-alt"></i></div>
                    <input type="text" placeholder="Drop-off location" />
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <div className="input-icon"><i className="fas fa-calendar"></i></div>
                      <input type="date" />
                    </div>
                    <div className="input-group">
                      <div className="input-icon"><i className="fas fa-clock"></i></div>
                      <input type="time" />
                    </div>
                  </div>
                  <div className="form-buttons">
                    <button type="button" className="primary-btn" onClick={() => handleBookNowClick()}>
                      <i className="fas fa-search"></i> Find EVs
                    </button>
                    <button type="button" className="secondary-btn">
                      <i className="fas fa-calendar-plus"></i> Schedule Later
                    </button>
                  </div>
                </div>
              </form>
              <div className="hero-links">
                <Link href="/signup/owner" className="link-btn">
                  <i className="fas fa-car"></i> Become an Owner
                </Link>
                <span className="separator">•</span>
                <a href="#vehicles" className="link-btn">
                  <i className="fas fa-bolt"></i> View All EVs
          </a>
        </div>
            </div>
            <div className="hero-right">
              <div className="hero-image">
                <Image src="/images/hero-car.svg" alt="Electric Vehicle" width={400} height={300} />
                <div className="floating-card">
                  <div className="card-icon"><i className="fas fa-charging-station"></i></div>
                  <div className="card-content">
                    <h4>Charging Network</h4>
                    <p>Access to 1000+ charging stations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="features" id="about">
          <div className="container">
            <div className="section-header">
              <h2>Why Choose WattWheels?</h2>
              <p>Experience the future of transportation with our comprehensive EV rental platform</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-leaf"></i></div>
                <h3>Eco-Friendly</h3>
                <p>Zero emissions, reduced carbon footprint. Drive green, live clean.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-wallet"></i></div>
                <h3>Cost-Effective</h3>
                <p>Save money on fuel and maintenance. EVs are cheaper to operate.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-mobile-alt"></i></div>
                <h3>Easy Booking</h3>
                <p>Book your EV in seconds with our user-friendly mobile app.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-shield-alt"></i></div>
                <h3>Safe & Secure</h3>
                <p>All vehicles are regularly maintained and fully insured.</p>
              </div>
            </div>
          </div>
        </section>
        {/* How It Works Section */}
        <section className="how-it-works" id="how-it-works">
          <div className="container">
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Get your electric vehicle in just 3 simple steps</p>
            </div>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-icon"><i className="fas fa-search"></i></div>
                <h3>Find Your EV</h3>
                <p>Browse our selection of electric cars and bikes. Filter by type, range, and price.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-icon"><i className="fas fa-credit-card"></i></div>
                <h3>Book & Pay</h3>
                <p>Select your dates, choose your payment method, and confirm your booking.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-icon"><i className="fas fa-key"></i></div>
                <h3>Drive Away</h3>
                <p>Pick up your EV at the designated location and enjoy your eco-friendly ride.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Vehicles Section */}
        <section className="featured-vehicles" id="vehicles">
          <div className="container">
            <div className="section-header">
              <h2>Featured Electric Vehicles</h2>
              <p>Choose from our premium selection of electric cars and bikes</p>
            </div>
            <div className="vehicles-grid">
              <div className="vehicle-card">
                <div className="vehicle-image">
                  <Image src="/images/ev-cars/tesla-model-3.svg" alt="Tesla Model 3" width={200} height={120} />
                  <div className="vehicle-badge">Popular</div>
                </div>
                <div className="vehicle-info">
                  <h3>Tesla Model 3</h3>
                  <div className="vehicle-specs">
                    <span><i className="fas fa-battery-three-quarters"></i> 350km range</span>
                    <span><i className="fas fa-tachometer-alt"></i> 0-60 in 3.1s</span>
                  </div>
                  <div className="vehicle-price">
                    <span className="price">₹2,500</span>
                    <span className="period">/day</span>
                  </div>
                  <button className="book-btn" onClick={() => handleBookNowClick('tesla-model-3')}>Book Now</button>
                </div>
              </div>
              <div className="vehicle-card">
                <div className="vehicle-image">
                  <Image src="/images/ev-cars/ola-s1.svg" alt="Ola S1 Pro" width={200} height={120} />
                  <div className="vehicle-badge">New</div>
                </div>
                <div className="vehicle-info">
                  <h3>Ola S1 Pro</h3>
                  <div className="vehicle-specs">
                    <span><i className="fas fa-battery-three-quarters"></i> 180km range</span>
                    <span><i className="fas fa-tachometer-alt"></i> 0-40 in 3.0s</span>
                  </div>
                  <div className="vehicle-price">
                    <span className="price">₹800</span>
                    <span className="period">/day</span>
                  </div>
                  <button className="book-btn" onClick={() => handleBookNowClick('ola-s1')}>Book Now</button>
                </div>
              </div>
              <div className="vehicle-card">
                <div className="vehicle-image">
                  <Image src="/images/ev-cars/ather-450x.svg" alt="Ather 450X" width={200} height={120} />
                  <div className="vehicle-badge">Best Value</div>
                </div>
                <div className="vehicle-info">
                  <h3>Ather 450X</h3>
                  <div className="vehicle-specs">
                    <span><i className="fas fa-battery-three-quarters"></i> 150km range</span>
                    <span><i className="fas fa-tachometer-alt"></i> 0-40 in 3.9s</span>
                  </div>
                  <div className="vehicle-price">
                    <span className="price">₹600</span>
                    <span className="period">/day</span>
                  </div>
                  <button className="book-btn" onClick={() => handleBookNowClick('ather-450x')}>Book Now</button>
                </div>
              </div>
            </div>
            <div className="view-all-container">
              <Link href="/pages/customer/browse-vehicles.html" className="view-all-btn">
                View All Vehicles <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Go Electric?</h2>
              <p>Join thousands of users who have already switched to sustainable transportation</p>
              <div className="cta-buttons">
                <Link href="/signup" className="cta-primary">Get Started Today</Link>
                <Link href="/signup/owner" className="cta-secondary">Become an Owner</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <i className="fas fa-bolt"></i>
                <span>WattWheels</span>
              </div>
              <p>Leading the electric vehicle revolution with sustainable transportation solutions.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li><a href="#vehicles">EV Rentals</a></li>
                <li><a href="#charging">Charging Network</a></li>
                <li><a href="#insurance">Insurance</a></li>
                <li><a href="#support">24/7 Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#safety">Safety</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 WattWheels. All rights reserved. | Driving the future, sustainably.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
