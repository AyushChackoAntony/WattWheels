import Link from "next/link";
import "../styles/Features.css";

export default function Features() {
    return(
        <>
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
                  {/* <Image src="/images/ev-cars/tesla-model-3.svg" alt="Tesla Model 3" width={200} height={120} /> */}
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
                  {/* <Image src="/images/ev-cars/ola-s1.svg" alt="Ola S1 Pro" width={200} height={120} /> */}
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
                  {/* <Image src="/images/ev-cars/ather-450x.svg" alt="Ather 450X" width={200} height={120} /> */}
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
        </>
    )
}