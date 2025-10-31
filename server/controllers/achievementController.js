const { Achievement, Goal, EmployeeEvent } = require('../models/Achievement');
const User = require('../models/User');

// ========== ACHIEVEMENTS ==========

// Get user's achievements
exports.getUserAchievements = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const achievements = await Achievement.find({ userId })
      .sort({ earnedDate: -1 });
    
    const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
    
    res.status(200).json({
      success: true,
      data: {
        achievements,
        totalPoints,
        count: achievements.length
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Award achievement to user
exports.awardAchievement = async (req, res) => {
  try {
    const { userId, type, title, description, icon, points } = req.body;
    
    const achievement = new Achievement({
      userId,
      type,
      title,
      description,
      icon: icon || '🏆',
      points: points || 10
    });
    
    await achievement.save();
    
    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    console.error('Error awarding achievement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Achievement.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
          achievementCount: { $sum: 1 }
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          department: '$user.department',
          profilePic: '$user.profilePic',
          totalPoints: 1,
          achievementCount: 1
        }
      }
    ]);
    
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== GOALS ==========

// Get user's goals
exports.getUserGoals = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const goals = await Goal.find({ userId })
      .sort({ createdAt: -1 });
    
    const stats = {
      total: goals.length,
      inProgress: goals.filter(g => g.status === 'in_progress').length,
      completed: goals.filter(g => g.status === 'completed').length,
      failed: goals.filter(g => g.status === 'failed').length
    };
    
    res.status(200).json({ success: true, data: { goals, stats } });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create goal
exports.createGoal = async (req, res) => {
  try {
    const goalData = {
      ...req.body,
      userId: req.user._id
    };
    
    const goal = new Goal(goalData);
    await goal.save();
    
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update goal progress
exports.updateGoalProgress = async (req, res) => {
  try {
    const { currentValue } = req.body;
    
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    
    goal.currentValue = currentValue;
    
    // Auto-complete if target reached
    if (currentValue >= goal.targetValue) {
      goal.status = 'completed';
      
      // Award achievement for completing goal
      await Achievement.create({
        userId: goal.userId,
        type: 'milestone',
        title: 'Goal Completed!',
        description: `Completed: ${goal.title}`,
        icon: '🎯',
        points: 50
      });
    }
    
    await goal.save();
    
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== EVENTS/CALENDAR ==========

// Get user's events
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;
    
    let query = {
      $or: [
        { userId: userId },
        { isCompanyWide: true }
      ]
    };
    
    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const events = await EmployeeEvent.find(query)
      .sort({ startDate: 1 });
    
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      userId: req.user._id
    };
    
    const event = new EmployeeEvent(eventData);
    await event.save();
    
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await EmployeeEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    await EmployeeEvent.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const achievements = await Achievement.find({ userId });
    const goals = await Goal.find({ userId });
    const upcomingEvents = await EmployeeEvent.find({
      $or: [{ userId }, { isCompanyWide: true }],
      startDate: { $gte: new Date() }
    }).limit(5).sort({ startDate: 1 });
    
    const stats = {
      totalPoints: achievements.reduce((sum, a) => sum + a.points, 0),
      achievementCount: achievements.length,
      activeGoals: goals.filter(g => g.status === 'in_progress').length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      upcomingEvents: upcomingEvents.length,
      recentAchievements: achievements.slice(0, 3)
    };
    
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

