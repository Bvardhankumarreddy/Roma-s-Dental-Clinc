import React, { useState, useEffect } from 'react';
import { authAPI } from '../../utils/api';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';
import BookingsManager from './BookingsManager';
import GalleryManager from './GalleryManager';
import BlogsManager from './BlogsManager';
import ServicesManager from './ServicesManager';
import HomeContentManager from './HomeContentManager';
import AboutContentManager from './AboutContentManager';
import StatsManager from './StatsManager';
import SocialLinksManager from './SocialLinksManager';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      setIsAuthenticated(true);
      setAdmin(authAPI.getAdmin());
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAdmin(authAPI.getAdmin());
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setAdmin(null);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'about', name: 'About', icon: 'ℹ️' },
    { id: 'stats', name: 'Statistics', icon: '📈' },
    { id: 'social', name: 'Social Links', icon: '🔗' },
    { id: 'bookings', name: 'Bookings', icon: '📅' },
    { id: 'gallery', name: 'Gallery', icon: '🖼️' },
    { id: 'blogs', name: 'Blogs', icon: '📝' },
    { id: 'services', name: 'Services', icon: '🦷' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Roma's Dental Care</h1>
              <p className="text-sm text-gray-600">Admin Panel</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">👋 {admin?.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'home' && <HomeContentManager />}
        {activeTab === 'about' && <AboutContentManager />}
        {activeTab === 'stats' && <StatsManager />}
        {activeTab === 'social' && <SocialLinksManager />}
        {activeTab === 'bookings' && <BookingsManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'blogs' && <BlogsManager />}
        {activeTab === 'services' && <ServicesManager />}
      </main>
    </div>
  );
};

export default AdminPanel;
