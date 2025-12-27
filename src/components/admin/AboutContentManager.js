import React, { useState, useEffect } from 'react';
import { aboutContentAPI } from '../../utils/api';

const AboutContentManager = () => {
  const [content, setContent] = useState({
    subtitle: '',
    title: '',
    highlightedTitle: '',
    description: '',
    mainImage: '',
    heading: '',
    content: '',
    mission: '',
    vision: '',
    whoWeAre: '',
    technologies: '',
    features: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ],
    values: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ]
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
      const result = await aboutContentAPI.get();
      if (result.success && result.content) {
        // Merge with default state to ensure all fields exist
        setContent(prev => ({
          ...prev,
          ...result.content,
          // Ensure arrays are properly set
          features: result.content.features || prev.features,
          values: result.content.values || prev.values
        }));
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...content.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setContent(prev => ({ ...prev, features: newFeatures }));
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...content.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setContent(prev => ({ ...prev, values: newValues }));
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
      const result = await aboutContentAPI.update(content, imageFile);
      if (result.success) {
        setMessage({ type: 'success', text: 'About content updated successfully!' });
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
      console.error('Error saving about content:', error);
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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">About Section Content</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage the About Us section content</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Header</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle (e.g., "About Us")
              </label>
              <input
                type="text"
                name="subtitle"
                value={content.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (e.g., "Welcome to")
              </label>
              <input
                type="text"
                name="title"
                value={content.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlighted Title (e.g., "Roma's Dental Care")
              </label>
              <input
                type="text"
                name="highlightedTitle"
                value={content.highlightedTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={content.description}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
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
            {(imagePreview || content.mainImage) && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {imagePreview ? 'New Image Preview:' : 'Current Image:'}
                </p>
                <img 
                  src={imagePreview || content.mainImage} 
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

        {/* Content Heading */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Heading
          </label>
          <input
            type="text"
            name="heading"
            value={content.heading}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="e.g., Advanced, Gentle Treatments by 13+ Years Experienced Doctor"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Text
          </label>
          <textarea
            name="content"
            value={content.content}
            onChange={handleChange}
            rows="12"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter the about section content. Use line breaks to separate paragraphs."
          />
          <p className="text-sm text-gray-500 mt-2">
            Tip: Press Enter twice to create a new paragraph
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission & Vision</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                name="mission"
                value={content.mission}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter your mission statement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Statement
              </label>
              <textarea
                name="vision"
                value={content.vision}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter your vision statement"
              />
            </div>
          </div>
        </div>

        {/* Who We Are */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who We Are
          </label>
          <textarea
            name="whoWeAre"
            value={content.whoWeAre}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Brief description about your clinic"
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technologies & Equipment
          </label>
          <textarea
            name="technologies"
            value={content.technologies}
            onChange={handleChange}
            rows="8"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter each technology on a new line (e.g., Digital X-rays & RVG)"
          />
          <p className="text-sm text-gray-500 mt-2">
            Tip: Put each technology on a separate line
          </p>
        </div>

        {/* Features */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
          {content.features.map((feature, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-700 mb-3">Feature {index + 1}</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                  placeholder="Feature title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                  placeholder="Feature description"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Values</h3>
          {content.values.map((value, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-700 mb-3">Value {index + 1}</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={value.title}
                  onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                  placeholder="Value title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <textarea
                  value={value.description}
                  onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                  placeholder="Value description"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {uploading ? 'Uploading Image...' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutContentManager;
