import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiArrowRight, FiClock } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';
import axios from 'axios';

const DailyEarningsCard = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [lastCreditDate, setLastCreditDate] = useState('Not yet credited');

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyEarnings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Daily Earnings Response:', response.data);
      
      if (response.data.success) {
        setEarnings(response.data.data);
        setTotalEarnings(response.data.data.dailyEarnings || 0);
        
        if (response.data.data.lastDailyCreditDate) {
          setLastCreditDate(
            new Date(response.data.data.lastDailyCreditDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          );
        }
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setTotalEarnings(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 px-6 py-5 border-b-2 border-green-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-3 rounded-xl shadow-md">
              <FiDollarSign className="text-3xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900">My Earnings</h3>
              <p className="text-green-700 text-sm font-medium">Admin Credited Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Display */}
      <div className="p-6 bg-white">
        {/* Total Earnings - Big Display */}
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300 mb-5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 text-base font-bold mb-2 flex items-center gap-2">
                <span>💰</span>
                <span>Total Earnings</span>
              </p>
              <p className="text-6xl font-black text-green-900">₹{totalEarnings.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl shadow-lg">
              <FiDollarSign className="text-white text-4xl" />
            </div>
          </div>
        </div>

        {/* Last Credit Info */}
        <div className="bg-blue-50 border-2 border-blue-300 p-5 rounded-xl mb-5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FiClock className="text-white text-2xl" />
            </div>
            <div>
              <p className="text-base text-blue-900 font-bold">Last Credit Date</p>
              <p className="text-sm text-blue-700 font-semibold mt-1">{lastCreditDate}</p>
            </div>
          </div>
        </div>

        {/* View Full Details Button */}
        <button
          onClick={() => navigate('/my-earnings')}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <span className="text-lg">View Full Earnings & History</span>
          <FiArrowRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default DailyEarningsCard;

