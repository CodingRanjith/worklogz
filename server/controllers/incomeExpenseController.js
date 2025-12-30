const IncomeExpense = require('../models/IncomeExpense');
const User = require('../models/User');

// Get all income/expense records
exports.getAllIncomeExpense = async (req, res) => {
  try {
    const { startDate, endDate, transactionType, userId } = req.query;
    
    // Build query
    const query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (transactionType) {
      query.transactionType = transactionType;
    }
    
    if (userId) {
      query.user = userId;
    }
    
    const records = await IncomeExpense.find(query)
      .populate('user', 'name email')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      records
    });
  } catch (error) {
    console.error('Error fetching income/expense records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income/expense records'
    });
  }
};

// Get single income/expense record
exports.getIncomeExpenseById = async (req, res) => {
  try {
    const record = await IncomeExpense.findById(req.params.id)
      .populate('user', 'name email')
      .populate('createdBy', 'name email');
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.json({
      success: true,
      record
    });
  } catch (error) {
    console.error('Error fetching income/expense record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income/expense record'
    });
  }
};

// Create income/expense record
exports.createIncomeExpense = async (req, res) => {
  try {
    console.log('Create income/expense request received:', req.body);
    const {
      date,
      sourceType,
      givenBy,
      transactionType,
      credit,
      debit,
      transactionMethod,
      comments,
      userId
    } = req.body;
    
    // Validate required fields
    if (!date || !sourceType || !givenBy || !transactionType || !transactionMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Validate transaction type
    if (!['Income', 'Expense'].includes(transactionType)) {
      return res.status(400).json({
        success: false,
        error: 'Transaction type must be Income or Expense'
      });
    }
    
    // Validate credit/debit based on transaction type
    if (transactionType === 'Income' && (!credit || credit <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Credit amount is required for Income transactions'
      });
    }
    
    if (transactionType === 'Expense' && (!debit || debit <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Debit amount is required for Expense transactions'
      });
    }
    
    // Use provided userId or default to current user
    const targetUserId = userId || req.user._id;
    
    const record = new IncomeExpense({
      date: new Date(date),
      sourceType,
      givenBy,
      transactionType,
      credit: transactionType === 'Income' ? credit : 0,
      debit: transactionType === 'Expense' ? debit : 0,
      transactionMethod,
      comments: comments || '',
      user: targetUserId,
      createdBy: req.user._id
    });
    
    await record.save();
    await record.populate('user', 'name email');
    await record.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      record
    });
  } catch (error) {
    console.error('Error creating income/expense record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create income/expense record'
    });
  }
};

// Update income/expense record
exports.updateIncomeExpense = async (req, res) => {
  try {
    const {
      date,
      sourceType,
      givenBy,
      transactionType,
      credit,
      debit,
      transactionMethod,
      comments,
      userId
    } = req.body;
    
    const record = await IncomeExpense.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    // Update fields
    if (date) record.date = new Date(date);
    if (sourceType) record.sourceType = sourceType;
    if (givenBy) record.givenBy = givenBy;
    if (transactionType) {
      if (!['Income', 'Expense'].includes(transactionType)) {
        return res.status(400).json({
          success: false,
          error: 'Transaction type must be Income or Expense'
        });
      }
      record.transactionType = transactionType;
    }
    if (credit !== undefined) record.credit = transactionType === 'Income' ? credit : 0;
    if (debit !== undefined) record.debit = transactionType === 'Expense' ? debit : 0;
    if (transactionMethod) record.transactionMethod = transactionMethod;
    if (comments !== undefined) record.comments = comments;
    if (userId) record.user = userId;
    
    await record.save();
    await record.populate('user', 'name email');
    await record.populate('createdBy', 'name email');
    
    res.json({
      success: true,
      record
    });
  } catch (error) {
    console.error('Error updating income/expense record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update income/expense record'
    });
  }
};

// Delete income/expense record
exports.deleteIncomeExpense = async (req, res) => {
  try {
    const record = await IncomeExpense.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting income/expense record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete income/expense record'
    });
  }
};

// Get summary statistics
exports.getIncomeExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    // Build query
    const query = {};
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (userId) {
      query.user = userId;
    }
    
    // Calculate totals
    const [totalIncome, totalExpense, totalRecords] = await Promise.all([
      IncomeExpense.aggregate([
        { $match: { ...query, transactionType: 'Income' } },
        { $group: { _id: null, total: { $sum: '$credit' } } }
      ]),
      IncomeExpense.aggregate([
        { $match: { ...query, transactionType: 'Expense' } },
        { $group: { _id: null, total: { $sum: '$debit' } } }
      ]),
      IncomeExpense.countDocuments(query)
    ]);
    
    const income = totalIncome[0]?.total || 0;
    const expense = totalExpense[0]?.total || 0;
    const balance = income - expense;
    
    res.json({
      success: true,
      summary: {
        totalIncome: income,
        totalExpense: expense,
        balance: balance,
        totalTransactions: totalRecords
      }
    });
  } catch (error) {
    console.error('Error fetching income/expense summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch summary'
    });
  }
};

