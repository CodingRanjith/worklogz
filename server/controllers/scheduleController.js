
const Schedule = require('../models/Schedule');

const scheduleController = {
 getAllSchedules: async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate({
        path: 'user',
        select: 'name email role company position',
        match: { role: 'employee' }  // Only populate if user role is employee
      });

    // Filter out schedules where populate didn't find a matching user
    const filteredSchedules = schedules.filter(schedule => schedule.user !== null);

    res.json(filteredSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}
,

  updateUserSchedule: async (req, res) => {
    try {
      const updatedSchedule = await Schedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedSchedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  },

  createUserSchedule: async (req, res) => {
    try {
      const { userId, weeklySchedule, salary } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Create or update schedule
      const schedule = await Schedule.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          weeklySchedule: weeklySchedule || {},
          salary: salary || 0
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).populate('user', 'name email role company position employeeId');

      res.json(schedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  },
};

module.exports = scheduleController;
