import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddLocations.css';
import { FaTimes } from 'react-icons/fa';

function AddLocations() {
  const [locationData, setLocationData] = useState({
    title: '',
    description: '',
    Province: '',
    distric: '',
    city: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData({ ...locationData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];

    const newPreviews = [...previews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === newImages.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages(newImages);
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', locationData.title);
    formData.append('description', locationData.description);
    formData.append('Province', locationData.Province);
    formData.append('distric', locationData.distric);
    formData.append('city', locationData.city);
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    try {
      const response = await axios.post('/api/locations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Location added successfully!');
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location.');
    }
  };

  return (
    <div className="add-locations-container">
      <h2>Add New Location</h2>
      <form onSubmit={handleSubmit} className="add-location-form">
        <div className="add-location-form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={locationData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="add-location-form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={locationData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="add-location-form-group">
          <label htmlFor="Province">Province:</label>
          <input
            type="text"
            id="Province"
            name="Province"
            value={locationData.Province}
            onChange={handleChange}
            required
          />
        </div>
        <div className="add-location-form-group">
          <label htmlFor="distric">Distric:</label>
          <input
            type="text"
            id="distric"
            name="distric"
            value={locationData.distric}
            onChange={handleChange}
            required
          />
        </div>
        <div className="add-location-form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={locationData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="add-location-form-group">
          <label htmlFor="image">Images:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            multiple
            required
          />
          <div className="add-location-image-previews">
            {previews.map((preview, index) => (
              <div key={index} className="add-location-image-preview-container">
                <img src={preview} alt={`Preview ${index}`} className="add-location-image-preview" />
                <button
                  type="button"
                  className="add-location-remove-image-btn"
                  onClick={() => handleImageRemove(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="add-location-submit-btn">
          Add Location
        </button>
      </form>
    </div>
  );
}

export default AddLocations;
