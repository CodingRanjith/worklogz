import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/api';
import { FiDollarSign, FiClock, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

const MyEarnings = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEarnings();
    fetchCreditHistory();
  }, []);

  const fetchMyEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyEarnings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setEarnings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      Swal.fire('Error', 'Failed to load earnings data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyCreditHistory, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCreditHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching credit history:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/attendance')}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <FiArrowLeft className="text-xl" />
          Back to Attendance
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Earnings</h1>
        <p className="text-gray-600">Track your salary credits and earnings history</p>
      </div>

      {/* Total Earnings Card - Light Theme */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl p-8 mb-6 border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-4 rounded-xl shadow-lg">
              <FiDollarSign className="text-4xl text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-semibold mb-1">Total Earnings</p>
              <p className="text-6xl font-bold text-green-900">₹{(earnings?.dailyEarnings || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-green-500 px-5 py-2 rounded-full shadow-md">
            <span className="text-sm font-bold text-white">All Time</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-green-300">
          <p className="text-sm text-green-800 font-medium">
            💰 This is your total accumulated earnings credited by admin
          </p>
        </div>
      </div>

      {/* Credit History - Light Theme */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-100">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FiClock className="text-3xl" />
            Credit History
          </h2>
          <p className="text-blue-100 text-sm mt-1">View all your earnings transactions</p>
        </div>

        <div className="p-6 bg-gray-50">
          {creditHistory.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <FiDollarSign className="mx-auto text-7xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-medium">No credit history yet</p>
              <p className="text-gray-400 text-sm mt-2">Your earnings will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {creditHistory.map((credit, index) => (
                <div
                  key={credit._id}
                  className="bg-white border-2 border-green-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:border-green-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-md">
                        <FiDollarSign className="text-white text-2xl" />
                      </div>
                      <div>
                        <p className="font-bold text-2xl text-green-600">
                          +₹{credit.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          {(credit.configsApplied && credit.configsApplied[0]?.configName) || 'Manual Credit'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                      <p className="text-base font-bold text-blue-900">
                        {new Date(credit.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-blue-600 font-medium mt-1 flex items-center gap-1">
                        <FiClock className="text-xs" />
                        {new Date(credit.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                  {credit.configsApplied && credit.configsApplied[0]?.description && (
                    <div className="mt-3 ml-14">
                      <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg border-l-4 border-blue-400 font-medium">
                        📝 {credit.configsApplied[0].description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;

