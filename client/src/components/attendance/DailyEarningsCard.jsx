import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const DailyEarningsCard = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getUserDailyEarnings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEarnings(data.data);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white animate-pulse">
        <div className="h-6 bg-green-400 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-green-400 rounded w-3/4"></div>
      </div>
    );
  }

  if (!earnings) return null;

  const lastCreditDate = earnings.lastDailyCreditDate 
    ? new Date(earnings.lastDailyCreditDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Not yet credited';

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FiDollarSign className="text-2xl" />
            <h3 className="text-lg font-semibold">Daily Earnings</h3>
          </div>
          <p className="text-green-100 text-sm">Accumulated Credits</p>
        </div>
        <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
          <FiTrendingUp className="text-2xl" />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-bold mb-1">
          ₹{(earnings.dailyEarnings || 0).toFixed(2)}
        </div>
        <div className="flex items-center gap-2 text-green-100 text-sm">
          <FiCalendar className="text-base" />
          <span>Last credit: {lastCreditDate}</span>
        </div>
      </div>

      <div className="bg-green-400 bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
        <p className="text-sm text-green-50">
          💡 These are bonus credits earned through daily attendance and performance
        </p>
      </div>
    </div>
  );
};

export default DailyEarningsCard;

