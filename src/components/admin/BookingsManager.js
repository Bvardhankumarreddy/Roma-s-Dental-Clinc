import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../utils/api';

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const result = await bookingsAPI.getAll();
      if (result.success) {
        setBookings(result.bookings);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      const result = await bookingsAPI.updateStatus(bookingId, newStatus);
      if (result.success) {
        loadBookings();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const result = await bookingsAPI.delete(bookingId);
        if (result.success) {
          loadBookings();
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Bookings Management</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-cyan-500 text-white' : 'bg-gray-200'}`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td className="px-6 py-4 text-sm font-bold text-cyan-600">#{booking.bookingNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{booking.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.mobile}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="text-xs">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.bookingId, e.target.value)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border-0 ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteBooking(booking.bookingId)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>        </div>      </div>
    </div>
  );
};

export default BookingsManager;
