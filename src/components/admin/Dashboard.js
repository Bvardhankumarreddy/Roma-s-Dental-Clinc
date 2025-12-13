import React, { useState, useEffect } from 'react';
import { bookingsAPI, blogsAPI, galleryAPI, servicesAPI } from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalBlogs: 0,
    totalImages: 0,
    totalServices: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsRes, blogsRes, galleryRes, servicesRes] = await Promise.all([
        bookingsAPI.getAll(),
        blogsAPI.getAll(),
        galleryAPI.getAll(),
        servicesAPI.getAll()
      ]);

      if (bookingsRes.success) {
        const pending = bookingsRes.bookings.filter(b => b.status === 'pending').length;
        setStats(prev => ({
          ...prev,
          totalBookings: bookingsRes.count,
          pendingBookings: pending
        }));
        setRecentBookings(bookingsRes.bookings.slice(0, 5));
      }

      if (blogsRes.success) {
        setStats(prev => ({ ...prev, totalBlogs: blogsRes.count }));
      }

      if (galleryRes.success) {
        setStats(prev => ({ ...prev, totalImages: galleryRes.count }));
      }

      if (servicesRes.success) {
        setStats(prev => ({ ...prev, totalServices: servicesRes.count }));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📅', color: 'bg-blue-500' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: '⏰', color: 'bg-yellow-500' },
    { label: 'Total Blogs', value: stats.totalBlogs, icon: '📝', color: 'bg-green-500' },
    { label: 'Gallery Images', value: stats.totalImages, icon: '🖼️', color: 'bg-purple-500' },
    { label: 'Services', value: stats.totalServices, icon: '🦷', color: 'bg-cyan-500' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td className="px-6 py-4 text-sm text-gray-800">{booking.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.mobile}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(booking.date)} {booking.time}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
