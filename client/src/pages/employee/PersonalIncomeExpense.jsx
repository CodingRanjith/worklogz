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
  FiTarget,
  FiCalendar,
  FiSettings,
  FiCheckCircle,
  FiAlertCircle,
  FiShoppingBag,
  FiSave,
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
  const [filterGivenBy, setFilterGivenBy] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [goals, setGoals] = useState({
    needsPercent: 30,
    wantsPercent: 20,
    savingsPercent: 50,
  });
  const [transactionMethodOptions, setTransactionMethodOptions] = useState([
    'Cash',
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'Digital Wallet',
    'Other',
  ]);

  // Form data (userId is always current user on this page)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    givenBy: '',
    transactionType: 'Income',
    amount: '',
    credit: '',
    debit: '',
    category: '',
    goalType: '', // Needs, Wants, Savings
    transactionMethod: '',
    comments: '',
  });

  // States for custom inputs
  const [newTransactionMethod, setNewTransactionMethod] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([
    'Food',
    'Rent',
    'Salary',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Investment',
    'Other',
  ]);
  const [newCategory, setNewCategory] = useState('');

  // Category mapping to goal types
  const needsCategories = ['Food', 'Rent', 'Bills', 'Transport', 'Utilities'];
  const wantsCategories = ['Shopping', 'Entertainment', 'Dining Out', 'Hobbies'];
  const savingsCategories = ['Investment', 'Savings', 'Emergency Fund'];

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('personalIncomeGoals');
    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals);
        setGoals(parsed);
      } catch (e) {
        console.error('Error loading goals:', e);
      }
    }
  }, []);

  // Calculate month-wise expenses by goal type
  const getMonthlyExpensesByGoal = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    const monthRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= monthStart && recordDate <= monthEnd && record.transactionType === 'Expense';
    });

    // Use goalType if available, otherwise fall back to category mapping
    const needsExpense = monthRecords
      .filter((r) => {
        if (r.goalType) return r.goalType === 'Needs';
        return needsCategories.includes(r.category);
      })
      .reduce((sum, r) => sum + (r.debit || 0), 0);

    const wantsExpense = monthRecords
      .filter((r) => {
        if (r.goalType) return r.goalType === 'Wants';
        return wantsCategories.includes(r.category);
      })
      .reduce((sum, r) => sum + (r.debit || 0), 0);

    // Calculate savings from Income and Expense transactions with goalType='Savings'
    const savingsFromIncome = records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return (
          recordDate >= monthStart &&
          recordDate <= monthEnd &&
          r.transactionType === 'Income' &&
          r.goalType === 'Savings'
        );
      })
      .reduce((sum, r) => sum + (r.credit || 0), 0);

    const savingsFromExpense = monthRecords
      .filter((r) => r.goalType === 'Savings')
      .reduce((sum, r) => sum + (r.debit || 0), 0);

    const monthIncome = records
      .filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate >= monthStart && recordDate <= monthEnd && r.transactionType === 'Income';
      })
      .reduce((sum, r) => sum + (r.credit || 0), 0);

    // Calculate savings: Income with Savings goalType + Expense with Savings goalType, or income - needs - wants
    const savingsFromGoalType = savingsFromIncome + savingsFromExpense;
    const actualSavings = savingsFromGoalType > 0 
      ? savingsFromGoalType 
      : Math.max(0, monthIncome - needsExpense - wantsExpense);

    return {
      needs: needsExpense,
      wants: wantsExpense,
      savings: actualSavings,
      income: monthIncome,
    };
  };

  const monthlyData = getMonthlyExpensesByGoal();

  // Calculate monthly totals for summary cards
  const [year, month] = selectedMonth.split('-').map(Number);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59);
  
  const monthlySummary = records.reduce((acc, record) => {
    const recordDate = new Date(record.date);
    if (recordDate >= monthStart && recordDate <= monthEnd) {
      if (record.transactionType === 'Income') {
        acc.totalIncome += record.credit || 0;
      } else if (record.transactionType === 'Expense') {
        acc.totalExpense += record.debit || 0;
      }
      acc.totalTransactions += 1;
    }
    return acc;
  }, { totalIncome: 0, totalExpense: 0, totalTransactions: 0 });
  
  monthlySummary.balance = monthlySummary.totalIncome - monthlySummary.totalExpense;

  // Calculate goal amounts from percentages and income
  const goalAmounts = {
    needs: monthlyData.income > 0 ? (monthlyData.income * (goals.needsPercent || 0)) / 100 : 0,
    wants: monthlyData.income > 0 ? (monthlyData.income * (goals.wantsPercent || 0)) / 100 : 0,
    savings: monthlyData.income > 0 ? (monthlyData.income * (goals.savingsPercent || 0)) / 100 : 0,
  };

  // Calculate actual percentages (handle division by zero)
  const actualPercentages = {
    needs: monthlyData.income > 0 ? (monthlyData.needs / monthlyData.income) * 100 : 0,
    wants: monthlyData.income > 0 ? (monthlyData.wants / monthlyData.income) * 100 : 0,
    savings: monthlyData.income > 0 ? (monthlyData.savings / monthlyData.income) * 100 : 0,
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Load records + summary using personal endpoints
  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, []);

  // Ensure category from editing record is in options
  useEffect(() => {
    if (editingRecord?.category && !categoryOptions.includes(editingRecord.category)) {
      setCategoryOptions((prev) => [...prev, editingRecord.category]);
    }
  }, [editingRecord]);


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
        const incomeExpenseRecords = response.data.records || [];
        setRecords(incomeExpenseRecords);
        
        // Debug: Log all records to check fields
        console.log('All records fetched:', incomeExpenseRecords);
        incomeExpenseRecords.forEach((record, index) => {
          console.log(`Record ${index + 1}:`, {
            id: record._id,
            name: record.givenBy,
            category: record.category,
            goalType: record.goalType,
            hasCategory: !!record.category,
            hasGoalType: !!record.goalType,
          });
        });
        
        // Extract unique methods and categories from records
        const uniqueMethods = [
          ...new Set(incomeExpenseRecords.map((r) => r.transactionMethod).filter(Boolean)),
        ];
        setTransactionMethodOptions((prev) => [...new Set([...prev, ...uniqueMethods])]);
        const uniqueCategories = [
          ...new Set(incomeExpenseRecords.map((r) => r.category).filter(Boolean)),
        ];
        if (uniqueCategories.length) {
          setCategoryOptions((prev) => [...new Set([...prev, ...uniqueCategories])]);
        }
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


  const handleOpenDialog = (record = null) => {
    if (record) {
      setEditingRecord(record);
      const amountValue = record.credit > 0 ? record.credit : record.debit || '';
      
      // Debug: Log the record data
      console.log('Editing record:', record);
      console.log('Record category:', record.category);
      console.log('Record goalType:', record.goalType);
      
      // Ensure category and goalType are added to options if they exist
      if (record.category && !categoryOptions.includes(record.category)) {
        setCategoryOptions((prev) => [...prev, record.category]);
      }
      
      setFormData({
        date: new Date(record.date).toISOString().split('T')[0],
        givenBy: record.givenBy || '',
        transactionType: record.transactionType || 'Income',
        amount: amountValue,
        credit: record.credit || '',
        debit: record.debit || '',
        category: record.category || '',
        goalType: record.goalType || '',
        transactionMethod: record.transactionMethod || '',
        comments: record.comments || '',
      });
      
      // Debug: Log form data after setting
      console.log('Form data set:', {
        category: record.category || '',
        goalType: record.goalType || '',
      });
    } else {
      setEditingRecord(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        givenBy: '',
        transactionType: 'Income',
        amount: '',
        credit: '',
        debit: '',
        category: '',
        goalType: '',
        transactionMethod: '',
        comments: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecord(null);
    setNewTransactionMethod('');
    setNewCategory('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-suggest goal type based on category selection (only for Expenses)
      if (name === 'category' && prev.transactionType === 'Expense' && value) {
        if (needsCategories.includes(value)) {
          updated.goalType = 'Needs';
        } else if (wantsCategories.includes(value)) {
          updated.goalType = 'Wants';
        } else if (savingsCategories.includes(value)) {
          updated.goalType = 'Savings';
        }
      }
      
      // Reset goal type if transaction type changes to Income
      if (name === 'transactionType' && value === 'Income') {
        updated.goalType = '';
      }
      
      return updated;
    });
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

  const addCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory.trim())) {
      setCategoryOptions([...categoryOptions, newCategory.trim()]);
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) {
      Swal.fire('Error', 'User not loaded. Please refresh and try again.', 'error');
      return;
    }

    // Validation - check for empty strings as well
    if (!formData.date || formData.date.trim() === '') {
      Swal.fire('Error', 'Please select a date', 'error');
      return;
    }
    if (!formData.givenBy || formData.givenBy.trim() === '') {
      Swal.fire('Error', 'Please enter a transaction name', 'error');
      return;
    }
    if (!formData.transactionType || formData.transactionType.trim() === '') {
      Swal.fire('Error', 'Please select a transaction type', 'error');
      return;
    }
    if (!formData.transactionMethod || formData.transactionMethod.trim() === '') {
      Swal.fire('Error', 'Please select a payment method', 'error');
      return;
    }

    // Goal Type is required for Expense transactions
    if (formData.transactionType === 'Expense' && !formData.goalType) {
      Swal.fire('Error', 'Please select a Goal Type for Expense transactions', 'error');
      return;
    }

    const amountValue = parseFloat(formData.amount);
    if (!amountValue || amountValue <= 0) {
      Swal.fire('Error', 'Please enter a valid amount', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const creditValue = formData.transactionType === 'Income' ? amountValue : 0;
      const debitValue = formData.transactionType === 'Expense' ? amountValue : 0;
      
      // Ensure all required fields have valid values
      const payload = {
        date: new Date(formData.date).toISOString(),
        sourceType: 'Personal',
        givenBy: formData.givenBy.trim(),
        transactionType: formData.transactionType,
        credit: creditValue,
        debit: debitValue,
        transactionMethod: formData.transactionMethod.trim(),
        category: formData.category?.trim() || undefined,
        goalType: formData.goalType || undefined,
        comments: (formData.comments || '').trim(),
      };

      // Debug log
      console.log('Submitting payload:', payload);

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
        // Debug: Log the saved record
        console.log('Saved record response:', response.data.record);
        console.log('Saved category:', response.data.record?.category);
        console.log('Saved goalType:', response.data.record?.goalType);
        
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
      
      // Log full error details for debugging
      if (error.response?.data) {
        console.error('Backend error response:', error.response.data);
      }
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
  const uniqueGivenBy = [...new Set(records.map((r) => r.givenBy))].sort();
  const uniqueCategories = [...new Set(records.map((r) => r.category).filter(Boolean))].sort();

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.givenBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || record.transactionType === filterType;
    const matchesGivenBy = filterGivenBy === 'all' || record.givenBy === filterGivenBy;
    const matchesCategory = filterCategory === 'all' || record.category === filterCategory;

    return matchesSearch && matchesType && matchesGivenBy && matchesCategory;
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

      {/* Set Goals Section */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiTarget className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Monthly Goals</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const monthStr = date.toISOString().slice(0, 7);
              const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
              return (
                <option key={monthStr} value={monthStr}>
                  {monthName}
                </option>
              );
            })}
          </select>
        </div>
        <button
          onClick={() => setShowGoalsModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiSettings className="w-4 h-4" />
          Set Goals
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap lg:flex-nowrap gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Income</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(monthlySummary.totalIncome)}</p>
            </div>
            <FiTrendingUp className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Total Expense</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(monthlySummary.totalExpense)}
              </p>
            </div>
            <FiTrendingDown className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div
          className={`bg-gradient-to-br ${
            monthlySummary.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
          } rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`${
                  monthlySummary.balance >= 0 ? 'text-blue-100' : 'text-orange-100'
                } text-sm font-medium mb-1`}
              >
                Balance
              </p>
              <p className="text-3xl font-bold text-white">{formatCurrency(monthlySummary.balance)}</p>
            </div>
            <FiDollarSign className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-white">{monthlySummary.totalTransactions}</p>
            </div>
            <FiFileText className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        {/* Needs Goal Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Needs</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(monthlyData.needs)}</p>
              <p className="text-blue-100 text-xs mt-1 opacity-90">
                {monthlyData.income > 0 ? `${actualPercentages.needs.toFixed(1)}%` : '0.0%'} of income
              </p>
              <p className="text-blue-100 text-xs mt-1 opacity-75">
                Goal: {goals.needsPercent || 0}%
              </p>
            </div>
            <FiTarget className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        {/* Wants Goal Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Wants</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(monthlyData.wants)}</p>
              <p className="text-purple-100 text-xs mt-1 opacity-90">
                {monthlyData.income > 0 ? `${actualPercentages.wants.toFixed(1)}%` : '0.0%'} of income
              </p>
              <p className="text-purple-100 text-xs mt-1 opacity-75">
                Goal: {goals.wantsPercent || 0}%
              </p>
            </div>
            <FiShoppingBag className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        {/* Savings Goal Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Savings</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(monthlyData.savings)}</p>
              <p className="text-green-100 text-xs mt-1 opacity-90">
                {monthlyData.income > 0 ? `${actualPercentages.savings.toFixed(1)}%` : '0.0%'} of income
              </p>
              <p className="text-green-100 text-xs mt-1 opacity-75">
                Goal: {goals.savingsPercent || 0}%
              </p>
            </div>
            <FiSave className="w-12 h-12 text-white opacity-80" />
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
              placeholder="Search by name, payment method, or category..."
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
            value={filterGivenBy}
            onChange={(e) => setFilterGivenBy(e.target.value)}
            className="flex-1 min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="all">All Names</option>
            {uniqueGivenBy.map((givenBy) => (
              <option key={givenBy} value={givenBy}>
                {givenBy}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
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
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Goal Type
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
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => {
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.givenBy || '-'}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.category && String(record.category).trim() !== '' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {record.category}
                          </span>
                        ) : (
                          <span className="text-gray-400" title={`Category: "${record.category || 'null'}"`}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.goalType && String(record.goalType).trim() !== '' ? (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              record.goalType === 'Needs'
                                ? 'bg-blue-100 text-blue-800'
                                : record.goalType === 'Wants'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {record.goalType}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400" title={`GoalType: "${record.goalType || 'null'}"`}>-</span>
                        )}
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

                    {/* Goal Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Goal Type {formData.transactionType === 'Expense' && '*'}
                      </label>
                      <select
                        name="goalType"
                        value={formData.goalType}
                        onChange={handleInputChange}
                        required={formData.transactionType === 'Expense'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        <option value="">
                          {formData.transactionType === 'Expense' 
                            ? 'Select Goal Type' 
                            : 'Select Goal Type (Optional)'}
                        </option>
                        <option value="Needs">Needs (Essential expenses: Food, Rent, Bills, Transport, Utilities)</option>
                        <option value="Wants">Wants (Discretionary spending: Shopping, Entertainment, Dining Out, Hobbies)</option>
                        <option value="Savings">Savings (Investment, Savings, Emergency Fund)</option>
                      </select>
                      {formData.goalType && (
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              formData.goalType === 'Needs'
                                ? 'bg-blue-100 text-blue-800'
                                : formData.goalType === 'Wants'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {formData.goalType}
                          </span>
                          {formData.transactionType === 'Expense' && formData.category && (
                            <p className="mt-1 text-xs text-gray-500">
                              {needsCategories.includes(formData.category) ||
                              wantsCategories.includes(formData.category) ||
                              savingsCategories.includes(formData.category)
                                ? '✓ Auto-selected based on category'
                                : '⚠ Category not mapped - please select manually'}
                            </p>
                          )}
                        </div>
                      )}
                      {formData.transactionType === 'Expense' && (
                        <p className="mt-1 text-xs text-gray-500">
                          Select the goal category this expense belongs to for tracking against your monthly goals.
                        </p>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="givenBy"
                        value={formData.givenBy}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter transaction name (e.g., Salary, Groceries, Rent)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        This will be treated as{' '}
                        {formData.transactionType === 'Income'
                          ? 'credit (Income)'
                          : 'debit (Expense)'}.
                      </p>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add new category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={addCategory}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          <FiPlus className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
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

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
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

                  {/* Category and Goal Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                      {viewingRecord.category && viewingRecord.category.trim() !== '' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {viewingRecord.category}
                        </span>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Goal Type</label>
                      {viewingRecord.goalType && viewingRecord.goalType.trim() !== '' ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            viewingRecord.goalType === 'Needs'
                              ? 'bg-blue-100 text-blue-800'
                              : viewingRecord.goalType === 'Wants'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {viewingRecord.goalType}
                        </span>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </div>
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

      {/* Goals Setting Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
              onClick={() => setShowGoalsModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Set Monthly Goals</h3>
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                <p className="text-sm text-gray-600">
                  Set your monthly budget goals as percentages of your income. The total should equal 100%.
                </p>

                <div className="space-y-4">
                  {/* Needs Goal */}
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      Needs Goal (%)
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Essential expenses: Food, Rent, Bills, Transport, Utilities
                    </p>
                    <input
                      type="number"
                      value={goals.needsPercent || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setGoals((prev) => ({ ...prev, needsPercent: value }));
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="30"
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Wants Goal */}
                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                      Wants Goal (%)
                    </label>
                    <p className="text-xs text-purple-700 mb-2">
                      Discretionary spending: Shopping, Entertainment, Dining Out, Hobbies
                    </p>
                    <input
                      type="number"
                      value={goals.wantsPercent || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setGoals((prev) => ({ ...prev, wantsPercent: value }));
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="20"
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Savings Goal */}
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <label className="block text-sm font-semibold text-green-900 mb-2">
                      Savings Goal (%)
                    </label>
                    <p className="text-xs text-green-700 mb-2">
                      Target savings: Investment, Savings, Emergency Fund
                    </p>
                    <input
                      type="number"
                      value={goals.savingsPercent || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setGoals((prev) => ({ ...prev, savingsPercent: value }));
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="50"
                      className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>

                  {/* Total Percentage Display */}
                  <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Total:</span>
                      <span
                        className={`text-lg font-bold ${
                          (goals.needsPercent || 0) + (goals.wantsPercent || 0) + (goals.savingsPercent || 0) === 100
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {(goals.needsPercent || 0) + (goals.wantsPercent || 0) + (goals.savingsPercent || 0)}%
                      </span>
                    </div>
                    {(goals.needsPercent || 0) + (goals.wantsPercent || 0) + (goals.savingsPercent || 0) !== 100 && (
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ Total must equal 100%
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGoalsModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const total = (goals.needsPercent || 0) + (goals.wantsPercent || 0) + (goals.savingsPercent || 0);
                    if (total !== 100) {
                      Swal.fire('Error', 'Total percentage must equal 100%', 'error');
                      return;
                    }
                    localStorage.setItem('personalIncomeGoals', JSON.stringify(goals));
                    Swal.fire('Success', 'Goals saved successfully!', 'success');
                    setShowGoalsModal(false);
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
                >
                  Save Goals
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

