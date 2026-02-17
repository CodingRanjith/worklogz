const Payout = require('../models/Payout');
const User = require('../models/User');

// Generate unique transaction ID
const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
};

// @desc    Request a payout (User)
// @route   POST /api/payouts/request
// @access  User
exports.requestPayout = async (req, res) => {
  try {
    const { amount, description, requestNotes } = req.body;
    const userId = req.user._id;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid amount is required'
      });
    }

    // Check user's available earnings
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user has enough earnings
    const availableEarnings = user.dailyEarnings || 0;
    if (amount > availableEarnings) {
      return res.status(400).json({
        success: false,
        error: `Insufficient earnings. Available: ₹${availableEarnings.toLocaleString('en-IN')}`
      });
    }

    // Generate transaction ID
    let transactionId = generateTransactionId();
    let existingPayout = await Payout.findOne({ transactionId });
    while (existingPayout) {
      transactionId = generateTransactionId();
      existingPayout = await Payout.findOne({ transactionId });
    }

    // Create payout request
    const payout = new Payout({
      userId,
      amount,
      transactionId,
      payoutTime: new Date(),
      paymentMethod: 'bank_transfer',
      description: description || 'Payout request from user',
      notes: requestNotes,
      status: 'pending',
      requestedByUser: true,
      requestedAmount: amount
    });

    await payout.save();

    res.status(201).json({
      success: true,
      message: 'Payout request submitted successfully',
      data: payout
    });
  } catch (error) {
    console.error('Error requesting payout:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit payout request',
      message: error.message
    });
  }
};

// @desc    Create a new payout (Admin only)
// @route   POST /api/payouts
// @access  Admin
exports.createPayout = async (req, res) => {
  try {
    const { userId, amount, payoutTime, paymentMethod, description, notes } = req.body;

    // Validation
    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'User ID and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate transaction ID
    let transactionId = generateTransactionId();
    
    // Ensure transaction ID is unique
    let existingPayout = await Payout.findOne({ transactionId });
    while (existingPayout) {
      transactionId = generateTransactionId();
      existingPayout = await Payout.findOne({ transactionId });
    }

    // Create payout
    const payout = new Payout({
      userId,
      amount,
      transactionId,
      payoutTime: payoutTime ? new Date(payoutTime) : new Date(),
      paymentMethod: paymentMethod || 'bank_transfer',
      description,
      notes,
      status: 'pending',
      processedBy: req.user._id
    });

    await payout.save();

    res.status(201).json({
      success: true,
      data: payout
    });
  } catch (error) {
    console.error('Error creating payout:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payout',
      message: error.message
    });
  }
};

// @desc    Get all payouts (Admin only)
// @route   GET /api/payouts
// @access  Admin
exports.getAllPayouts = async (req, res) => {
  try {
    const { userId, status, startDate, endDate, requestedByUser, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (requestedByUser === 'true' || requestedByUser === true) {
      query.requestedByUser = true;
    }
    
    if (startDate || endDate) {
      query.payoutTime = {};
      if (startDate) {
        query.payoutTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.payoutTime.$lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const payouts = await Payout.find(query)
      .sort({ payoutTime: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payout.countDocuments(query);

    res.json({
      success: true,
      data: payouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payouts',
      message: error.message
    });
  }
};

// @desc    Get payout by ID
// @route   GET /api/payouts/:id
// @access  Admin/User (own payouts)
exports.getPayoutById = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    
    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found'
      });
    }

    // Check if user has access (admin or own payout)
    if (req.user.role !== 'admin' && req.user.adminAccess !== true) {
      if (payout.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: payout
    });
  } catch (error) {
    console.error('Error fetching payout:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payout',
      message: error.message
    });
  }
};

// @desc    Get current user's payouts
// @route   GET /api/payouts/me
// @access  User
exports.getMyPayouts = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const payouts = await Payout.find(query)
      .sort({ payoutTime: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payout.countDocuments(query);

    res.json({
      success: true,
      data: payouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user payouts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payouts',
      message: error.message
    });
  }
};

// @desc    Update payout status (Admin only)
// @route   PUT /api/payouts/:id/status
// @access  Admin
exports.updatePayoutStatus = async (req, res) => {
  try {
    const { status, failureReason } = req.body;
    
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required'
      });
    }

    const payout = await Payout.findById(req.params.id);
    
    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found'
      });
    }

    const previousStatus = payout.status;
    const user = await User.findById(payout.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // If payout is being approved (moved to processing), deduct from user's earnings
    if (status === 'processing' && previousStatus === 'pending') {
      const currentEarnings = user.dailyEarnings || 0;
      if (currentEarnings >= payout.amount) {
        user.dailyEarnings = Math.max(0, currentEarnings - payout.amount);
        await user.save();
      } else {
        return res.status(400).json({
          success: false,
          error: `User has insufficient earnings. Available: ₹${currentEarnings.toLocaleString('en-IN')}`
        });
      }
    }

    // If payout is being cancelled/rejected after being approved, refund the amount
    if ((status === 'cancelled' || status === 'failed') && previousStatus === 'processing') {
      user.dailyEarnings = (user.dailyEarnings || 0) + payout.amount;
      await user.save();
    }

    payout.status = status;
    payout.processedBy = req.user._id;
    payout.processedAt = new Date();
    
    if (status === 'failed' && failureReason) {
      payout.failureReason = failureReason;
    }

    await payout.save();

    res.json({
      success: true,
      data: payout
    });
  } catch (error) {
    console.error('Error updating payout status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payout status',
      message: error.message
    });
  }
};

// @desc    Update payout details (Admin only)
// @route   PUT /api/payouts/:id
// @access  Admin
exports.updatePayout = async (req, res) => {
  try {
    const { amount, payoutTime, paymentMethod, description, notes, transactionId } = req.body;
    
    const payout = await Payout.findById(req.params.id);
    
    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found'
      });
    }

    // Don't allow updates if payout is completed
    if (payout.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update completed payout'
      });
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }
      payout.amount = amount;
    }

    if (payoutTime) {
      payout.payoutTime = new Date(payoutTime);
    }

    if (paymentMethod) {
      payout.paymentMethod = paymentMethod;
    }

    if (description !== undefined) {
      payout.description = description;
    }

    if (notes !== undefined) {
      payout.notes = notes;
    }

    if (transactionId && transactionId !== payout.transactionId) {
      // Check if new transaction ID is unique
      const existing = await Payout.findOne({ transactionId });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Transaction ID already exists'
        });
      }
      payout.transactionId = transactionId;
    }

    await payout.save();

    res.json({
      success: true,
      data: payout
    });
  } catch (error) {
    console.error('Error updating payout:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payout',
      message: error.message
    });
  }
};

// @desc    Delete payout (Admin only)
// @route   DELETE /api/payouts/:id
// @access  Admin
exports.deletePayout = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    
    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'Payout not found'
      });
    }

    // Don't allow deletion of completed payouts
    if (payout.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete completed payout'
      });
    }

    await Payout.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Payout deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payout:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete payout',
      message: error.message
    });
  }
};

// @desc    Get payout statistics (Admin only)
// @route   GET /api/payouts/stats
// @access  Admin
exports.getPayoutStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.payoutTime = {};
      if (startDate) {
        query.payoutTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.payoutTime.$lte = new Date(endDate);
      }
    }

    const totalPayouts = await Payout.countDocuments(query);
    const totalAmount = await Payout.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const statusCounts = await Payout.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
    ]);

    const stats = {
      totalPayouts,
      totalAmount: totalAmount[0]?.total || 0,
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item._id] = {
          count: item.count,
          totalAmount: item.totalAmount
        };
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching payout stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payout statistics',
      message: error.message
    });
  }
};
