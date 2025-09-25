import React, { useState } from 'react';
import '@/styles/dashboard/owner/vehicles/addVehicleForm.css';

export default function AddVehicleForm({ onSubmit, onClose }) {
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
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
<<<<<<< HEAD
    setFormData(prev => ({ ...prev, [name]: value }));
=======
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
<<<<<<< HEAD
=======

>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
    if (!formData.name.trim()) newErrors.name = 'Vehicle name is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!formData.batteryRange.trim()) newErrors.batteryRange = 'Battery range is required';
    if (!formData.acceleration.trim()) newErrors.acceleration = 'Acceleration info is required';
    if (!formData.pricePerDay || formData.pricePerDay <= 0) newErrors.pricePerDay = 'Valid price per day is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
<<<<<<< HEAD
=======

>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
    if (!validateForm()) {
        return;
    }

    setLoading(true);

    const vehicleData = {
=======
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Set default image based on type
      const payload = {
>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
        ...formData,
        ownerId: 'owner123',
        pricePerDay: parseInt(formData.pricePerDay),
<<<<<<< HEAD
        // IMPORTANT: In a real app, you would get this from your AuthContext
        owner_id: 1, // Using '1' for now, assuming the first user is the owner
        // Set a default image based on type
        image: formData.type === 'car' 
          ? '/images/ev-cars/tesla-model-3.svg' 
          : '/images/ev-cars/ola-s1.svg'
    };

    try {
        const res = await fetch("http://127.0.0.1:5000/api/vehicles/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicleData)
        });

        if (!res.ok) {
            throw new Error("Failed to add vehicle");
        }
        
        // This calls the function from the parent page to close the form
        // and update the list.
        onSubmit(vehicleData);

    } catch (error) {
        console.error('Error adding vehicle:', error);
        // You can add a user-facing error message here
=======
        image: formData.type === 'car'
          ? '/images/ev-cars/tesla-model-3.svg'
          : '/images/ev-cars/ola-s1.svg'
      };

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add vehicle');
      }

      const data = await response.json();
      onSubmit(data.vehicle); // update parent component
      onClose();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setErrors({ form: error.message });
>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
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
          {errors.form && <div className="error-text">{errors.form}</div>}

          <div className="form-sections">
<<<<<<< HEAD
            {/* Form sections remain the same */}
=======
            {/* Basic Information */}
>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Type</label>
<<<<<<< HEAD
                  <select name="type" value={formData.type} onChange={handleInputChange} className="form-select">
                    {vehicleOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
=======
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {vehicleOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
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
<<<<<<< HEAD
                  <select name="year" value={formData.year} onChange={handleInputChange} className="form-select">
                    {years.map(year => (<option key={year} value={year}>{year}</option>))}
=======
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <select name="color" value={formData.color} onChange={handleInputChange} className={`form-select ${errors.color ? 'error' : ''}`}>
                    <option value="">Select Color</option>
<<<<<<< HEAD
                    {colors.map(color => (<option key={color} value={color}>{color}</option>))}
=======
                    {colors.map(color => <option key={color} value={color}>{color}</option>)}
>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
                  </select>
                  {errors.color && <span className="error-text">{errors.color}</span>}
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
                  <input type="text" name="batteryRange" value={formData.batteryRange} onChange={handleInputChange} placeholder="e.g. 350km" className={errors.batteryRange ? 'error' : ''} />
                  {errors.batteryRange && <span className="error-text">{errors.batteryRange}</span>}
                </div>
                <div className="form-group">
                  <label>Acceleration</label>
                  <input type="text" name="acceleration" value={formData.acceleration} onChange={handleInputChange} placeholder="e.g. 0-60 in 3.1s" className={errors.acceleration ? 'error' : ''} />
                  {errors.acceleration && <span className="error-text">{errors.acceleration}</span>}
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
<<<<<<< HEAD
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (<><i className="fas fa-spinner fa-spin"></i> Adding Vehicle...</>) : (<><i className="fas fa-plus"></i> Add Vehicle</>)}
=======
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
>>>>>>> 982e32c50d61cdb97e69b2505c7efae7fce71725
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
