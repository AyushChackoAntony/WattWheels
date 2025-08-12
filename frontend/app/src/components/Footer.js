import Link from "next/link";
import "../styles/Footer.css";

export default function Footer() {
    return(
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
    )
}        