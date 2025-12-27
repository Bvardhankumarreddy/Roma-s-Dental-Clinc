import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../../utils/api';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'tooth',
    displayOrder: 1
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await servicesAPI.getAll();
      if (result.success) {
        setServices(result.services);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'tooth',
      displayOrder: services.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      displayOrder: service.displayOrder
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let result;
      if (editingService) {
        result = await servicesAPI.update(editingService.serviceId, formData);
      } else {
        result = await servicesAPI.create(formData);
      }
      
      if (result.success) {
        loadServices();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const result = await servicesAPI.delete(serviceId);
        if (result.success) {
          loadServices();
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const iconOptions = [
    'tooth', 'smile', 'dental', 'implant', 'braces', 'cleaning',
    'whitening', 'extraction', 'crown', 'root-canal'
  ];

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Services Management</h2>
        <button
          onClick={openCreateModal}
          className="bg-cyan-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-cyan-600 font-medium text-sm sm:text-base w-full sm:w-auto"
        >
          + Add Service
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No services found. Add your first service!
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.serviceId}>
                  <td className="px-6 py-4 text-sm text-gray-600">{service.displayOrder}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{service.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {service.description ? service.description.substring(0, 50) + '...' : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{service.icon}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(service.serviceId)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Service Name *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g., Root Canal Treatment"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  rows="3"
                  placeholder="Brief description of the service"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full border rounded-lg p-2"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                    className="w-full border rounded-lg p-2"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default ServicesManager;
