'use client';
import React, { useState } from 'react';

export default function ReviewModal({ booking, onClose, onReviewSubmitted }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/bookings/${booking.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    target_id: booking.vehicle_id,
                    target_type: 'vehicle',
                    rating: rating,
                    comment: comment
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit review");

            onReviewSubmitted();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="review-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Rate Your Experience</h2>
                <p>How was your trip with the <strong>{booking.vehicle_name || 'EV'}</strong>?</p>

                <form onSubmit={handleSubmit}>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={star <= rating ? 'star active' : 'star'}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Share details of your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="submit-review-btn" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center;
                    justify-content: center; z-index: 1000;
                }
                .review-modal {
                    background: white; padding: 30px; border-radius: 15px;
                    width: 100%; max-width: 450px; position: relative; text-align: center;
                }
                .close-btn {
                    position: absolute; top: 15px; right: 20px; border: none;
                    background: none; font-size: 24px; cursor: pointer;
                }
                .star-rating { margin: 20px 0; font-size: 32px; display: flex; justify-content: center; gap: 10px; }
                .star { background: none; border: none; cursor: pointer; color: #ccc; transition: 0.2s; }
                .star.active { color: #ffc107; }
                textarea {
                    width: 100%; height: 100px; padding: 12px; border: 1px solid #ddd;
                    border-radius: 8px; margin-bottom: 20px; resize: none; font-family: inherit;
                }
                .submit-review-btn {
                    width: 100%; background: #0070f3; color: white; border: none;
                    padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;
                }
                .submit-review-btn:disabled { background: #ccc; }
                .error-msg { color: #d32f2f; margin-bottom: 10px; font-size: 14px; }
            `}</style>
        </div>
    );
}