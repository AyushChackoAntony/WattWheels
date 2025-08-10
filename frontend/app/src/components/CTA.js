import Link from "next/link";
import "../styles/CTA.css";

export default function CTA() {
    return(
        <>
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
        </>
    )
}