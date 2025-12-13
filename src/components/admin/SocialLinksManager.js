import React, { useState, useEffect } from 'react';
import { socialLinksAPI } from '../../utils/api';

function SocialLinksManager() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    color: '#06b6d4',
    order: 0
  });

  const popularPlatforms = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877F2' },
    { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
    { name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
    { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0A66C2' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
    { name: 'Telegram', icon: 'fab fa-telegram-plane', color: '#0088cc' },
    { name: 'Pinterest', icon: 'fab fa-pinterest-p', color: '#E60023' }
  ];

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    setLoading(true);
    const result = await socialLinksAPI.getAll();
    if (result.success) {
      setSocialLinks(result.socialLinks);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlatformSelect = (platform) => {
    setFormData(prev => ({
      ...prev,
      name: platform.name,
      icon: platform.icon,
      color: platform.color
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = editingId 
      ? await socialLinksAPI.update(editingId, formData)
      : await socialLinksAPI.create(formData);

    setMessage(result.message);
    
    if (result.success) {
      fetchSocialLinks();
      resetForm();
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (link) => {
    setEditingId(link.linkId);
    setFormData({
      name: link.name,
      url: link.url,
      icon: link.icon,
      color: link.color,
      order: link.order
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;
    
    setLoading(true);
    const result = await socialLinksAPI.delete(linkId);
    setMessage(result.message);
    
    if (result.success) {
      fetchSocialLinks();
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      url: '',
      icon: '',
      color: '#06b6d4',
      order: 0
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Social Media Links</h2>
      
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('success') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingId ? 'Edit Social Link' : 'Add New Social Link'}
        </h3>

        {/* Quick Select Popular Platforms */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quick Select Popular Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {popularPlatforms.map((platform) => (
              <button
                key={platform.name}
                type="button"
                onClick={() => handlePlatformSelect(platform)}
                className="px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-cyan-500 transition-colors flex items-center gap-2"
              >
                <i className={platform.icon} style={{ color: platform.color }}></i>
                <span className="text-sm">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Platform Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Platform Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Facebook, Instagram"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile URL *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>

          {/* Icon Class */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icon Class (Font Awesome) *
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="fab fa-facebook-f"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Find icons at: <a href="https://fontawesome.com/icons" target="_blank" rel="noopener noreferrer" className="text-cyan-500">fontawesome.com/icons</a>
            </p>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Color *
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="#06b6d4"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex items-center gap-3">
              {formData.icon && (
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: formData.color }}
                >
                  <i className={`${formData.icon} text-white text-lg`}></i>
                </div>
              )}
              <span className="text-sm text-gray-600">{formData.name || 'Platform Name'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 font-semibold"
          >
            {loading ? 'Saving...' : editingId ? 'Update Social Link' : 'Add Social Link'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Existing Links List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Social Links</h3>
        
        {socialLinks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No social links added yet.</p>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div
                key={link.linkId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cyan-500 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: link.color }}
                  >
                    <i className={`${link.icon} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{link.name}</h4>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-500 hover:text-cyan-600 break-all"
                    >
                      {link.url}
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Order: {link.order} | Icon: {link.icon}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(link.linkId)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Social media links appear in the Contact section. Make sure to add Font Awesome CDN to your HTML if icons don't display properly.
        </p>
      </div>
    </div>
  );
}

export default SocialLinksManager;
