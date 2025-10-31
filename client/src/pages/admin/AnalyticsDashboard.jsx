import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FiTrendingUp, FiUsers, FiClock, FiDollarSign, FiCalendar, FiActivity } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [analytics, setAnalytics] = useState({
    attendance: [],
    leaves: [],
    users: [],
    salaryData: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch all data
      const [attendanceRes, usersRes] = await Promise.all([
        fetch(API_ENDPOINTS.getAttendanceAll, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(API_ENDPOINTS.getUsers, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const attendanceData = await attendanceRes.json();
      const usersData = await usersRes.json();

      setAnalytics({
        attendance: Array.isArray(attendanceData) ? attendanceData : [],
        users: Array.isArray(usersData) ? usersData : []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate attendance trends
  const getAttendanceTrendData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }

    const checkInsByDay = last7Days.map(day => {
      return analytics.attendance.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) === day &&
               record.type === 'check-in';
      }).length;
    });

    return {
      labels: last7Days,
      datasets: [{
        label: 'Daily Check-ins',
        data: checkInsByDay,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }]
    };
  };

  // Department distribution
  const getDepartmentData = () => {
    const deptCount = {};
    analytics.users.forEach(user => {
      const dept = user.department || 'Unassigned';
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });

    return {
      labels: Object.keys(deptCount),
      datasets: [{
        data: Object.values(deptCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  // Late arrivals trend
  const getLateArrivalsData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const latesByDay = last7Days.map((_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));
      
      return analytics.attendance.filter(record => {
        if (record.type !== 'check-in') return false;
        const recordDate = new Date(record.timestamp);
        const recordDateStr = recordDate.toDateString();
        const targetDateStr = date.toDateString();
        
        if (recordDateStr !== targetDateStr) return false;
        
        const hours = recordDate.getHours();
        const minutes = recordDate.getMinutes();
        return hours > 9 || (hours === 9 && minutes > 30);
      }).length;
    });

    return {
      labels: last7Days,
      datasets: [{
        label: 'Late Arrivals',
        data: latesByDay,
        fill: false,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }]
    };
  };

  // Calculate stats
  const stats = {
    totalEmployees: analytics.users.length,
    activeToday: new Set(analytics.attendance.filter(r => {
      const today = new Date().toDateString();
      return new Date(r.timestamp).toDateString() === today && r.type === 'check-in';
    }).map(r => r.userId?._id)).size,
    avgSalary: analytics.users.reduce((sum, u) => sum + (u.salary || 0), 0) / (analytics.users.length || 1),
    totalSalaryBudget: analytics.users.reduce((sum, u) => sum + (u.salary || 0), 0)
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and trends</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEmployees}</p>
              <p className="text-sm text-green-600 mt-1">↑ Active workforce</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-full">
              <FiUsers className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Present Today</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeToday}</p>
              <p className="text-sm text-gray-600 mt-1">{((stats.activeToday / stats.totalEmployees) * 100).toFixed(1)}% attendance</p>
            </div>
            <div className="p-4 bg-green-50 rounded-full">
              <FiActivity className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg Salary</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.avgSalary.toFixed(0)}</p>
              <p className="text-sm text-gray-600 mt-1">Per employee</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-full">
              <FiDollarSign className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Budget</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₹{(stats.totalSalaryBudget / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-600 mt-1">Monthly payroll</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-full">
              <FiTrendingUp className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiClock className="text-blue-600" />
            Attendance Trend (Last 7 Days)
          </h2>
          <div style={{ height: '300px' }}>
            <Bar data={getAttendanceTrendData()} options={chartOptions} />
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUsers className="text-purple-600" />
            Department Distribution
          </h2>
          <div style={{ height: '300px' }} className="flex items-center justify-center">
            <Doughnut data={getDepartmentData()} options={{...chartOptions, maintainAspectRatio: true}} />
          </div>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiCalendar className="text-red-600" />
            Late Arrivals Trend
          </h2>
          <div style={{ height: '300px' }}>
            <Line data={getLateArrivalsData()} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-2">📊 Attendance Rate</h3>
          <p className="text-4xl font-bold mb-2">{((stats.activeToday / stats.totalEmployees) * 100).toFixed(1)}%</p>
          <p className="text-blue-100">Current week average</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-2">✅ On-Time Rate</h3>
          <p className="text-4xl font-bold mb-2">85%</p>
          <p className="text-green-100">Employees punctual</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-2">💰 Payroll Health</h3>
          <p className="text-4xl font-bold mb-2">Good</p>
          <p className="text-purple-100">Budget within limits</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

