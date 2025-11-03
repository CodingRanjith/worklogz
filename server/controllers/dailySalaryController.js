const mongoose = require('mongoose');
const DailySalaryConfig = require('../models/DailySalaryConfig');
const User = require('../models/User');
const DailyEarningTransaction = require('../models/DailyEarningTransaction');
const SalaryHistory = require('../models/SalaryHistory');

// Create a new daily salary configuration
exports.createDailySalaryConfig = async (req, res) => {
  try {
    const { name, amount, description, appliesTo, departments, users, startDate, endDate, autoApply } = req.body;

    const config = new DailySalaryConfig({
      name,
      amount,
      description,
      appliesTo,
      departments,
      users,
      startDate,
      endDate,
      autoApply,
      createdBy: req.user._id
    });

    await config.save();
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    console.error('Error creating daily salary config:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all daily salary configurations
exports.getAllDailySalaryConfigs = async (req, res) => {
  try {
    const configs = await DailySalaryConfig.find()
      .populate('createdBy', 'name email')
      .populate('users', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: configs });
  } catch (error) {
    console.error('Error fetching daily salary configs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single daily salary configuration by ID
exports.getDailySalaryConfigById = async (req, res) => {
  try {
    const config = await DailySalaryConfig.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('users', 'name email department');

    if (!config) {
      return res.status(404).json({ success: false, message: 'Configuration not found' });
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    console.error('Error fetching daily salary config:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a daily salary configuration
exports.updateDailySalaryConfig = async (req, res) => {
  try {
    const { name, amount, description, isActive, appliesTo, departments, users, startDate, endDate, autoApply } = req.body;

    const config = await DailySalaryConfig.findByIdAndUpdate(
      req.params.id,
      {
        name,
        amount,
        description,
        isActive,
        appliesTo,
        departments,
        users,
        startDate,
        endDate,
        autoApply
      },
      { new: true, runValidators: true }
    );

    if (!config) {
      return res.status(404).json({ success: false, message: 'Configuration not found' });
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    console.error('Error updating daily salary config:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a daily salary configuration
exports.deleteDailySalaryConfig = async (req, res) => {
  try {
    const config = await DailySalaryConfig.findByIdAndDelete(req.params.id);

    if (!config) {
      return res.status(404).json({ success: false, message: 'Configuration not found' });
    }

    res.status(200).json({ success: true, message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily salary config:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle active status
exports.toggleConfigStatus = async (req, res) => {
  try {
    const config = await DailySalaryConfig.findById(req.params.id);

    if (!config) {
      return res.status(404).json({ success: false, message: 'Configuration not found' });
    }

    config.isActive = !config.isActive;
    await config.save();

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    console.error('Error toggling config status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply daily credits manually
exports.applyDailyCreditsManually = async (req, res) => {
  try {
    const result = await applyDailyCredits();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error applying daily credits:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to apply daily credits (can be called by cron job)
const applyDailyCredits = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active configurations
    const activeConfigs = await DailySalaryConfig.find({
      isActive: true,
      autoApply: true,
      startDate: { $lte: today },
      $or: [
        { endDate: null },
        { endDate: { $gte: today } }
      ]
    });

    let updatedUsersCount = 0;
    const updates = [];

    for (const config of activeConfigs) {
      // Check if already applied today
      if (config.lastAppliedDate) {
        const lastApplied = new Date(config.lastAppliedDate);
        lastApplied.setHours(0, 0, 0, 0);
        if (lastApplied.getTime() === today.getTime()) {
          continue; // Already applied today
        }
      }

      let query = { isActive: true };

      // Apply based on configuration type
      if (config.appliesTo === 'specific_departments' && config.departments.length > 0) {
        query.department = { $in: config.departments };
      } else if (config.appliesTo === 'specific_users' && config.users.length > 0) {
        query._id = { $in: config.users };
      }

      // Find users to update (avoid duplicates from today)
      const users = await User.find({
        ...query,
        $or: [
          { lastDailyCreditDate: { $lt: today } },
          { lastDailyCreditDate: null }
        ]
      });

      // Create transaction and update user for each user
      for (const user of users) {
        // Create transaction record
        await DailyEarningTransaction.create({
          userId: user._id,
          amount: config.amount,
          date: today,
          configsApplied: [{
            configId: config._id,
            configName: config.name,
            amount: config.amount
          }]
        });

        // Update user total
        user.dailyEarnings = (user.dailyEarnings || 0) + config.amount;
        user.lastDailyCreditDate = today;
        await user.save();

        updatedUsersCount++;
      }

      // Update last applied date for this config
      config.lastAppliedDate = today;
      await config.save();

      updates.push({
        configName: config.name,
        amount: config.amount,
        usersUpdated: users.length
      });
    }

    return {
      message: 'Daily credits applied successfully',
      totalUsersUpdated: updatedUsersCount,
      details: updates,
      appliedAt: new Date()
    };
  } catch (error) {
    console.error('Error in applyDailyCredits:', error);
    throw error;
  }
};

// Get user's daily earnings with active config details
exports.getUserDailyEarnings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId).select('name email dailyEarnings lastDailyCreditDate department');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find active configurations that apply to this user
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeConfigs = await DailySalaryConfig.find({
      isActive: true,
      startDate: { $lte: today },
      $or: [
        { endDate: null },
        { endDate: { $gte: today } }
      ]
    });

    // Calculate applicable daily rate for this user
    let dailyRate = 0;
    const applicableConfigs = [];

    for (const config of activeConfigs) {
      let applies = false;

      if (config.appliesTo === 'all') {
        applies = true;
      } else if (config.appliesTo === 'specific_departments' && config.departments.includes(user.department)) {
        applies = true;
      } else if (config.appliesTo === 'specific_users' && config.users.some(u => u.toString() === userId.toString())) {
        applies = true;
      }

      if (applies) {
        dailyRate += config.amount;
        applicableConfigs.push({
          name: config.name,
          amount: config.amount,
          description: config.description
        });
      }
    }

    // Calculate date ranges
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get TODAY'S actual transaction
    const todayTransaction = await DailyEarningTransaction.findOne({
      userId: userId,
      date: { $gte: today, $lte: endOfToday }
    });

    // Get THIS WEEK's total (sum of all transactions)
    const weekTransactions = await DailyEarningTransaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfWeek, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get THIS MONTH's total (sum of all transactions)
    const monthTransactions = await DailyEarningTransaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const todayEarnings = todayTransaction ? todayTransaction.amount : 0;
    const weeklyEarnings = weekTransactions.length > 0 ? weekTransactions[0].total : 0;
    const monthlyEarnings = monthTransactions.length > 0 ? monthTransactions[0].total : 0;

    res.status(200).json({ 
      success: true, 
      data: {
        ...user.toObject(),
        dailyRate: dailyRate,
        todayEarnings: todayEarnings,
        weeklyEarnings: weeklyEarnings,
        monthlyEarnings: monthlyEarnings,
        applicableConfigs: applicableConfigs
      }
    });
  } catch (error) {
    console.error('Error fetching user earnings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get statistics
exports.getDailySalaryStats = async (req, res) => {
  try {
    const totalConfigs = await DailySalaryConfig.countDocuments();
    const activeConfigs = await DailySalaryConfig.countDocuments({ isActive: true });
    
    const totalUsersWithEarnings = await User.countDocuments({ dailyEarnings: { $gt: 0 } });
    
    const totalEarningsResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$dailyEarnings' } } }
    ]);
    
    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalConfigs,
        activeConfigs,
        totalUsersWithEarnings,
        totalEarnings
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset user's daily earnings (admin only)
exports.resetUserDailyEarnings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { dailyEarnings: 0, lastDailyCreditDate: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User earnings reset successfully', data: user });
  } catch (error) {
    console.error('Error resetting user earnings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Manual credit to user (admin only)
exports.manualCredit = async (req, res) => {
  try {
    const { userId, amount, date, description } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ success: false, message: 'User ID and amount are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const creditDate = date ? new Date(date) : new Date();
    creditDate.setHours(0, 0, 0, 0);

    // Create transaction record
    await DailyEarningTransaction.create({
      userId: userId,
      amount: parseFloat(amount),
      date: creditDate,
      configsApplied: [{
        configName: 'Manual Credit by Admin',
        amount: parseFloat(amount),
        description: description || 'Manual credit'
      }]
    });

    // Update user total
    user.dailyEarnings = (user.dailyEarnings || 0) + parseFloat(amount);
    user.lastDailyCreditDate = creditDate;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Credit added successfully',
      data: {
        amount: parseFloat(amount),
        newTotal: user.dailyEarnings
      }
    });
  } catch (error) {
    console.error('Error adding manual credit:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user salary and track history (admin only)
exports.updateUserSalary = async (req, res) => {
  try {
    const { userId, salary, notes } = req.body;

    if (!userId || salary === undefined) {
      return res.status(400).json({ success: false, message: 'User ID and salary are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const oldSalary = user.salary || 0;
    const newSalary = parseFloat(salary);

    // Determine change type
    let changeType = 'Manual Adjustment';
    if (oldSalary === 0) {
      changeType = 'Initial Setup';
    } else if (newSalary > oldSalary) {
      changeType = 'Salary Increase';
    } else if (newSalary < oldSalary) {
      changeType = 'Salary Decrease';
    }

    // Create salary history record
    await SalaryHistory.create({
      user: userId,
      oldSalary: oldSalary,
      newSalary: newSalary,
      changedBy: req.user._id,
      changeType: changeType,
      notes: notes || '',
      effectiveDate: new Date()
    });

    // Update user salary
    user.salary = newSalary;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Salary updated successfully',
      data: {
        oldSalary: oldSalary,
        newSalary: newSalary,
        changeType: changeType
      }
    });
  } catch (error) {
    console.error('Error updating salary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get salary history for a user (admin)
exports.getUserSalaryHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await SalaryHistory.find({ user: userId })
      .populate('changedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: history
    });
  } catch (error) {
    console.error('Error fetching salary history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get own salary history (employee)
exports.getMySalaryHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await SalaryHistory.find({ user: userId })
      .populate('changedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: history
    });
  } catch (error) {
    console.error('Error fetching salary history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get credit history for user (admin)
exports.getUserCreditHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const credits = await DailyEarningTransaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(100);

    res.status(200).json({ 
      success: true, 
      data: credits
    });
  } catch (error) {
    console.error('Error fetching credit history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get own credit history (employee)
exports.getMyCreditHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const credits = await DailyEarningTransaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(100);

    res.status(200).json({ 
      success: true, 
      data: credits
    });
  } catch (error) {
    console.error('Error fetching credit history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit credit transaction (admin only)
exports.editCreditTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { amount, date, description } = req.body;

    const transaction = await DailyEarningTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const oldAmount = transaction.amount;
    const newAmount = parseFloat(amount);

    // Update transaction
    transaction.amount = newAmount;
    if (date) transaction.date = new Date(date);
    if (description) {
      transaction.configsApplied[0].description = description;
    }
    await transaction.save();

    // Update user's total earnings
    const user = await User.findById(transaction.userId);
    if (user) {
      user.dailyEarnings = (user.dailyEarnings || 0) - oldAmount + newAmount;
      await user.save();
    }

    res.status(200).json({ 
      success: true, 
      message: 'Credit updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error editing credit:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete credit transaction (admin only)
exports.deleteCreditTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await DailyEarningTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Update user's total earnings
    const user = await User.findById(transaction.userId);
    if (user) {
      user.dailyEarnings = (user.dailyEarnings || 0) - transaction.amount;
      await user.save();
    }

    await DailyEarningTransaction.findByIdAndDelete(transactionId);

    res.status(200).json({ 
      success: true, 
      message: 'Credit deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting credit:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

