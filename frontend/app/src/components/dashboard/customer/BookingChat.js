'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function BookingChat({ bookingId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [bookingId]);

    useEffect(scrollToBottom, [messages]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/messages/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error("Chat fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/messages/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newMessage })
            });
            if (res.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (err) {
            console.error("Send error:", err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h4>Chat with Owner</h4>
            </div>
            
            <div className="messages-box">
                {loading ? <p>Loading chat...</p> : messages.map((m, i) => (
                    <div key={i} className={`msg ${m.senderId === localStorage.getItem('user_id') ? 'sent' : 'received'}`}>
                        <div className="bubble">
                            {m.content}
                            <span className="time">{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="input-area">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>

            <style jsx>{`
                .chat-container { border: 1px solid #eee; border-radius: 12px; display: flex; flex-direction: column; height: 400px; background: #fff; margin-top: 20px; }
                .chat-header { padding: 10px 15px; border-bottom: 1px solid #eee; background: #fafafa; border-radius: 12px 12px 0 0; }
                .messages-box { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
                .msg { display: flex; width: 100%; }
                .msg.sent { justify-content: flex-end; }
                .bubble { max-width: 75%; padding: 8px 12px; border-radius: 15px; font-size: 14px; position: relative; }
                .sent .bubble { background: #0070f3; color: white; border-bottom-right-radius: 2px; }
                .received .bubble { background: #f0f0f0; color: #333; border-bottom-left-radius: 2px; }
                .time { display: block; font-size: 10px; margin-top: 4px; opacity: 0.7; }
                .input-area { display: flex; padding: 10px; border-top: 1px solid #eee; gap: 8px; }
                .input-area input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 20px; outline: none; }
                .input-area button { background: #0070f3; color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-weight: 600; }
            `}</style>
        </div>
    );
}