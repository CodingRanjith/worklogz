import React, { useState, useEffect } from 'react';
import { FiX, FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';

const SalaryHistoryModal = ({ userId, isOpen, onClose, isAdmin = false }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchSalaryHistory();
    }
  }, [isOpen, userId]);

  const fetchSalaryHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isAdmin 
        ? `${API_ENDPOINTS.baseURL}/api/daily-salary/salary-history/${userId}`
        : `${API_ENDPOINTS.baseURL}/api/daily-salary/salary-history/me`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching salary history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'Salary Increase':
        return <FiTrendingUp className="text-green-600" />;
      case 'Salary Decrease':
        return <FiTrendingDown className="text-red-600" />;
      case 'Initial Setup':
        return <FiDollarSign className="text-blue-600" />;
      default:
        return <FiDollarSign className="text-gray-600" />;
    }
  };

  const getChangeBadgeColor = (changeType) => {
    switch (changeType) {
      case 'Salary Increase':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Salary Decrease':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Initial Setup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <FiDollarSign className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Salary History</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <FiDollarSign className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No salary history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getChangeIcon(item.changeType)}
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getChangeBadgeColor(item.changeType)}`}>
                          {item.changeType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar size={14} />
                      {new Date(item.effectiveDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Previous Salary</p>
                      <p className="text-xl font-bold text-gray-700">
                        ₹{item.oldSalary.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">New Salary</p>
                      <p className="text-xl font-bold text-blue-900">
                        ₹{item.newSalary.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {item.oldSalary > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">Change:</span>
                      <span className={`text-sm font-semibold ${
                        item.newSalary > item.oldSalary ? 'text-green-600' : 
                        item.newSalary < item.oldSalary ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {item.newSalary > item.oldSalary ? '+' : ''}
                        ₹{Math.abs(item.newSalary - item.oldSalary).toLocaleString()}
                        {' '}
                        ({item.oldSalary > 0 ? 
                          `${((item.newSalary - item.oldSalary) / item.oldSalary * 100).toFixed(1)}%` : 
                          'N/A'
                        })
                      </span>
                    </div>
                  )}

                  {item.notes && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Note:</span> {item.notes}
                      </p>
                    </div>
                  )}

                  {isAdmin && item.changedBy && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                      <FiUser size={14} />
                      <span>Changed by: {item.changedBy.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryHistoryModal;

