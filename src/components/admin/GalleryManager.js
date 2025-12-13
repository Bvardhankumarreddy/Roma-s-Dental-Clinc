import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../../utils/api';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'treatments'
  });
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: 'treatments'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const result = await galleryAPI.getAll();
      if (result.success) {
        setImages(result.images);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading gallery:', error);
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    setUploading(true);

    try {
      const result = await galleryAPI.upload(
        selectedFile,
        uploadData.title,
        uploadData.description,
        uploadData.category
      );
      
      if (result.success) {
        loadGallery();
        setShowUploadModal(false);
        setUploadData({ title: '', description: '', category: 'treatments' });
        setSelectedFile(null);
      } else {
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const result = await galleryAPI.delete(imageId);
        if (result.success) {
          loadGallery();
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setEditData({
      title: image.title,
      description: image.description || '',
      category: image.category
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const result = await galleryAPI.update(editingImage.imageId, editData);
      
      if (result.success) {
        loadGallery();
        setShowEditModal(false);
        setEditingImage(null);
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Update failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 font-medium"
        >
          + Upload Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.imageId} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{image.description}</p>
              <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">
                {image.category}
              </span>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openEditModal(image)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteImage(image.imageId)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Upload New Image</h3>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="treatments">Treatments</option>
                  <option value="clinic">Clinic</option>
                  <option value="team">Team</option>
                  <option value="patients">Patients</option>
                  <option value="chief-guests">Chief Guests</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Image Details</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Current Image</label>
                <img
                  src={editingImage.imageUrl}
                  alt={editingImage.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="treatments">Treatments</option>
                  <option value="clinic">Clinic</option>
                  <option value="team">Team</option>
                  <option value="patients">Patients</option>
                  <option value="chief-guests">Chief Guests</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
                >
                  {uploading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingImage(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
