import React, { useState } from 'react';
import '@/styles/dashboard/customer/settings/paymentSettings.css';

export default function PaymentSettings({ data, onChange }) {
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const handleToggle = (field) => {
    onChange({ [field]: !data[field] });
  };

  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleRemoveCard = (cardId) => {
    const updatedCards = data.savedCards.filter(card => card.id !== cardId);
    onChange({ savedCards: updatedCards });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Payment Settings</h2>
        <p>Manage your payment methods and preferences</p>
      </div>

      <div className="settings-form">
        {/* Default Payment Method */}
        <div className="form-group-container">
          <h3>Default Payment Method</h3>
          
          <div className="payment-methods-grid">
            <div 
              className={`payment-method-card ${data.defaultPaymentMethod === 'wallet' ? 'selected' : ''}`}
              onClick={() => handleInputChange('defaultPaymentMethod', 'wallet')}
            >
              <i className="fas fa-wallet"></i>
              <span>Wallet</span>
              {data.defaultPaymentMethod === 'wallet' && (
                <i className="fas fa-check-circle check-icon"></i>
              )}
            </div>

            <div 
              className={`payment-method-card ${data.defaultPaymentMethod === 'upi' ? 'selected' : ''}`}
              onClick={() => handleInputChange('defaultPaymentMethod', 'upi')}
            >
              <i className="fas fa-mobile-alt"></i>
              <span>UPI</span>
              {data.defaultPaymentMethod === 'upi' && (
                <i className="fas fa-check-circle check-icon"></i>
              )}
            </div>

            <div 
              className={`payment-method-card ${data.defaultPaymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => handleInputChange('defaultPaymentMethod', 'card')}
            >
              <i className="fas fa-credit-card"></i>
              <span>Card</span>
              {data.defaultPaymentMethod === 'card' && (
                <i className="fas fa-check-circle check-icon"></i>
              )}
            </div>
          </div>
        </div>

        {/* Saved Cards */}
        <div className="form-group-container">
          <div className="saved-cards-header">
            <h3>Saved Cards</h3>
            <button 
              className="add-card-btn"
              onClick={() => setShowAddCardModal(true)}
            >
              <i className="fas fa-plus"></i>
              Add Card
            </button>
          </div>

          <div className="saved-cards-list">
            {data.savedCards.map((card) => (
              <div key={card.id} className="saved-card-item">
                <div className="card-icon">
                  <i className={`fab fa-cc-${card.brand.toLowerCase()}`}></i>
                </div>
                <div className="card-info">
                  <h4>{card.brand} •••• {card.last4}</h4>
                  <p>Expires {card.expiry}</p>
                </div>
                <button 
                  className="remove-card-btn"
                  onClick={() => handleRemoveCard(card.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Auto Add Money */}
        <div className="form-group-container">
          <h3>Auto Add Money</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <label>Enable Auto Add</label>
              <p>Automatically add money when balance falls below threshold</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={data.autoAddMoney}
                onChange={() => handleToggle('autoAddMoney')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {data.autoAddMoney && (
            <div className="auto-add-settings">
              <div className="form-group">
                <label>Threshold Amount</label>
                <div className="input-with-prefix">
                  <span className="prefix">₹</span>
                  <input
                    type="number"
                    value={data.autoAddThreshold}
                    onChange={(e) => handleInputChange('autoAddThreshold', parseInt(e.target.value))}
                    min="100"
                    max="5000"
                  />
                </div>
                <p className="input-help">Add money when balance falls below this amount</p>
              </div>

              <div className="form-group">
                <label>Auto Add Amount</label>
                <div className="input-with-prefix">
                  <span className="prefix">₹</span>
                  <input
                    type="number"
                    value={data.autoAddAmount}
                    onChange={(e) => handleInputChange('autoAddAmount', parseInt(e.target.value))}
                    min="500"
                    max="10000"
                  />
                </div>
                <p className="input-help">Amount to add automatically</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="add-card-modal-overlay">
          <div className="add-card-modal">
            <div className="modal-header">
              <h3>Add New Card</h3>
              <button className="close-btn" onClick={() => setShowAddCardModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" maxLength="3" />
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="Name on card" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddCardModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}