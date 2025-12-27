import React, { useState, useEffect } from 'react';
import { statsAPI } from '../../utils/api';

function StatsManager() {
  const [stats, setStats] = useState({
    happyPatients: 1000,
    specialists: 10
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const result = await statsAPI.get();
    if (result.success) {
      setStats(result.stats);
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setStats(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleIncrement = (field) => {
    setStats(prev => ({
      ...prev,
      [field]: prev[field] + 1
    }));
  };

  const handleDecrement = (field) => {
    setStats(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] - 1)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await statsAPI.update(stats);
    setMessage(result.message);
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Manage Statistics</h2>
      
      {message && (
        <div className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base ${
          message.includes('success') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Happy Patients */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Happy Patients Count
            </label>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleDecrement('happyPatients')}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold text-lg sm:text-xl"
              >
                -
              </button>
              <input
                type="number"
                value={stats.happyPatients}
                onChange={(e) => handleChange('happyPatients', e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl sm:text-2xl font-bold"
                required
                min="0"
              />
              <button
                type="button"
                onClick={() => handleIncrement('happyPatients')}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold text-lg sm:text-xl"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This will display as "{stats.happyPatients.toLocaleString()}+ Happy Patients" on the website
            </p>
          </div>

          {/* Specialists */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialists & Superspecialists Count
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleDecrement('specialists')}
                className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold text-xl"
              >
                -
              </button>
              <input
                type="number"
                value={stats.specialists}
                onChange={(e) => handleChange('specialists', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-bold"
                required
                min="0"
              />
              <button
                type="button"
                onClick={() => handleIncrement('specialists')}
                className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold text-xl"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This will display as "{stats.specialists}+ Specialists & Superspecialists" on the website
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 font-semibold"
          >
            {loading ? 'Saving...' : 'Save Statistics'}
          </button>
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 font-semibold"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> These statistics appear in the "Why Choose Us" section on the homepage. 
          Update these values as your clinic grows to keep the website information current.
        </p>
      </div>
    </div>
  );
}

export default StatsManager;
