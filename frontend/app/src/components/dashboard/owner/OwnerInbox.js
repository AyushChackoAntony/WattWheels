'use client';
import React, { useState, useEffect } from 'react';

export default function OwnerInbox() {
    const [conversations, setConversations] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('wattwheels_token') : null;

    // 1. Fetch all bookings that have messages
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch('http://127.0.0.1:5000/api/bookings/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                // Filter to show bookings that likely need communication
                setConversations(data.bookings || []);
            } catch (err) {
                console.error("Error fetching conversations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [token]);

    // 2. Fetch messages for a specific booking
    const loadMessages = async (bookingId) => {
        setSelectedBooking(bookingId);
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/messages/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error("Error loading messages", err);
        }
    };

    // 3. Send a reply
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedBooking) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/messages/${selectedBooking}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newMessage })
            });

            if (res.ok) {
                setNewMessage('');
                loadMessages(selectedBooking); // Refresh chat
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    if (loading) return <p>Loading Inbox...</p>;

    return (
        <div className="inbox-container">
            <div className="inbox-sidebar">
                <h3>Messages</h3>
                {conversations.map((conv) => (
                    <div 
                        key={conv.id} 
                        className={`conv-item ${selectedBooking === conv.id ? 'active' : ''}`}
                        onClick={() => loadMessages(conv.id)}
                    >
                        <p className="conv-vehicle">Booking #{conv.id.slice(-6)}</p>
                        <span className={`status-pill ${conv.status}`}>{conv.status}</span>
                    </div>
                ))}
            </div>

            <div className="chat-window">
                {selectedBooking ? (
                    <>
                        <div className="messages-list">
                            {messages.length === 0 && <p className="empty-chat">No messages yet. Start the conversation!</p>}
                            {messages.map((m, idx) => (
                                <div key={idx} className={`msg-bubble ${m.senderId === 'system' ? 'system' : 'user'}`}>
                                    <p>{m.content}</p>
                                    <small>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                </div>
                            ))}
                        </div>
                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Type a reply..." 
                                value={newMessage} 
                                onChange={(e) => setNewMessage(e.target.value)} 
                            />
                            <button type="submit">Send</button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Select a booking to view messages</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .inbox-container { display: flex; height: 500px; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #eee; }
                .inbox-sidebar { width: 30%; border-right: 1px solid #eee; overflow-y: auto; background: #fafafa; }
                .inbox-sidebar h3 { padding: 20px; margin: 0; border-bottom: 1px solid #eee; }
                .conv-item { padding: 15px 20px; cursor: pointer; border-bottom: 1px solid #f0f0f0; transition: 0.2s; }
                .conv-item:hover { background: #f0f7ff; }
                .conv-item.active { background: #e6f0ff; border-left: 4px solid #0070f3; }
                .conv-vehicle { font-weight: 600; margin-bottom: 5px; color: #333; }
                
                .chat-window { width: 70%; display: flex; flex-direction: column; background: #fff; }
                .messages-list { flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
                .msg-bubble { max-width: 80%; padding: 10px 15px; border-radius: 18px; font-size: 14px; position: relative; }
                .msg-bubble.user { align-self: flex-start; background: #f0f0f0; color: #333; border-bottom-left-radius: 2px; }
                .msg-bubble.system { align-self: flex-end; background: #0070f3; color: white; border-bottom-right-radius: 2px; }
                
                .chat-input { padding: 20px; border-top: 1px solid #eee; display: flex; gap: 10px; }
                .chat-input input { flex-grow: 1; padding: 10px; border: 1px solid #ddd; border-radius: 25px; outline: none; }
                .chat-input button { background: #0070f3; color: white; border: none; padding: 0 20px; border-radius: 25px; cursor: pointer; }
                .no-chat-selected { display: flex; align-items: center; justify-content: center; height: 100%; color: #888; }
                .status-pill { font-size: 10px; text-transform: uppercase; padding: 2px 6px; border-radius: 10px; background: #ddd; }
            `}</style>
        </div>
    );
}