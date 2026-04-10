'use client';
import React, { useState, useEffect } from 'react';

export default function PricingRulesManager({ vehicleId }) {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        rule_type: 'weekend',
        adjustment_type: 'multiplier',
        value: '',
        start_date: '',
        end_date: '',
        rule_name: ''
    });

    useEffect(() => {
        fetchRules();
    }, [vehicleId]);

    const fetchRules = async () => {
        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/owner/vehicles/${vehicleId}/pricing-rules`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setRules(data.rules || []);
        } catch (err) {
            console.error("Failed to fetch rules", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('wattwheels_token');
            const res = await fetch(`http://127.0.0.1:5000/api/owner/vehicles/${vehicleId}/pricing-rules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                fetchRules(); // Refresh list
            }
        } catch (err) {
            alert("Error saving rule");
        }
    };

    const deleteRule = async (ruleId) => {
        if (!confirm("Delete this pricing rule?")) return;
        try {
            const token = localStorage.getItem('wattwheels_token');
            await fetch(`http://127.0.0.1:5000/api/owner/pricing-rules/${ruleId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchRules();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="pricing-manager">
            <div className="pricing-header">
                <h4>Dynamic Pricing Rules</h4>
                <button className="btn-add-rule" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Rule'}
                </button>
            </div>

            {showForm && (
                <form className="rule-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <select 
                            value={formData.rule_type} 
                            onChange={(e) => setFormData({...formData, rule_type: e.target.value})}
                        >
                            <option value="weekend">Weekend Surge</option>
                            <option value="custom_range">Holiday / Date Range</option>
                        </select>

                        <select 
                            value={formData.adjustment_type} 
                            onChange={(e) => setFormData({...formData, adjustment_type: e.target.value})}
                        >
                            <option value="multiplier">Multiplier (e.g. 1.2x)</option>
                            <option value="fixed">Fixed Price (₹ Total)</option>
                        </select>

                        <input 
                            type="number" step="0.1" placeholder="Value (e.g. 1.5)" required
                            value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})}
                        />

                        {formData.rule_type === 'custom_range' && (
                            <>
                                <input type="date" required value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                                <input type="date" required value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
                            </>
                        )}
                    </div>
                    <button type="submit" className="btn-save">Save Rule</button>
                </form>
            )}

            <div className="rules-list">
                {rules.length === 0 ? <p className="empty-msg">No active pricing rules.</p> : (
                    rules.map(rule => (
                        <div key={rule.id} className="rule-item">
                            <div>
                                <strong>{rule.rule_type === 'weekend' ? '📅 Weekend' : '🗓️ Special Dates'}</strong>
                                <p>{rule.adjustment_type === 'multiplier' ? `${rule.value}x Price` : `₹${rule.value} Fixed`}</p>
                                {rule.start_date && <small>{rule.start_date} to {rule.end_date}</small>}
                            </div>
                            <button onClick={() => deleteRule(rule.id)} className="btn-del">🗑️</button>
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .pricing-manager { background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin-top: 10px; }
                .pricing-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .btn-add-rule { background: #0070f3; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; }
                .rule-form { background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
                .rule-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
                .btn-save { width: 100%; background: #28a745; color: white; border: none; padding: 8px; border-radius: 4px; }
                .btn-del { background: none; border: none; cursor: pointer; filter: grayscale(1); }
                .btn-del:hover { filter: none; }
            `}</style>
        </div>
    );
}