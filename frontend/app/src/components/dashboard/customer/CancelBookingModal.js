'use client';
import React, { useState, useEffect } from 'react';

export default function CancelBookingModal({ bookingId, onClose, onConfirm }) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/bookings/${bookingId}/refund-preview`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPreview(data);
            setLoading(false);
        };
        fetchPreview();
    }, [bookingId]);

    if (loading) return <div className="modal-content">Calculating refund...</div>;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Cancel Booking?</h3>
                <div className="refund-breakdown">
                    <div className="row">
                        <span>Amount Paid:</span>
                        <span>₹{preview.total_paid}</span>
                    </div>
                    {preview.penalty_amount > 0 && (
                        <div className="row penalty">
                            <span>Cancellation Fee (Last Minute):</span>
                            <span>- ₹{preview.penalty_amount}</span>
                        </div>
                    )}
                    <hr />
                    <div className="row total">
                        <span>Total Refund:</span>
                        <span>₹{preview.refund_amount}</span>
                    </div>
                </div>

                {preview.is_last_minute && (
                    <p className="warning-text">
                        ⚠️ Note: Because this is less than 24 hours before pickup, a 20% fee applies.
                    </p>
                )}

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>Keep Booking</button>
                    <button className="btn-danger" onClick={onConfirm}>Confirm Cancellation</button>
                </div>
            </div>

            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-content { background: white; padding: 25px; border-radius: 12px; width: 350px; }
                .refund-breakdown { margin: 20px 0; }
                .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .penalty { color: #d32f2f; font-weight: 500; }
                .total { font-weight: bold; font-size: 1.1rem; margin-top: 10px; }
                .warning-text { font-size: 0.8rem; color: #666; background: #fff3e0; padding: 8px; border-radius: 4px; }
                .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
                .btn-secondary { flex: 1; padding: 10px; border: 1px solid #ccc; background: none; border-radius: 6px; cursor: pointer; }
                .btn-danger { flex: 1; padding: 10px; background: #d32f2f; color: white; border: none; border-radius: 6px; cursor: pointer; }
            `}</style>
        </div>
    );
}