import React, { useState } from 'react';
import '@/styles/dashboard/owner/vehicles/addVehicleForm.css';
import { useAuth } from '@/context/AuthContext';

export default function AddVehicleForm({ onSubmit, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: 'car',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    batteryRange: '',
    acceleration: '',
    pricePerDay: '',
    location: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- FIX: Re-adding the missing variable definitions ---
  const vehicleOptions = [
    { value: 'car', label: 'Electric Car' },
    { value: 'bike', label: 'Electric Bike/Scooter' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const colors = [
    'White', 'Black', 'Silver', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Gray'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vehicle name is required';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!formData.pricePerDay || formData.pricePerDay <= 0) newErrors.pricePerDay = 'Valid price per day is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!imageFile) newErrors.image = 'Vehicle image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) {
        setErrors({ form: "You must be logged in to add a vehicle." });
        return;
    }

    setLoading(true);

    const vehicleData = new FormData();
    Object.keys(formData).forEach(key => {
        vehicleData.append(key, formData[key]);
    });
    vehicleData.append('image', imageFile);

    try {
        const token = localStorage.getItem('wattwheels_token');
        if (!token) {
            throw new Error("Authentication token not found. Please log out and log in again.");
        }

        const res = await fetch("http://127.0.0.1:5000/api/vehicles/", {
            method: "POST",
            body: vehicleData,
            headers: {
              'Authorization': `Bearer ${token}`
            }
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || `Request failed with status: ${res.status}`);
        }

        onSubmit(result); 
        onClose(); 

    } catch (error) {
        console.error('Error adding vehicle:', error);
        setErrors({ form: error.message });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-overlay">
      <div className="add-vehicle-modal">
        <div className="modal-header">
          <h2>Add New Vehicle</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-vehicle-form">
          {errors.form && <div className="error-text" style={{textAlign: 'center', marginBottom: '1rem'}}>{errors.form}</div>}
          <div className="form-sections">
            <div className="form-section">
              <h3>Vehicle Image</h3>
              <div className="form-group">
                <label>Upload a photo of your vehicle</label>
                <input type="file" name="image" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" className={errors.image ? 'error' : ''} />
                {errors.image && <span className="error-text">{errors.image}</span>}
              </div>
            </div>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="form-select">
                    {vehicleOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vehicle Name/Model</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Tesla Model 3, Ola S1 Pro" className={errors.name ? 'error' : ''} />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Year</label>
                  <select name="year" value={formData.year} onChange={handleInputChange} className="form-select">
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <select name="color" value={formData.color} onChange={handleInputChange} className={`form-select ${errors.color ? 'error' : ''}`}>
                    <option value="">Select Color</option>
                    {colors.map(color => <option key={color} value={color}>{color}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>License Plate Number</label>
                <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} placeholder="e.g. CH01EV1234" className={errors.licensePlate ? 'error' : ''} />
                {errors.licensePlate && <span className="error-text">{errors.licensePlate}</span>}
              </div>
            </div>
            <div className="form-section">
              <h3>Specifications</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Battery Range</label>
                  <input type="text" name="batteryRange" value={formData.batteryRange} onChange={handleInputChange} placeholder="e.g. 350km" />
                </div>
                <div className="form-group">
                  <label>Acceleration</label>
                  <input type="text" name="acceleration" value={formData.acceleration} onChange={handleInputChange} placeholder="e.g. 0-60 in 3.1s" />
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Pricing & Location</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Day (₹)</label>
                  <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleInputChange} placeholder="e.g. 2500" min="1" className={errors.pricePerDay ? 'error' : ''} />
                  {errors.pricePerDay && <span className="error-text">{errors.pricePerDay}</span>}
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Chandigarh" className={errors.location ? 'error' : ''} />
                  {errors.location && <span className="error-text">{errors.location}</span>}
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Additional Details</h3>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Add any additional details about your vehicle..." rows="4" className="form-textarea" />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Adding Vehicle...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Add Vehicle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}