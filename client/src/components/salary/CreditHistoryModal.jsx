import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiTrash2, FiDollarSign, FiCalendar, FiSave, FiXCircle } from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';
import Swal from 'sweetalert2';

const CreditHistoryModal = ({ userId, isOpen, onClose, isAdmin = false }) => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', date: '', description: '' });

  useEffect(() => {
    if (isOpen && userId) {
      fetchCreditHistory();
    }
  }, [isOpen, userId]);

  const fetchCreditHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = isAdmin
        ? `${API_ENDPOINTS.baseURL}/api/daily-salary/credit-history/${userId}`
        : `${API_ENDPOINTS.baseURL}/api/daily-salary/credit-history/me`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setCredits(data.data);
      }
    } catch (error) {
      console.error('Error fetching credit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (credit) => {
    setEditingId(credit._id);
    setEditForm({
      amount: credit.amount.toString(),
      date: new Date(credit.date).toISOString().split('T')[0],
      description: credit.configsApplied[0]?.description || ''
    });
  };

  const handleSaveEdit = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.baseURL}/api/daily-salary/credit-transaction/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire('Success', 'Credit updated successfully', 'success');
        setEditingId(null);
        fetchCreditHistory();
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      console.error('Error updating credit:', error);
      Swal.fire('Error', 'Failed to update credit', 'error');
    }
  };

  const handleDelete = async (transactionId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the credit and update total earnings',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_ENDPOINTS.baseURL}/api/daily-salary/credit-transaction/${transactionId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (data.success) {
          Swal.fire('Deleted!', 'Credit has been deleted', 'success');
          fetchCreditHistory();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (error) {
        console.error('Error deleting credit:', error);
        Swal.fire('Error', 'Failed to delete credit', 'error');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <FiDollarSign className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Credit History</h2>
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : credits.length === 0 ? (
            <div className="text-center py-12">
              <FiDollarSign className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No credit history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {credits.map((credit) => (
                <div
                  key={credit._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  {editingId === credit._id ? (
                    /* Edit Mode */
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₹)</label>
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <button
                            onClick={() => handleSaveEdit(credit._id)}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                          >
                            <FiSave size={16} />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-1"
                          >
                            <FiXCircle size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-3 rounded-full">
                            <FiDollarSign className="text-green-600 text-xl" />
                          </div>
                          <div>
                            <p className="font-bold text-2xl text-gray-800">
                              +₹{credit.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {credit.configsApplied && credit.configsApplied[0]?.configName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <FiCalendar size={14} />
                              {new Date(credit.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(credit.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {isAdmin && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEdit(credit)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                title="Edit"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(credit._id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                title="Delete"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {credit.configsApplied && credit.configsApplied[0]?.description && (
                        <div className="mt-2 pl-14">
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {credit.configsApplied[0].description}
                          </p>
                        </div>
                      )}
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
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditHistoryModal;

