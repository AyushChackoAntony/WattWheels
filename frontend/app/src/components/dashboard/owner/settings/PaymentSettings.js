import React, { useState } from 'react';
import '@/styles/dashboard/owner/settings/paymentSettings.css';

export default function PaymentSettings({ data, onChange }) {
  const [paymentData, setPaymentData] = useState(data);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolder: '',
    bankName: ''
  });

  const handlePaymentUpdate = (field, value) => {
    const newData = { ...paymentData, [field]: value };
    setPaymentData(newData);
    onChange(newData);
  };

  const handleBankFormChange = (e) => {
    setBankForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const saveBankDetails = () => {
    if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }
    
    handlePaymentUpdate('bankDetails', {
      accountNumber: `****${bankForm.accountNumber.slice(-4)}`,
      ifscCode: bankForm.ifscCode,
      accountHolder: bankForm.accountHolder,
      bankName: bankForm.bankName
    });
    
    setShowBankModal(false);
    setBankForm({
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountHolder: '',
      bankName: ''
    });
  };

  const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: 'fas fa-university', desc: 'Direct bank account transfer' },
    { id: 'upi', name: 'UPI', icon: 'fas fa-mobile-alt', desc: 'Instant UPI payments' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'fas fa-wallet', desc: 'PayTM, PhonePe, etc.' }
  ];

  const payoutFrequencies = [
    { value: 'instant', label: 'Instant (₹10 fee)' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const paymentHistory = [
    {
      id: 1,
      type: 'payout',
      amount: 15000,
      status: 'completed',
      date: '2025-01-08',
      method: 'Bank Transfer'
    },
    {
      id: 2,
      type: 'earning',
      amount: 2500,
      status: 'pending',
      date: '2025-01-10',
      method: 'Booking Payment'
    },
    {
      id: 3,
      type: 'fee',
      amount: 125,
      status: 'completed',
      date: '2025-01-05',
      method: 'Platform Fee'
    }
  ];

  return (
    <div className="payment-settings-container">
      <div className="settings-section">
        <div className="section-header">
          <h2>Payment Settings</h2>
          <p>Manage your payment methods and payout preferences</p>
        </div>

        {/* Payment Methods */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Default Payment Method</h3>
            <p>Choose your preferred method for receiving payouts</p>
          </div>
          
          <div className="card-content">
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className={`payment-method ${paymentData.defaultPaymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentUpdate('defaultPaymentMethod', method.id)}
                >
                  <div className="method-icon">
                    <i className={method.icon}></i>
                  </div>
                  <div className="method-info">
                    <h4>{method.name}</h4>
                    <p>{method.desc}</p>
                  </div>
                  <div className="method-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={paymentData.defaultPaymentMethod === method.id}
                      onChange={() => handlePaymentUpdate('defaultPaymentMethod', method.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Bank Account Details</h3>
            <button 
              className="update-bank-btn"
              onClick={() => setShowBankModal(true)}
            >
              <i className="fas fa-edit"></i>
              Update Details
            </button>
          </div>
          
          <div className="card-content">
            <div className="bank-details">
              <div className="bank-info-grid">
                <div className="bank-info-item">
                  <label>Account Holder</label>
                  <span>{paymentData.bankDetails.accountHolder}</span>
                </div>
                <div className="bank-info-item">
                  <label>Account Number</label>
                  <span>{paymentData.bankDetails.accountNumber}</span>
                </div>
                <div className="bank-info-item">
                  <label>IFSC Code</label>
                  <span>{paymentData.bankDetails.ifscCode}</span>
                </div>
                <div className="bank-info-item">
                  <label>Bank Name</label>
                  <span>{paymentData.bankDetails.bankName}</span>
                </div>
              </div>
              
              <div className="bank-status">
                <span className="verified-status">
                  <i className="fas fa-check-circle"></i>
                  Bank account verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Payout Preferences</h3>
            <p>Configure automatic payouts and thresholds</p>
          </div>
          
          <div className="card-content">
            <div className="payout-settings">
              <div className="payout-setting">
                <div className="setting-info">
                  <h4>Automatic Payouts</h4>
                  <p>Automatically transfer earnings to your account</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={paymentData.autoPayouts}
                    onChange={(e) => handlePaymentUpdate('autoPayouts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="payout-setting">
                <div className="setting-info">
                  <h4>Payout Threshold</h4>
                  <p>Minimum amount before automatic payout</p>
                </div>
                <div className="threshold-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    value={paymentData.payoutThreshold}
                    onChange={(e) => handlePaymentUpdate('payoutThreshold', parseInt(e.target.value))}
                    min="500"
                    step="500"
                  />
                </div>
              </div>

              <div className="payout-setting">
                <div className="setting-info">
                  <h4>Payout Frequency</h4>
                  <p>How often to process automatic payouts</p>
                </div>
                <select
                  value={paymentData.payoutFrequency}
                  onChange={(e) => handlePaymentUpdate('payoutFrequency', e.target.value)}
                  className="frequency-select"
                >
                  {payoutFrequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Tax Information</h3>
            <button 
              className="update-tax-btn"
              onClick={() => setShowTaxModal(true)}
            >
              <i className="fas fa-edit"></i>
              Update Tax Info
            </button>
          </div>
          
          <div className="card-content">
            <div className="tax-info">
              <div className="tax-info-grid">
                <div className="tax-info-item">
                  <label>PAN Number</label>
                  <span>{paymentData.taxId}</span>
                  <span className="verified-badge">
                    <i className="fas fa-check-circle"></i>
                    Verified
                  </span>
                </div>
                <div className="tax-info-item">
                  <label>GST Number</label>
                  <span>{paymentData.gstNumber || 'Not provided'}</span>
                  {paymentData.gstNumber && (
                    <span className="verified-badge">
                      <i className="fas fa-check-circle"></i>
                      Verified
                    </span>
                  )}
                </div>
              </div>
              
              <div className="tax-notice">
                <i className="fas fa-info-circle"></i>
                <p>Tax documents will be generated automatically for your earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button className="view-all-transactions-btn">
              View All Transactions
            </button>
          </div>
          
          <div className="card-content">
            <div className="transactions-list">
              {paymentHistory.map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className={`transaction-icon ${transaction.type}`}>
                    <i className={`fas fa-${
                      transaction.type === 'payout' ? 'arrow-down' : 
                      transaction.type === 'earning' ? 'arrow-up' : 'percentage'
                    }`}></i>
                  </div>
                  <div className="transaction-details">
                    <h4>{transaction.method}</h4>
                    <p>{new Date(transaction.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type === 'payout' || transaction.type === 'fee' ? 'negative' : 'positive'}`}>
                      {transaction.type === 'payout' || transaction.type === 'fee' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                    </span>
                    <span className={`status ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Analytics */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Payment Analytics</h3>
            <p>Overview of your payment performance</p>
          </div>
          
          <div className="card-content">
            <div className="analytics-grid">
              <div className="analytics-item">
                <div className="analytics-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="analytics-info">
                  <h4>₹45,800</h4>
                  <p>Total Earnings</p>
                </div>
              </div>
              <div className="analytics-item">
                <div className="analytics-icon">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <div className="analytics-info">
                  <h4>₹38,200</h4>
                  <p>Total Payouts</p>
                </div>
              </div>
              <div className="analytics-item">
                <div className="analytics-icon">
                  <i className="fas fa-percentage"></i>
                </div>
                <div className="analytics-info">
                  <h4>₹6,870</h4>
                  <p>Platform Fees</p>
                </div>
              </div>
              <div className="analytics-item">
                <div className="analytics-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="analytics-info">
                  <h4>2.5 days</h4>
                  <p>Avg Payout Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details Modal */}
      {showBankModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h3>Update Bank Details</h3>
              <button onClick={() => setShowBankModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={bankForm.accountHolder}
                  onChange={handleBankFormChange}
                  placeholder="Enter account holder name"
                />
              </div>
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={bankForm.bankName}
                  onChange={handleBankFormChange}
                  placeholder="Enter bank name"
                />
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankForm.accountNumber}
                  onChange={handleBankFormChange}
                  placeholder="Enter account number"
                />
              </div>
              <div className="form-group">
                <label>Confirm Account Number</label>
                <input
                  type="text"
                  name="confirmAccountNumber"
                  value={bankForm.confirmAccountNumber}
                  onChange={handleBankFormChange}
                  placeholder="Re-enter account number"
                />
              </div>
              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={bankForm.ifscCode}
                  onChange={handleBankFormChange}
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowBankModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-submit"
                onClick={saveBankDetails}
              >
                Update Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Information Modal */}
      {showTaxModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h3>Update Tax Information</h3>
              <button onClick={() => setShowTaxModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  defaultValue={paymentData.taxId}
                  placeholder="Enter PAN number"
                />
              </div>
              <div className="form-group">
                <label>GST Number (Optional)</label>
                <input
                  type="text"
                  defaultValue={paymentData.gstNumber}
                  placeholder="Enter GST number"
                />
              </div>
              <div className="tax-notice">
                <i className="fas fa-info-circle"></i>
                <p>These details are required for tax compliance and will be used for generating tax documents.</p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowTaxModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-submit"
                onClick={() => setShowTaxModal(false)}
              >
                Update Tax Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}