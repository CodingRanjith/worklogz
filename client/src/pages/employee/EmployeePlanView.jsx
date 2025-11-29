import React, { useState, useEffect } from 'react';
import { FiCheck, FiDollarSign, FiCalendar, FiUsers, FiInfo, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';

const EmployeePlanView = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchCurrentUser();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getActivePlans, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        setPlans(response.data.plans || []);
      } else {
        // Fallback to mock data if API not available
        setPlans([
          {
            id: 1,
            name: 'Basic Plan',
            description: 'Perfect for small teams',
            price: 29,
            period: 'month',
            features: ['Up to 10 users', 'Basic analytics', 'Email support', '5GB storage'],
            isActive: true,
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            name: 'Professional Plan',
            description: 'Ideal for growing businesses',
            price: 79,
            period: 'month',
            features: ['Up to 50 users', 'Advanced analytics', 'Priority support', '50GB storage', 'API access'],
            isActive: true,
            createdAt: '2024-01-15'
          },
          {
            id: 3,
            name: 'Enterprise Plan',
            description: 'For large organizations',
            price: 199,
            period: 'month',
            features: ['Unlimited users', 'Custom analytics', '24/7 support', 'Unlimited storage', 'API access', 'Custom integrations'],
            isActive: true,
            createdAt: '2024-01-15'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Fallback to mock data
      setPlans([
        {
          id: 1,
          name: 'Basic Plan',
          description: 'Perfect for small teams',
          price: 29,
          period: 'month',
          features: ['Up to 10 users', 'Basic analytics', 'Email support', '5GB storage'],
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Professional Plan',
          description: 'Ideal for growing businesses',
          price: 79,
          period: 'month',
          features: ['Up to 50 users', 'Advanced analytics', 'Priority support', '50GB storage', 'API access'],
          isActive: true,
          createdAt: '2024-01-15'
        },
        {
          id: 3,
          name: 'Enterprise Plan',
          description: 'For large organizations',
          price: 199,
          period: 'month',
          features: ['Unlimited users', 'Custom analytics', '24/7 support', 'Unlimited storage', 'API access', 'Custom integrations'],
          isActive: true,
          createdAt: '2024-01-15'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getCurrentUser, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data) {
        setUserInfo(response.data);
        // If user has a plan assigned, set it
        if (response.data.planId || response.data.plan) {
          setCurrentPlan(response.data.planId || response.data.plan);
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const isCurrentPlan = (planId) => {
    if (!currentPlan) return false;
    return currentPlan === planId || (typeof currentPlan === 'object' && currentPlan.id === planId);
  };

  const getPlanBadgeColor = (plan) => {
    if (isCurrentPlan(plan.id)) {
      return 'bg-gradient-to-r from-green-500 to-emerald-600';
    }
    if (plan.name.toLowerCase().includes('enterprise')) {
      return 'bg-gradient-to-r from-purple-500 to-indigo-600';
    }
    if (plan.name.toLowerCase().includes('professional')) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-indigo-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl text-white">
                <FiDollarSign className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
                <p className="text-gray-600">View and manage your subscription plan</p>
              </div>
            </div>
            {currentPlan && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">Current Plan:</p>
                <p className="text-lg font-bold text-green-700">
                  {typeof currentPlan === 'object' ? currentPlan.name : plans.find(p => p.id === currentPlan)?.name || 'Active Plan'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Current Plan Highlight */}
        {currentPlan && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <FiStar className="text-4xl" />
              <div>
                <h2 className="text-2xl font-bold">Your Active Plan</h2>
                <p className="text-green-100">You're currently subscribed to this plan</p>
              </div>
            </div>
            {(() => {
              const plan = typeof currentPlan === 'object' 
                ? currentPlan 
                : plans.find(p => p.id === currentPlan);
              if (!plan) return null;
              return (
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <span className="text-2xl font-bold">
                      ${plan.price}/{plan.period}
                    </span>
                  </div>
                  <p className="text-green-100 mb-3">{plan.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {plan.features?.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FiCheck className="flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {plans.filter(plan => plan.isActive).map((plan) => {
            const isCurrent = isCurrentPlan(plan.id);
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                  isCurrent 
                    ? 'border-green-500 ring-4 ring-green-200' 
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="p-6">
                  {/* Plan Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getPlanBadgeColor(plan)}`}>
                        {plan.name}
                      </span>
                      {isCurrent && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1">
                          <FiStar className="text-xs" />
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-800">${plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    {plan.period === 'year' && (
                      <p className="text-sm text-gray-500 mt-1">
                        ${(plan.price / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-6 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Features
                    </h4>
                    {plan.features && plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className={`text-lg flex-shrink-0 mt-0.5 ${
                          isCurrent ? 'text-green-500' : 'text-indigo-500'
                        }`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <FiCheck className="text-lg" />
                        Current Plan
                      </button>
                    ) : (
                      <button
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        onClick={() => {
                          // Handle plan upgrade/change
                          alert(`Contact your administrator to upgrade to ${plan.name}`);
                        }}
                      >
                        <FiInfo className="text-lg" />
                        Learn More
                      </button>
                    )}
                  </div>

                  {/* Plan Info */}
                  {plan.createdAt && (
                    <div className="mt-4 pt-4 border-t text-xs text-gray-500 text-center">
                      Available since {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiInfo className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">About Plans</h3>
              <p className="text-gray-600 mb-3">
                Subscription plans determine the features and resources available to your organization. 
                To upgrade, downgrade, or change your plan, please contact your administrator.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiUsers className="text-indigo-500" />
                  <span>User limits vary by plan</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCalendar className="text-indigo-500" />
                  <span>Billed monthly or yearly</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiDollarSign className="text-indigo-500" />
                  <span>Flexible pricing options</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FiDollarSign className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No plans available</h3>
            <p className="text-gray-500">Please contact your administrator for plan information.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePlanView;

