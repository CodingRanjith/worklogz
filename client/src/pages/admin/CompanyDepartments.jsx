import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  FiTarget, FiTrendingUp, FiMonitor, FiCode, FiCheckCircle,
  FiDollarSign, FiPenTool, FiUsers, FiBookOpen, FiPlus, FiBarChart2, FiActivity
} from 'react-icons/fi';
import DepartmentAnalytics from '../../components/admin-dashboard/analytics/DepartmentAnalytics';
import LoadingSkeleton from '../../components/admin-dashboard/common/LoadingSkeleton';

const DEPARTMENTS = [
  {
    name: 'Administration',
    icon: <FiUsers className="text-3xl" />,
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    progressColor: 'bg-gray-500',
    description: 'Manages overall company operations, office management, and coordination between departments.'
  },
  {
    name: 'Human Resources (HR)',
    icon: <FiUsers className="text-3xl" />,
    color: 'from-slate-400 to-slate-500',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    progressColor: 'bg-slate-500',
    description: 'Handles recruitment, employee relations, payroll, training, and performance management.'
  },
  {
    name: 'Finance & Accounting',
    icon: <FiDollarSign className="text-3xl" />,
    color: 'from-teal-400 to-teal-500',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    progressColor: 'bg-teal-500',
    description: 'Manages budgets, expenses, financial planning, billing, and reporting.'
  },
  {
    name: 'Sales',
    icon: <FiTrendingUp className="text-3xl" />,
    color: 'from-emerald-400 to-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    progressColor: 'bg-emerald-500',
    description: 'Focuses on generating revenue by selling the company’s products or services.'
  },
  {
    name: 'Marketing',
    icon: <FiTarget className="text-3xl" />,
    color: 'from-rose-400 to-rose-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-200',
    progressColor: 'bg-rose-500',
    description: 'Promotes the brand, manages advertising, digital marketing, PR, and lead generation.'
  },
  {
    name: 'Customer Support / Service',
    icon: <FiUsers className="text-3xl" />,
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    progressColor: 'bg-blue-500',
    description: 'Handles client queries, technical support, and after-sales assistance.'
  },
  {
    name: 'Operations / Project Management',
    icon: <FiActivity className="text-3xl" />,
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    progressColor: 'bg-orange-500',
    description: 'Ensures smooth workflow, process optimization, and timely project delivery.'
  },
  {
    name: 'Legal & Compliance',
    icon: <FiBookOpen className="text-3xl" />,
    color: 'from-red-400 to-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    progressColor: 'bg-red-500',
    description: 'Manages contracts, legal issues, government regulations, and company policies.'
  },
  {
    name: 'Procurement / Purchasing',
    icon: <FiDollarSign className="text-3xl" />,
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    progressColor: 'bg-yellow-500',
    description: 'Responsible for sourcing materials, equipment, or third-party services.'
  },
  {
    name: 'Research & Development (R&D)',
    icon: <FiCode className="text-3xl" />,
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    progressColor: 'bg-purple-500',
    description: 'Innovates and develops new products, technologies, or solutions.'
  },
  {
    name: 'Information Technology (IT)',
    icon: <FiMonitor className="text-3xl" />,
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    progressColor: 'bg-blue-500',
    description: 'Maintains internal systems, networks, cybersecurity, and tech infrastructure.'
  },
  {
    name: 'Quality Assurance (QA)',
    icon: <FiCheckCircle className="text-3xl" />,
    color: 'from-amber-400 to-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    progressColor: 'bg-amber-500',
    description: 'Ensures products, services, or processes meet company and industry standards.'
  },
  {
    name: 'Business Development',
    icon: <FiTrendingUp className="text-3xl" />,
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    progressColor: 'bg-green-500',
    description: 'Builds partnerships, explores new markets, and drives company growth.'
  },
  {
    name: 'Public Relations (PR)',
    icon: <FiBarChart2 className="text-3xl" />,
    color: 'from-indigo-400 to-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    progressColor: 'bg-indigo-500',
    description: 'Manages brand image, media communications, and public perception.'
  },
  {
    name: 'Training & Development',
    icon: <FiBookOpen className="text-3xl" />,
    color: 'from-pink-400 to-pink-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    progressColor: 'bg-pink-500',
    description: 'Upskills employees, conducts workshops, and improves organizational capability.'
  }
];

const CompanyDepartments = () => {
  const [departmentStats, setDepartmentStats] = useState({});
  const [departmentStatsArray, setDepartmentStatsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDepartmentStats();
    
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const fetchDepartmentStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/work-cards/stats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const statsObj = {};
      const data = response.data || [];
      data.forEach(stat => {
        if (stat && stat._id) {
          statsObj[stat._id] = stat;
        }
      });
      setDepartmentStats(statsObj);
      setDepartmentStatsArray(data);
    } catch (error) {
      console.error('Error fetching department stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (departmentName) => {
    navigate(`/company-departments/${departmentName.toLowerCase()}`);
  };

  const handleCreateWorkCard = () => {
    navigate('/company-departments/create');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="w-64 h-7 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-40 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Department Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                    <div>
                      <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-8 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                <div className="w-12 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Company Departments</h1>
            <p className="text-gray-600 mt-1">Manage and track work across different departments</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                showAnalytics 
                  ? 'bg-gray-100 text-gray-700 border border-gray-300' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
              }`}
            >
              <FiBarChart2 className="text-lg" />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
            <button
              onClick={handleCreateWorkCard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiPlus className="text-lg" />
              Create Work Card
            </button>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEPARTMENTS.map((dept) => {
          const stats = departmentStats[dept.name] || {
            total: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
            avgProgress: 0
          };

          return (
            <div
              key={dept.name}
              onClick={() => handleDepartmentClick(dept.name)}
              className="cursor-pointer h-full"
            >
              <div 
                className={`bg-white border ${dept.borderColor} rounded-lg hover:shadow-sm transition-all duration-200 overflow-hidden h-full flex flex-col`}
                style={{ height: '320px' }}
              >
                {/* Header */}
                <div className={`${dept.bgColor} border-b ${dept.borderColor} p-4 flex-shrink-0`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`${dept.textColor} flex-shrink-0`}>
                        {dept.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{dept.name}</h3>
                        <p className="text-gray-600 text-xs leading-tight line-clamp-2">{dept.description}</p>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${dept.textColor} flex-shrink-0 ml-2`}>
                      {stats.total}
                    </div>
                  </div>
                </div>

                {/* Stats Body */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className={`text-xl font-bold ${dept.textColor}`}>{stats.completed}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Overall Progress</span>
                      <span>{Math.round(stats.avgProgress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${dept.progressColor} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${stats.avgProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>{stats.notStarted} Not Started</span>
                    <span className={`${dept.textColor} hover:opacity-80 font-medium transition-opacity`}>
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-700 hover:text-green-900">
            ×
          </button>
        </div>
      )}

      {/* Analytics Section */}
      {showAnalytics && (
        <DepartmentAnalytics departmentStats={departmentStatsArray} />
      )}

      {/* Summary Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiActivity className="text-xl text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Department Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
            <div className="text-2xl font-semibold text-slate-700 mb-1">
              {Object.values(departmentStats).reduce((sum, stat) => sum + stat.total, 0)}
            </div>
            <div className="text-slate-600 text-sm">Total Work Cards</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-200">
            <div className="text-2xl font-semibold text-emerald-700 mb-1">
              {Object.values(departmentStats).reduce((sum, stat) => sum + stat.completed, 0)}
            </div>
            <div className="text-emerald-600 text-sm">Completed</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
            <div className="text-2xl font-semibold text-blue-700 mb-1">
              {Object.values(departmentStats).reduce((sum, stat) => sum + stat.inProgress, 0)}
            </div>
            <div className="text-blue-600 text-sm">In Progress</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-200">
            <div className="text-2xl font-semibold text-amber-700 mb-1">
              {Object.values(departmentStats).reduce((sum, stat) => sum + stat.notStarted, 0)}
            </div>
            <div className="text-amber-600 text-sm">Not Started</div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CompanyDepartments;