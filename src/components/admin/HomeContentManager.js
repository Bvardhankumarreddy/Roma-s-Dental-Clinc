import React, { useState, useEffect } from 'react';
import { homeContentAPI } from '../../utils/api';

const HomeContentManager = () => {
  const [content, setContent] = useState({
    tagline: '',
    heading: '',
    highlightedText: '',
    description: '',
    heroImage: '',
    openingHours: {
      days: '',
      time: '',
      closedDay: ''
    },
    phoneNumber: '',
    whatsappNumber: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const result = await homeContentAPI.get();
      if (result.success && result.content) {
        setContent(result.content);
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('openingHours.')) {
      const field = name.split('.')[1];
      setContent(prev => ({
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [field]: value
        }
      }));
    } else {
      setContent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setUploading(!!imageFile);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await homeContentAPI.update(content, imageFile);
      if (result.success) {
        setMessage({ type: 'success', text: 'Home content updated successfully!' });
        setImageFile(null);
        setImagePreview('');
        // Update content with new image URL
        if (result.content) {
          setContent(result.content);
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update content' });
      }
    } catch (error) {
      console.error('Error saving home content:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    }
    
    setSaving(false);
    setUploading(false);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Home Section Content</h2>
        <p className="text-gray-600">Manage the hero section content and images</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline (e.g., "Your Smile, Our Priority")
          </label>
          <input
            type="text"
            name="tagline"
            value={content.tagline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter tagline"
          />
        </div>

        {/* Heading */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Heading (e.g., "Experience")
          </label>
          <input
            type="text"
            name="heading"
            value={content.heading}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter main heading"
          />
        </div>

        {/* Highlighted Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highlighted Text (e.g., "World-Class Dental Care")
          </label>
          <input
            type="text"
            name="highlightedText"
            value={content.highlightedText}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter highlighted text"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={content.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter description"
          />
        </div>

        {/* Hero Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500">
              Upload a new image (JPG, PNG, WebP - Max 5MB) or keep the current image
            </p>
            
            {/* Preview */}
            {(imagePreview || content.heroImage) && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {imagePreview ? 'New Image Preview:' : 'Current Image:'}
                </p>
                <img 
                  src={imagePreview || content.heroImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                  }}
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove new image
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Opening Hours */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Opening Hours</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Open Days (e.g., "6 Days")
              </label>
              <input
                type="text"
                name="openingHours.days"
                value={content.openingHours.days}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (e.g., "10 AM - 8 PM")
              </label>
              <input
                type="text"
                name="openingHours.time"
                value={content.openingHours.time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closed Day (e.g., "Tuesday")
              </label>
              <input
                type="text"
                name="openingHours.closedDay"
                value={content.openingHours.closedDay}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (e.g., "+917499537267")
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={content.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
             uploading ? 'Uploading Image...' :    WhatsApp Number (e.g., "917499537267")
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                value={content.whatsappNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeContentManager;
