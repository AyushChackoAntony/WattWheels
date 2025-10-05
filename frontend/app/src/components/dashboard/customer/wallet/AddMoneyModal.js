import React, { useState } from 'react';
import '@/styles/dashboard/customer/wallet/addMoneyModal.css';

export default function AddMoneyModal({ onClose, onAddMoney }) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: 'fas fa-mobile-alt',
      description: 'Pay using any UPI app',
      fee: 0
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'fas fa-credit-card',
      description: 'Visa, Mastercard, Rupay',
      fee: 0
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: 'fas fa-university',
      description: 'Pay via internet banking',
      fee: 0
    },
    {
      id: 'wallet',
      name: 'Other Wallets',
      icon: 'fas fa-wallet',
      description: 'Paytm, PhonePe, Google Pay',
      fee: 0
    }
  ];

  const quickAmounts = [500, 1000, 2000, 5000];

  const validateForm = () => {
    const newErrors = {};
    const amountValue = parseFloat(amount);

    if (!amount || isNaN(amountValue)) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amountValue < 100) {
      newErrors.amount = 'Minimum amount is ₹100';
    } else if (amountValue > 50000) {
      newErrors.amount = 'Maximum amount is ₹50,000';
    }

    if (!selectedMethod) {
      newErrors.method = 'Please select a payment method';
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      onAddMoney(parseFloat(amount), selectedMethod);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setErrors({ ...errors, amount: '' });
  };

  return (
    <div className="add-money-overlay">
      <div className="add-money-modal">
        <div className="modal-header">
          <h2>Add Money to Wallet</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-money-form">
          {/* Amount Section */}
          <div className="form-section">
            <h3>Enter Amount</h3>
            
            <div className="amount-input-group">
              <div className="currency-symbol">₹</div>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors({ ...errors, amount: '' });
                }}
                className={errors.amount ? 'error' : ''}
                min="100"
                max="50000"
              />
            </div>
            {errors.amount && <span className="error-text">{errors.amount}</span>}

            {/* Quick Amount Buttons */}
            <div className="quick-amounts">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="quick-amount-btn"
                  onClick={() => handleQuickAmount(value)}
                >
                  ₹{value}
                </button>
              ))}
            </div>

            <p className="amount-note">
              <i className="fas fa-info-circle"></i>
              Minimum: ₹100 | Maximum: ₹50,000 per transaction
            </p>
          </div>

          {/* Payment Method */}
          <div className="form-section">
            <h3>Select Payment Method</h3>
            
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
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
                  </div>
                  <div className="selection-indicator">
                    <i className="fas fa-check-circle"></i>
                  </div>
                </div>
              ))}
            </div>
            {errors.method && <span className="error-text">{errors.method}</span>}
          </div>

          {/* Summary */}
          {amount && selectedMethod && (
            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Amount to Add</span>
                  <span>₹{parseFloat(amount || 0).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Convenience Fee</span>
                  <span>₹0</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{parseFloat(amount || 0).toLocaleString()}</span>
                </div>
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
              disabled={loading || !amount || parseFloat(amount) < 100}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  Proceed to Pay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}