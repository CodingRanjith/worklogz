const Plan = require('../models/Plan');

// Get all plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get active plans only
exports.getActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single plan
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create plan (admin only)
exports.createPlan = async (req, res) => {
  try {
    const { name, description, price, period, features, isActive } = req.body;
    
    const plan = new Plan({
      name,
      description,
      price,
      period: period || 'month',
      features: features || [],
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id
    });

    await plan.save();
    res.status(201).json({
      success: true,
      plan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update plan (admin only)
exports.updatePlan = async (req, res) => {
  try {
    const { name, description, price, period, features, isActive } = req.body;
    
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (period) plan.period = period;
    if (features) plan.features = features;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete plan (admin only)
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    await plan.deleteOne();
    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Toggle plan status (admin only)
exports.togglePlanStatus = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    plan.isActive = !plan.isActive;
    await plan.save();
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

