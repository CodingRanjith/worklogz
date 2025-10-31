const DailySalaryConfig = require('../models/DailySalaryConfig');
const User = require('../models/User');

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

      // Update users
      const result = await User.updateMany(
        {
          ...query,
          $or: [
            { lastDailyCreditDate: { $lt: today } },
            { lastDailyCreditDate: null }
          ]
        },
        {
          $inc: { dailyEarnings: config.amount },
          $set: { lastDailyCreditDate: today }
        }
      );

      updatedUsersCount += result.modifiedCount;

      // Update last applied date for this config
      config.lastAppliedDate = today;
      await config.save();

      updates.push({
        configName: config.name,
        amount: config.amount,
        usersUpdated: result.modifiedCount
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

    // Calculate weekly and monthly earnings based on actual daily rate
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Count days with credits this week
    const daysThisWeek = Math.floor((today - startOfWeek) / (1000 * 60 * 60 * 24)) + 1;
    
    // Count days with credits this month
    const daysThisMonth = Math.floor((today - startOfMonth) / (1000 * 60 * 60 * 24)) + 1;

    res.status(200).json({ 
      success: true, 
      data: {
        ...user.toObject(),
        dailyRate: dailyRate,
        weeklyEarnings: dailyRate * daysThisWeek,
        monthlyEarnings: dailyRate * daysThisMonth,
        applicableConfigs: applicableConfigs,
        daysThisWeek: daysThisWeek,
        daysThisMonth: daysThisMonth
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

