import React, { useState } from 'react';
import { FiCheck, FiX, FiEdit, FiTrash2, FiPlus, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Plans = () => {
  const [plans, setPlans] = useState([
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

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    period: 'month',
    features: [],
    featureInput: ''
  });

  const handleAddFeature = () => {
    if (formData.featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, formData.featureInput.trim()],
        featureInput: ''
      });
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
      });
      return;
    }

    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id 
          ? { ...formData, id: editingPlan.id, price: parseFloat(formData.price), isActive: editingPlan.isActive, createdAt: editingPlan.createdAt }
          : plan
      ));
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Plan has been updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      // Add new plan
      const newPlan = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlans([...plans, newPlan]);
      Swal.fire({
        icon: 'success',
        title: 'Created!',
        text: 'New plan has been created successfully',
        timer: 2000,
        showConfirmButton: false
      });
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      period: 'month',
      features: [],
      featureInput: ''
    });
    setEditingPlan(null);
    setShowForm(false);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      period: plan.period,
      features: [...plan.features],
      featureInput: ''
    });
    setShowForm(true);
  };

  const handleDelete = (planId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setPlans(plans.filter(plan => plan.id !== planId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Plan has been deleted',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleToggleStatus = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
    ));
  };

  const cancelForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      period: 'month',
      features: [],
      featureInput: ''
    });
    setEditingPlan(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Plans Management</h1>
          <p className="text-gray-600">Create and manage subscription plans for your application</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              period: 'month',
              features: [],
              featureInput: ''
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="text-lg" />
          Add New Plan
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Professional Plan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe this plan..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Period
                    </label>
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={formData.featureInput}
                      onChange={(e) => setFormData({ ...formData, featureInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a feature..."
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiX className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-md border-2 transition-all hover:shadow-lg ${
              plan.isActive ? 'border-blue-500' : 'border-gray-300 opacity-75'
            }`}
          >
            <div className="p-6">
              {/* Plan Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    plan.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-800">${plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FiCheck className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <FiEdit className="text-sm" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(plan.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    plan.isActive
                      ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  <FiCalendar className="text-sm" />
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>

              {/* Plan Info */}
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(plan.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <div className="text-center py-12">
          <FiUsers className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No plans yet</h3>
          <p className="text-gray-500 mb-4">Create your first plan to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus />
            Create Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default Plans;
