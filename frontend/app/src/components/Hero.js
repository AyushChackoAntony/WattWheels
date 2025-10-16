import Link from "next/link";
import "../styles/Hero.css";

export default function Hero() {
    return(
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
                {/* <Image src="/images/hero-car.svg" alt="Electric Vehicle" width={400} height={300} /> */}
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
    )
}