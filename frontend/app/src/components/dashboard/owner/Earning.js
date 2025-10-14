'use client';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Earning(){
    const { user } = useAuth();
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    // This hook fetches a summary of the owner's earnings.
    useEffect(() => {
        const fetchEarningsSummary = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/earnings/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEarnings(data);
                }
            } catch (error) {
                console.error("Failed to fetch earnings summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarningsSummary();
    }, [user]);

    if (loading) {
        return <p>Loading earnings overview...</p>;
    }

    return (
        <section className="earnings-overview-section">
            <div className="section-header">
              <h2>Earnings Overview</h2>
              <Link href="/dashboard/owner/earnings" className="view-all-link">View Details</Link>
            </div>
            <div className="earnings-grid">
              <div className="earning-card">
                <div className="earning-header">
                  <h3>This Month</h3>
                  <span className="earning-amount">₹{(earnings?.thisMonthEarnings || 0).toLocaleString()}</span>
                </div>
                <div className="earning-chart">
                  {/* The chart bars can be made dynamic in a future step */}
                  <div className="chart-bar" style={{height: '60%'}}></div>
                  <div className="chart-bar" style={{height: '80%'}}></div>
                  <div className="chart-bar" style={{height: '45%'}}></div>
                  <div className="chart-bar" style={{height: '90%'}}></div>
                </div>
                <div className="earning-stats">
                  <span>vs. ₹{(earnings?.lastMonthEarnings || 0).toLocaleString()} last month</span>
                </div>
              </div>
              <div className="earning-summary">
                <div className="summary-item">
                  <div className="summary-label">Total Lifetime Earnings</div>
                  <div className="summary-value">₹{(earnings?.total_earnings || 0).toLocaleString()}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Available for Payout</div>
                  <div className="summary-value">₹{(earnings?.availableBalance || 0).toLocaleString()}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Total Trips</div>
                  <div className="summary-value">{earnings?.totalTrips || 0}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Commission Rate</div>
                  <div className="summary-value">{earnings?.commissionRate || 15}%</div>
                </div>
              </div>
            </div>
        </section>
    );
}