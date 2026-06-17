'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
// You can add a CSS file later: import '@/styles/dashboard/chat.css';

export default function BookingChat({ bookingId }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch messages when the component loads
    useEffect(() => {
        if (bookingId) {
            fetchMessages();
        }
    }, [bookingId]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/messages/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (err) {
            console.error("Failed to load messages", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch('http://127.0.0.1:5000/api/messages/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    booking_id: bookingId,
                    content: newMessage
                })
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages(); // Instantly reload to show the new message
            } else {
                console.error("Failed to send message");
            }
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    if (loading) return <p style={{ fontSize: '0.9rem', color: '#666' }}>Loading chat...</p>;

    return (
        <div className="booking-chat-container" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h3>Messages</h3>
            
            <div 
                className="chat-history" 
                style={{ 
                    maxHeight: '250px', 
                    overflowY: 'auto', 
                    background: '#f9f9f9', 
                    padding: '15px', 
                    borderRadius: '8px',
                    marginBottom: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                {messages.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', margin: 0 }}>No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div 
                                key={index} 
                                style={{ 
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    background: isMe ? '#2ecc71' : '#e0e0e0',
                                    color: isMe ? '#fff' : '#333',
                                    padding: '8px 12px',
                                    borderRadius: '15px',
                                    maxWidth: '80%'
                                }}
                            >
                                {msg.content}
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message to the owner..."
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button 
                    type="submit" 
                    style={{ padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}