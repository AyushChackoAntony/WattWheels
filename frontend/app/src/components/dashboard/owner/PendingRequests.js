'use client';
import React, { useState } from 'react';

export default function PendingRequests({ requests, onRefresh }) {
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState(null);

    const handleAction = async (bookingId, action) => {
        setProcessingId(bookingId);
        setError(null);

        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/owner/bookings/${bookingId}/respond`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action }) // 'approve' or 'reject'
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${action} booking`);
            }

            // Success! Trigger a refresh of the dashboard data
            onRefresh(); 
            
        } catch (err) {
            console.error(`Error during ${action}:`, err);
            setError(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (!requests || requests.length === 0) {
        return (
            <div className="pending-requests-empty">
                <p>You have no pending booking requests right now.</p>
            </div>
        );
    }

    return (
        <div className="pending-requests-container">
            <h3>Pending Booking Requests</h3>
            {error && <div className="error-banner">{error}</div>}
            
            <div className="requests-list">
                {requests.map((req) => (
                    <div key={req.id} className="request-card">
                        <div className="request-info">
                            <h4>{req.vehicle_name || 'Your Vehicle'}</h4>
                            <p><strong>Pickup:</strong> {req.start_date}</p>
                            <p><strong>Dropoff:</strong> {req.end_date}</p>
                            <p className="request-price"><strong>Estimated Payout:</strong> ₹{(req.total_price * 0.85).toFixed(2)}</p>
                        </div>
                        
                        <div className="request-actions">
                            <button 
                                className="btn-approve"
                                onClick={() => handleAction(req.id, 'approve')}
                                disabled={processingId === req.id}
                            >
                                {processingId === req.id ? 'Processing...' : '✔️ Approve'}
                            </button>
                            <button 
                                className="btn-reject"
                                onClick={() => handleAction(req.id, 'reject')}
                                disabled={processingId === req.id}
                            >
                                {processingId === req.id ? '...' : '❌ Reject'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .pending-requests-container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    margin-bottom: 20px;
                }
                .requests-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-top: 15px;
                }
                .request-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    background: #fdfdfd;
                }
                .request-info p {
                    margin: 4px 0;
                    color: #555;
                }
                .request-price {
                    color: #2e7d32 !important;
                    font-weight: 600;
                }
                .request-actions {
                    display: flex;
                    gap: 10px;
                }
                .btn-approve {
                    background: #2e7d32;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .btn-approve:hover:not(:disabled) { background: #1b5e20; }
                .btn-reject {
                    background: #d32f2f;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .btn-reject:hover:not(:disabled) { background: #c62828; }
                button:disabled { opacity: 0.6; cursor: not-allowed; }
                .error-banner { color: #d32f2f; margin-bottom: 10px; }
            `}</style>
        </div>
    );
}