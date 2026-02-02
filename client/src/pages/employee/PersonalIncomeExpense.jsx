import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import {
  FiBarChart2,
  FiDollarSign,
  FiEdit2,
  FiEye,
  FiFileText,
  FiPlus,
  FiSearch,
  FiTrendingDown,
  FiTrendingUp,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import IncomeExpenseReports from '../../components/admin-dashboard/IncomeExpenseReports';
import '../admin/IncomeExpense.css';

// Color palette for chips
const CHIP_COLORS = [
  { bg: 'bg-purple-500', text: 'text-white', hover: 'hover:bg-purple-600' },
  { bg: 'bg-green-500', text: 'text-white', hover: 'hover:bg-green-600' },
  { bg: 'bg-blue-500', text: 'text-white', hover: 'hover:bg-blue-600' },
  { bg: 'bg-teal-500', text: 'text-white', hover: 'hover:bg-teal-600' },
  { bg: 'bg-orange-500', text: 'text-white', hover: 'hover:bg-orange-600' },
  { bg: 'bg-red-500', text: 'text-white', hover: 'hover:bg-red-600' },
  { bg: 'bg-amber-500', text: 'text-white', hover: 'hover:bg-amber-600' },
  { bg: 'bg-indigo-500', text: 'text-white', hover: 'hover:bg-indigo-600' },
  { bg: 'bg-pink-500', text: 'text-white', hover: 'hover:bg-pink-600' },
  { bg: 'bg-cyan-500', text: 'text-white', hover: 'hover:bg-cyan-600' },
];

const getChipColor = (index) => CHIP_COLORS[index % CHIP_COLORS.length];

const PersonalIncomeExpense = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [showReports, setShowReports] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSourceType, setFilterSourceType] = useState('all');
  const [filterGivenBy, setFilterGivenBy] = useState('all');

  // Options for Source Type and Transaction Method
  const [sourceTypeOptions, setSourceTypeOptions] = useState([
    'Techackode IT Solutions',
    'UC',
    'Techackode Edutech',
    'Techackode Pvt Ltd',
  ]);
  const [transactionMethodOptions, setTransactionMethodOptions] = useState([
    'Cash',
    'Bank Transfer',
    'UPI',
    'Credit Card',
    'Debit Card',
    'Cheque',
  ]);

  // Form data (userId is always current user on this page)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sourceType: '',
    givenBy: '',
    transactionType: 'Income',
    credit: '',
    debit: '',
    transactionMethod: '',
    comments: '',
  });

  // States for custom inputs
  const [newSourceType, setNewSourceType] = useState('');
  const [newTransactionMethod, setNewTransactionMethod] = useState('');
  const [givenBySearch, setGivenBySearch] = useState('');
  const [givenByOpen, setGivenByOpen] = useState(false);
  const givenByRef = useRef(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  // Load records + summary using personal endpoints
  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (givenByRef.current && !givenByRef.current.contains(event.target)) {
        setGivenByOpen(false);
      }
    };

    if (givenByOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [givenByOpen]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getCurrentUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyIncomeExpense, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRecords(response.data.records || []);
        // Extract unique source types and transaction methods from records
        const uniqueSourceTypes = [
          ...new Set((response.data.records || []).map((r) => r.sourceType).filter(Boolean)),
        ];
        const uniqueMethods = [
          ...new Set((response.data.records || []).map((r) => r.transactionMethod).filter(Boolean)),
        ];
        setSourceTypeOptions((prev) => [...new Set([...prev, ...uniqueSourceTypes])]);
        setTransactionMethodOptions((prev) => [...new Set([...prev, ...uniqueMethods])]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      Swal.fire('Error', 'Failed to fetch records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getMyIncomeExpenseSummary, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.getUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenDialog = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        date: new Date(record.date).toISOString().split('T')[0],
        sourceType: record.sourceType,
        givenBy: record.givenBy,
        transactionType: record.transactionType,
        credit: record.credit || '',
        debit: record.debit || '',
        transactionMethod: record.transactionMethod,
        comments: record.comments || '',
      });
    } else {
      setEditingRecord(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        sourceType: '',
        givenBy: '',
        transactionType: 'Income',
        credit: '',
        debit: '',
        transactionMethod: '',
        comments: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecord(null);
    setNewSourceType('');
    setNewTransactionMethod('');
    setGivenBySearch('');
    setGivenByOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSourceType = () => {
    if (newSourceType.trim() && !sourceTypeOptions.includes(newSourceType.trim())) {
      setSourceTypeOptions([...sourceTypeOptions, newSourceType.trim()]);
      setFormData((prev) => ({ ...prev, sourceType: newSourceType.trim() }));
      setNewSourceType('');
    }
  };

  const addTransactionMethod = () => {
    if (
      newTransactionMethod.trim() &&
      !transactionMethodOptions.includes(newTransactionMethod.trim())
    ) {
      setTransactionMethodOptions([...transactionMethodOptions, newTransactionMethod.trim()]);
      setFormData((prev) => ({ ...prev, transactionMethod: newTransactionMethod.trim() }));
      setNewTransactionMethod('');
    }
  };

  const handleGivenBySelect = (value) => {
    setFormData((prev) => ({ ...prev, givenBy: value }));
    setGivenBySearch('');
    setGivenByOpen(false);
  };

  const handleGivenByCustom = () => {
    if (givenBySearch.trim()) {
      setFormData((prev) => ({ ...prev, givenBy: givenBySearch.trim() }));
      setGivenBySearch('');
      setGivenByOpen(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(givenBySearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(givenBySearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) {
      Swal.fire('Error', 'User not loaded. Please refresh and try again.', 'error');
      return;
    }

    // Validation
    if (!formData.sourceType || !formData.givenBy || !formData.transactionMethod) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    if (formData.transactionType === 'Income' && (!formData.credit || formData.credit <= 0)) {
      Swal.fire('Error', 'Please enter a valid credit amount for Income', 'error');
      return;
    }

    if (formData.transactionType === 'Expense' && (!formData.debit || formData.debit <= 0)) {
      Swal.fire('Error', 'Please enter a valid debit amount for Expense', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        date: new Date(formData.date).toISOString(),
        sourceType: formData.sourceType,
        givenBy: formData.givenBy,
        transactionType: formData.transactionType,
        credit: formData.transactionType === 'Income' ? parseFloat(formData.credit) : 0,
        debit: formData.transactionType === 'Expense' ? parseFloat(formData.debit) : 0,
        transactionMethod: formData.transactionMethod,
        comments: formData.comments,
      };

      let response;
      if (editingRecord) {
        response = await axios.put(API_ENDPOINTS.updateMyIncomeExpense(editingRecord._id), payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(API_ENDPOINTS.createMyIncomeExpense, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        Swal.fire(
          'Success',
          editingRecord ? 'Record updated successfully' : 'Record added successfully',
          'success'
        );
        handleCloseDialog();
        fetchRecords();
        fetchSummary();
      }
    } catch (error) {
      console.error('Error saving record:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Failed to save record';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(API_ENDPOINTS.deleteMyIncomeExpense(id), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          Swal.fire('Deleted!', 'Record has been deleted.', 'success');
          fetchRecords();
          fetchSummary();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        Swal.fire('Error', 'Failed to delete record', 'error');
      }
    }
  };

  // Get unique values for filters
  const uniqueSourceTypes = [...new Set(records.map((r) => r.sourceType))].sort();
  const uniqueGivenBy = [...new Set(records.map((r) => r.givenBy))].sort();

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.sourceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.givenBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || record.transactionType === filterType;
    const matchesSourceType = filterSourceType === 'all' || record.sourceType === filterSourceType;
    const matchesGivenBy = filterGivenBy === 'all' || record.givenBy === filterGivenBy;

    return matchesSearch && matchesType && matchesSourceType && matchesGivenBy;
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const getSourceTypeColor = (sourceType) => {
    const index = sourceTypeOptions.indexOf(sourceType);
    return index >= 0 ? getChipColor(index) : CHIP_COLORS[0];
  };

  const getTransactionMethodColor = (method) => {
    const index = transactionMethodOptions.indexOf(method);
    return index >= 0 ? getChipColor(index) : CHIP_COLORS[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Personal Income & Expense Manager
            </h1>
            <p className="text-indigo-100 text-sm">
              Track and manage your personal financial transactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReports(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FiBarChart2 className="w-5 h-5" />
              View Reports & Analytics
            </button>
            <button
              onClick={() => handleOpenDialog()}
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FiPlus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap lg:flex-nowrap gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Income</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <FiTrendingUp className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Total Expense</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
            <FiTrendingDown className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div
          className={`bg-gradient-to-br ${
            summary.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
          } rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`${
                  summary.balance >= 0 ? 'text-blue-100' : 'text-orange-100'
                } text-sm font-medium mb-1`}
              >
                Balance
              </p>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.balance)}</p>
            </div>
            <FiDollarSign className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-white">{summary.totalTransactions}</p>
            </div>
            <FiFileText className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium mb-1">Revenue</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <FiTrendingUp className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div
          className={`bg-gradient-to-br ${
            summary.balance >= 0
              ? 'from-emerald-500 to-emerald-600'
              : 'from-rose-500 to-rose-600'
          } rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`${
                  summary.balance >= 0 ? 'text-emerald-100' : 'text-rose-100'
                } text-sm font-medium mb-1`}
              >
                Profit
              </p>
              <p className="text-3xl font-bold text-white">{formatCurrency(summary.balance)}</p>
              <p
                className={`${
                  summary.balance >= 0 ? 'text-emerald-100' : 'text-rose-100'
                } text-xs mt-1 opacity-90`}
              >
                {summary.totalIncome > 0
                  ? `${((summary.balance / summary.totalIncome) * 100).toFixed(1)}% margin`
                  : '0% margin'}
              </p>
            </div>
            <FiDollarSign className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-0">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search by source, given by, method, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="all">All Transaction Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <select
            value={filterSourceType}
            onChange={(e) => setFilterSourceType(e.target.value)}
            className="flex-1 min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="all">All Source Types</option>
            {uniqueSourceTypes.map((sourceType) => (
              <option key={sourceType} value={sourceType}>
                {sourceType}
              </option>
            ))}
          </select>
          <select
            value={filterGivenBy}
            onChange={(e) => setFilterGivenBy(e.target.value)}
            className="flex-1 min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="all">All Given By</option>
            {uniqueGivenBy.map((givenBy) => (
              <option key={givenBy} value={givenBy}>
                {givenBy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  S No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Source Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => {
                  const sourceColor = getSourceTypeColor(record.sourceType);
                  const amount = record.credit > 0 ? record.credit : record.debit;
                  const isIncome = record.transactionType === 'Income';
                  return (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${sourceColor.bg} ${sourceColor.text}`}
                        >
                          {record.sourceType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            isIncome ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
                          {isIncome ? '+' : '-'}
                          {formatCurrency(amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewingRecord(record)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDialog(record)}
                            className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {openDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
              onClick={handleCloseDialog}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  {editingRecord ? 'Edit Transaction' : 'Add New Transaction'}
                </h3>
                <button
                  onClick={handleCloseDialog}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>

                    {/* Transaction Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Type *
                      </label>
                      <select
                        name="transactionType"
                        value={formData.transactionType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select>
                    </div>

                    {/* Source Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source Type *
                      </label>
                      <select
                        name="sourceType"
                        value={formData.sourceType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        <option value="">Select Source Type</option>
                        {sourceTypeOptions.map((option, index) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formData.sourceType && (
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getSourceTypeColor(formData.sourceType).bg} ${getSourceTypeColor(formData.sourceType).text}`}
                          >
                            {formData.sourceType}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add new source type"
                          value={newSourceType}
                          onChange={(e) => setNewSourceType(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' && (e.preventDefault(), addSourceType())
                          }
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={addSourceType}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          <FiPlus className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>

                    {/* Given By */}
                    <div className="relative" ref={givenByRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Given By *
                      </label>
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="givenBy"
                          value={formData.givenBy}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, givenBy: e.target.value }));
                            setGivenBySearch(e.target.value);
                            setGivenByOpen(true);
                          }}
                          onFocus={() => setGivenByOpen(true)}
                          required
                          placeholder="Search users or enter custom name"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      {givenByOpen && (givenBySearch || filteredUsers.length > 0) && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                          {filteredUsers.map((user) => (
                            <div
                              key={user._id}
                              onClick={() => handleGivenBySelect(user.name)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          ))}
                          {givenBySearch &&
                            !filteredUsers.find(
                              (u) => u.name.toLowerCase() === givenBySearch.toLowerCase()
                            ) && (
                              <div
                                onClick={handleGivenByCustom}
                                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer bg-indigo-50/50"
                              >
                                <p className="text-sm font-medium text-indigo-900">
                                  Use &quot;{givenBySearch}&quot;
                                </p>
                                <p className="text-xs text-indigo-600">Custom name</p>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Credit/Debit */}
                    {formData.transactionType === 'Income' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Credit Amount *
                        </label>
                        <input
                          type="number"
                          name="credit"
                          value={formData.credit}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Debit Amount *
                        </label>
                        <input
                          type="number"
                          name="debit"
                          value={formData.debit}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                      </div>
                    )}

                    {/* Transaction Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Method *
                      </label>
                      <select
                        name="transactionMethod"
                        value={formData.transactionMethod}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        <option value="">Select Transaction Method</option>
                        {transactionMethodOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {formData.transactionMethod && (
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTransactionMethodColor(formData.transactionMethod).bg} ${getTransactionMethodColor(formData.transactionMethod).text}`}
                          >
                            {formData.transactionMethod}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add new transaction method"
                          value={newTransactionMethod}
                          onChange={(e) => setNewTransactionMethod(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' && (e.preventDefault(), addTransactionMethod())
                          }
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={addTransactionMethod}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          <FiPlus className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments
                    </label>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Add any additional comments..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
                  >
                    {editingRecord ? 'Update' : 'Add'} Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
              onClick={() => setViewingRecord(null)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Transaction Details</h3>
                <button
                  onClick={() => setViewingRecord(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                <div className="space-y-4">
                  {/* Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(viewingRecord.date)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Transaction Type
                      </label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          viewingRecord.transactionType === 'Income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {viewingRecord.transactionType}
                      </span>
                    </div>
                  </div>

                  {/* Source Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Source Type
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getSourceTypeColor(viewingRecord.sourceType).bg} ${getSourceTypeColor(viewingRecord.sourceType).text}`}
                    >
                      {viewingRecord.sourceType}
                    </span>
                  </div>

                  {/* Given By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Given By</label>
                    <p className="text-sm font-semibold text-gray-900">{viewingRecord.givenBy}</p>
                  </div>

                  {/* Amount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Credit</label>
                      <p
                        className={`text-sm font-semibold ${
                          viewingRecord.credit > 0 ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {viewingRecord.credit > 0 ? formatCurrency(viewingRecord.credit) : '-'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Debit</label>
                      <p
                        className={`text-sm font-semibold ${
                          viewingRecord.debit > 0 ? 'text-red-600' : 'text-gray-400'
                        }`}
                      >
                        {viewingRecord.debit > 0 ? formatCurrency(viewingRecord.debit) : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Transaction Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Transaction Method
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTransactionMethodColor(viewingRecord.transactionMethod).bg} ${getTransactionMethodColor(viewingRecord.transactionMethod).text}`}
                    >
                      {viewingRecord.transactionMethod}
                    </span>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Comments</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {viewingRecord.comments || 'No comments'}
                    </p>
                  </div>

                  {/* User */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">User</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {viewingRecord.user?.name || '-'}
                    </p>
                    {viewingRecord.user?.email && (
                      <p className="text-xs text-gray-500 mt-1">{viewingRecord.user.email}</p>
                    )}
                  </div>

                  {/* Created By */}
                  {viewingRecord.createdBy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Created By
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {viewingRecord.createdBy?.name || '-'}
                      </p>
                      {viewingRecord.createdBy?.email && (
                        <p className="text-xs text-gray-500 mt-1">{viewingRecord.createdBy.email}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setViewingRecord(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setViewingRecord(null);
                    handleOpenDialog(viewingRecord);
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
                >
                  Edit Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports & Analytics Modal */}
      {showReports && (
        <IncomeExpenseReports
          records={records}
          onClose={() => setShowReports(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default PersonalIncomeExpense;

