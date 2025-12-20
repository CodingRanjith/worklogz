import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiTarget,
  FiArrowRight,
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiLayers,
  FiBook,
  FiBriefcase,
  FiCode,
} from 'react-icons/fi';
import { API_ENDPOINTS, fetchCRMLeads } from '../../utils/api';
import { format } from 'date-fns';

const CRMDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allLeads, setAllLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    courseLeads: 0,
    internshipLeads: 0,
    itProjectLeads: 0,
    convertedLeads: 0,
    pendingLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });

  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    loadAllLeads();
  }, []);

  const loadAllLeads = async () => {
    try {
      setLoading(true);
      const [courseLeads, internshipLeads, itProjectLeads] = await Promise.all([
        fetchCRMLeads({ pipelineType: 'course' }, token),
        fetchCRMLeads({ pipelineType: 'internship' }, token),
        fetchCRMLeads({ pipelineType: 'it-project' }, token),
      ]);

      const all = [...courseLeads, ...internshipLeads, ...itProjectLeads];
      setAllLeads(all);

      // Calculate statistics
      const courseCount = courseLeads.length;
      const internshipCount = internshipLeads.length;
      const itProjectCount = itProjectLeads.length;
      const total = all.length;

      // Calculate converted leads (leads in final stages)
      const converted = all.filter(lead => {
        const stageName = lead.stage?.name?.toLowerCase() || '';
        return stageName.includes('won') || stageName.includes('closed') || stageName.includes('completed');
      }).length;

      // Calculate revenue (sum of payment amounts if available)
      const revenue = all.reduce((sum, lead) => {
        const amount = lead.coursePaymentAmount || lead.paymentAmount || lead.projectProposalAmount || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);

      const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

      setStats({
        totalLeads: total,
        courseLeads: courseCount,
        internshipLeads: internshipCount,
        itProjectLeads: itProjectCount,
        convertedLeads: converted,
        pendingLeads: total - converted,
        totalRevenue: revenue,
        conversionRate,
      });
    } catch (error) {
      console.error('Error loading CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentLeads = useMemo(() => {
    return [...allLeads]
      .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
      .slice(0, 10);
  }, [allLeads]);

  const pipelineStats = useMemo(() => {
    const courseLeads = allLeads.filter(l => l.pipelineType === 'course');
    const internshipLeads = allLeads.filter(l => l.pipelineType === 'internship');
    const itProjectLeads = allLeads.filter(l => l.pipelineType === 'it-project');

    return [
      {
        type: 'course',
        name: 'Course CRM',
        count: courseLeads.length,
        converted: courseLeads.filter(l => {
          const stageName = l.stage?.name?.toLowerCase() || '';
          return stageName.includes('won') || stageName.includes('closed');
        }).length,
        icon: <FiBook className="w-6 h-6" />,
        color: 'indigo',
        path: '/crm/course',
      },
      {
        type: 'internship',
        name: 'Internship CRM',
        count: internshipLeads.length,
        converted: internshipLeads.filter(l => {
          const stageName = l.stage?.name?.toLowerCase() || '';
          return stageName.includes('won') || stageName.includes('closed');
        }).length,
        icon: <FiBriefcase className="w-6 h-6" />,
        color: 'purple',
        path: '/crm/internship',
      },
      {
        type: 'it-project',
        name: 'IT Projects CRM',
        count: itProjectLeads.length,
        converted: itProjectLeads.filter(l => {
          const stageName = l.stage?.name?.toLowerCase() || '';
          return stageName.includes('won') || stageName.includes('closed');
        }).length,
        icon: <FiCode className="w-6 h-6" />,
        color: 'blue',
        path: '/crm/it-projects',
      },
    ];
  }, [allLeads]);

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('won') || statusLower.includes('closed') || statusLower === 'completed') {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (statusLower.includes('pending') || statusLower === 'new') {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getPipelineTypeColor = (type) => {
    switch (type) {
      case 'course':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'internship':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'it-project':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of all your CRM pipelines and lead performance</p>
          </div>
          <button
            onClick={loadAllLeads}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLeads}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-gray-600">Across all pipelines</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.convertedLeads}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">{stats.conversionRate}% conversion rate</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingLeads}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">In progress</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">From all pipelines</span>
            </div>
          </div>
        </div>

        {/* Pipeline Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pipelineStats.map((pipeline) => (
            <div
              key={pipeline.type}
              onClick={() => navigate(pipeline.path)}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${pipeline.color}-100`}>
                  <div className={`text-${pipeline.color}-600`}>{pipeline.icon}</div>
                </div>
                <FiArrowRight className={`w-5 h-5 text-gray-400 group-hover:text-${pipeline.color}-600 transition`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pipeline.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Leads</span>
                  <span className="text-lg font-bold text-gray-900">{pipeline.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Converted</span>
                  <span className="text-lg font-semibold text-green-600">{pipeline.converted}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${pipeline.color}-600 h-2 rounded-full transition-all`}
                      style={{
                        width: pipeline.count > 0 ? `${(pipeline.converted / pipeline.count) * 100}%` : '0%',
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {pipeline.count > 0
                      ? `${Math.round((pipeline.converted / pipeline.count) * 100)}% conversion`
                      : 'No leads'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
              <button
                onClick={() => navigate('/crm/course')}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                View All
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentLeads.length === 0 ? (
              <div className="text-center py-12">
                <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No leads found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead._id}
                    onClick={() => {
                      const path =
                        lead.pipelineType === 'course'
                          ? '/crm/course'
                          : lead.pipelineType === 'internship'
                          ? '/crm/internship'
                          : '/crm/it-projects';
                      navigate(path);
                    }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {lead.fullName?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{lead.fullName}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPipelineTypeColor(
                              lead.pipelineType
                            )}`}
                          >
                            {lead.pipelineType === 'course'
                              ? 'Course'
                              : lead.pipelineType === 'internship'
                              ? 'Internship'
                              : 'IT Project'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          {lead.phone && <span>{lead.phone}</span>}
                          {lead.email && <span className="truncate">{lead.email}</span>}
                          {lead.stage?.name && (
                            <span className={`px-2 py-0.5 rounded-full border text-xs ${getStatusColor(lead.stage.name)}`}>
                              {lead.stage.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="text-xs text-gray-500">
                        {lead.createdAt
                          ? format(new Date(lead.createdAt), 'MMM dd, yyyy')
                          : lead.updatedAt
                          ? format(new Date(lead.updatedAt), 'MMM dd, yyyy')
                          : 'N/A'}
                      </div>
                      <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;

