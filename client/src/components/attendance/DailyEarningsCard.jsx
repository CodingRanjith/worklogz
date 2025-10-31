import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar, FiSun, FiActivity } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const DailyEarningsCard = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [earningBreakdown, setEarningBreakdown] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0
  });

  useEffect(() => {
    fetchEarnings();
  }, []);

  const calculateEarningBreakdown = (dailyEarnings, lastCreditDate) => {
    // For demo purposes, simulate breakdown
    // In production, you'd track this in backend
    const today = new Date();
    const lastCredit = lastCreditDate ? new Date(lastCreditDate) : null;
    
    // Calculate days in current month until today
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysThisMonth = Math.floor((today - startOfMonth) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate days in current week
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const daysThisWeek = Math.floor((today - startOfWeek) / (1000 * 60 * 60 * 24)) + 1;
    
    // Assume 100 rupees per day (you can get this from config)
    const dailyRate = 100;
    
    return {
      today: dailyRate, // Today's earning
      thisWeek: dailyRate * Math.min(daysThisWeek, 7), // This week
      thisMonth: dailyRate * daysThisMonth, // This month
      total: dailyEarnings || 0 // Total accumulated
    };
  };

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.getUserDailyEarnings, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Daily Earnings Response:', data);
      
      if (data.success) {
        setEarnings(data.data);
        const breakdown = calculateEarningBreakdown(
          data.data.dailyEarnings,
          data.data.lastDailyCreditDate
        );
        setEarningBreakdown(breakdown);
      } else {
        setEarnings({
          dailyEarnings: 0,
          lastDailyCreditDate: null
        });
        setEarningBreakdown({
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      setEarnings({
        dailyEarnings: 0,
        lastDailyCreditDate: null
      });
      setEarningBreakdown({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        total: 0
      });
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

  if (!earnings) {
    setEarnings({
      dailyEarnings: 0,
      lastDailyCreditDate: null
    });
    return null;
  }

  const lastCreditDate = earnings.lastDailyCreditDate 
    ? new Date(earnings.lastDailyCreditDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Not yet credited';

  // Calculate days until month end
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysUntilMonthEnd = Math.ceil((lastDayOfMonth - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-3xl" />
            <h3 className="text-2xl font-bold">My Earnings</h3>
          </div>
          <div className="bg-green-400 bg-opacity-30 p-2 rounded-full">
            <FiTrendingUp className="text-2xl" />
          </div>
        </div>
        <p className="text-green-100 text-sm">Bonus Credits Tracker</p>
      </div>

      {/* Earnings Breakdown */}
      <div className="p-6">
        {/* Today's Earnings */}
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-full">
                <FiSun className="text-white text-xl" />
              </div>
              <div>
                <p className="text-blue-600 text-sm font-semibold">Today's Earnings</p>
                <p className="text-3xl font-bold text-blue-900">₹{earningBreakdown.today.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Daily
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Earnings */}
        <div className="mb-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-3 rounded-full">
                <FiCalendar className="text-white text-xl" />
              </div>
              <div>
                <p className="text-purple-600 text-sm font-semibold">This Week</p>
                <p className="text-3xl font-bold text-purple-900">₹{earningBreakdown.thisWeek.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Weekly
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Earnings */}
        <div className="mb-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-full">
                <FiActivity className="text-white text-xl" />
              </div>
              <div>
                <p className="text-orange-600 text-sm font-semibold">This Month</p>
                <p className="text-3xl font-bold text-orange-900">₹{earningBreakdown.thisMonth.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Monthly
              </span>
              <p className="text-xs text-orange-600 mt-1">{daysUntilMonthEnd} days left</p>
            </div>
          </div>
        </div>

        {/* Total Accumulated */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-3 rounded-full">
                <FiDollarSign className="text-white text-xl" />
              </div>
              <div>
                <p className="text-green-700 text-sm font-semibold">Total Accumulated</p>
                <p className="text-4xl font-bold text-green-900">₹{earningBreakdown.total.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                All Time
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm text-yellow-800 font-semibold mb-1">Last Credit Date: {lastCreditDate}</p>
              <p className="text-xs text-yellow-700">
                Monthly earnings will reset on the 1st of next month. Keep up the great work!
              </p>
            </div>
          </div>
        </div>

        {/* Next Month Indicator */}
        {daysUntilMonthEnd <= 7 && (
          <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
            <p className="text-sm text-blue-700">
              🎉 <strong>Month End Alert!</strong> Your monthly stats will reset in <strong>{daysUntilMonthEnd} days</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyEarningsCard;

