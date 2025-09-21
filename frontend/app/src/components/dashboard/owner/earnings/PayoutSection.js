import React, { useState } from 'react';
import '@/styles/dashboard/owner/earnings/payoutSection.css';

export default function PayoutSection({ 
  availableBalance, 
  nextPayoutDate, 
  onRequestPayout, 
  onClose 
}) {
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const payoutMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'fas fa-university',
      description: 'Direct transfer to your bank account',
      processingTime: '1-3 business days',
      fee: 0
    },
    {
      id: 'upi',
      name: 'UPI Transfer',
      icon: 'fas fa-mobile-alt',
      description: 'Instant transfer via UPI',
      processingTime: 'Instant',
      fee: 0
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: 'fas fa-wallet',
      description: 'Transfer to digital wallet',
      processingTime: 'Instant',
      fee: 0
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    const amount = parseFloat(payoutAmount);

    if (!payoutAmount || isNaN(amount)) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amount < 500) {
      newErrors.amount = 'Minimum payout amount is ₹500';
    } else if (amount > availableBalance) {
      newErrors.amount = 'Amount exceeds available balance';
    }

    if (!selectedMethod) {
      newErrors.method = 'Please select a payout method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onRequestPayout({
        amount: parseFloat(payoutAmount),
        method: selectedMethod,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Payout request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (percentage) => {
    const amount = Math.floor((availableBalance * percentage) / 100);
    setPayoutAmount(amount.toString());
    setErrors({ ...errors, amount: '' });
  };

  return (
    <div className="payout-overlay">
      <div className="payout-modal">
        <div className="modal-header">
          <h2>Request Payout</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="payout-form">
          
          {/* Balance Info */}
          <div className="balance-info">
            <div className="balance-card">
              <div className="balance-icon">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="balance-details">
                <h3>Available Balance</h3>
                <p className="balance-amount">₹{availableBalance.toLocaleString()}</p>
                <span className="balance-note">Minimum payout: ₹500</span>
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="form-section">
            <h3>Payout Amount</h3>
            
            <div className="amount-input-group">
              <div className="currency-symbol">₹</div>
              <input
                type="number"
                placeholder="Enter amount"
                value={payoutAmount}
                onChange={(e) => {
                  setPayoutAmount(e.target.value);
                  setErrors({ ...errors, amount: '' });
                }}
                className={errors.amount ? 'error' : ''}
                min="500"
                max={availableBalance}
              />
            </div>
            {errors.amount && <span className="error-text">{errors.amount}</span>}

            {/* Quick Amount Buttons */}
            <div className="quick-amounts">
              <button
                type="button"
                className="quick-amount-btn"
                onClick={() => handleQuickAmount(25)}
              >
                25% (₹{Math.floor(availableBalance * 0.25).toLocaleString()})
              </button>
              <button
                type="button"
                className="quick-amount-btn"
                onClick={() => handleQuickAmount(50)}
              >
                50% (₹{Math.floor(availableBalance * 0.5).toLocaleString()})
              </button>
              <button
                type="button"
                className="quick-amount-btn"
                onClick={() => handleQuickAmount(100)}
              >
                100% (₹{availableBalance.toLocaleString()})
              </button>
            </div>
          </div>

          {/* Payout Method */}
          <div className="form-section">
            <h3>Payout Method</h3>
            
            <div className="payout-methods">
              {payoutMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payout-method ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setErrors({ ...errors, method: '' });
                  }}
                >
                  <div className="method-icon">
                    <i className={method.icon}></i>
                  </div>
                  <div className="method-info">
                    <h4>{method.name}</h4>
                    <p>{method.description}</p>
                    <div className="method-details">
                      <span className="processing-time">
                        <i className="fas fa-clock"></i>
                        {method.processingTime}
                      </span>
                      <span className="fee">
                        <i className="fas fa-tag"></i>
                        {method.fee === 0 ? 'No fee' : `₹${method.fee}`}
                      </span>
                    </div>
                  </div>
                  <div className="selection-indicator">
                    <i className="fas fa-check-circle"></i>
                  </div>
                </div>
              ))}
            </div>
            {errors.method && <span className="error-text">{errors.method}</span>}
          </div>

          {/* Payout Summary */}
          {payoutAmount && selectedMethod && (
            <div className="payout-summary">
              <h3>Payout Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Payout Amount</span>
                  <span>₹{parseFloat(payoutAmount || 0).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Processing Fee</span>
                  <span>₹0</span>
                </div>
                <div className="summary-row total">
                  <span>You'll Receive</span>
                  <span>₹{parseFloat(payoutAmount || 0).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="processing-info">
                <i className="fas fa-info-circle"></i>
                <span>
                  Your payout will be processed within{' '}
                  {payoutMethods.find(m => m.id === selectedMethod)?.processingTime.toLowerCase()}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !payoutAmount || parseFloat(payoutAmount) < 500}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Request Payout
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}