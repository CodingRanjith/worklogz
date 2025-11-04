import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
import axios from 'axios';

const DailyEarningsCard = () => {
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyEarnings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTotalEarnings(response.data.data.dailyEarnings || 0);
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
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-200 p-8 animate-pulse">
        <div className="h-16 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden p-6 md:p-8">
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2">Total Earnings</h3>
        <p className="text-5xl md:text-6xl font-black text-green-900 mb-2">
          ₹{totalEarnings.toLocaleString('en-IN')}
        </p>
        <p className="text-sm md:text-base text-green-700 font-medium">Admin Credited Amount</p>
      </div>
    </div>
  );
};

export default DailyEarningsCard;

