const Trainer = require('../models/Trainer');

// Get all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const trainers = await Trainer.find(query).sort({ createdAt: -1 });
    res.status(200).json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'Failed to fetch trainers', message: error.message });
  }
};

// Get single trainer by ID
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    
    res.status(200).json(trainer);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).json({ error: 'Failed to fetch trainer', message: error.message });
  }
};

// Create new trainer
exports.createTrainer = async (req, res) => {
  try {
    const { name, email, phone, alternativePhone, courses, companyLeadSharePercentage, trainerLeadSharePercentage, availableTimings } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }
    
    // Validate share percentages
    if (companyLeadSharePercentage === undefined || companyLeadSharePercentage === null) {
      return res.status(400).json({ error: 'Company lead share percentage is required' });
    }
    if (companyLeadSharePercentage < 0 || companyLeadSharePercentage > 100) {
      return res.status(400).json({ error: 'Company lead share percentage must be between 0 and 100' });
    }
    if (trainerLeadSharePercentage === undefined || trainerLeadSharePercentage === null) {
      return res.status(400).json({ error: 'Trainer lead share percentage is required' });
    }
    if (trainerLeadSharePercentage < 0 || trainerLeadSharePercentage > 100) {
      return res.status(400).json({ error: 'Trainer lead share percentage must be between 0 and 100' });
    }
    
    // Check if trainer with email already exists
    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({ error: 'Trainer with this email already exists' });
    }
    
    // Prepare availableTimings with default structure if not provided
    const defaultTimings = [
      { day: 'Monday', isAvailable: false, timeSlots: [] },
      { day: 'Tuesday', isAvailable: false, timeSlots: [] },
      { day: 'Wednesday', isAvailable: false, timeSlots: [] },
      { day: 'Thursday', isAvailable: false, timeSlots: [] },
      { day: 'Friday', isAvailable: false, timeSlots: [] },
      { day: 'Saturday', isAvailable: false, timeSlots: [] },
      { day: 'Sunday', isAvailable: false, timeSlots: [] }
    ];
    
    const timings = availableTimings && Array.isArray(availableTimings) 
      ? availableTimings.map(dayTiming => {
          const defaultDay = defaultTimings.find(d => d.day === dayTiming.day);
          return {
            day: dayTiming.day,
            isAvailable: dayTiming.isAvailable || false,
            timeSlots: dayTiming.timeSlots || []
          };
        })
      : defaultTimings;
    
    const trainer = new Trainer({
      name,
      email,
      phone,
      alternativePhone: alternativePhone || undefined,
      courses: courses && Array.isArray(courses) ? courses.map(c => {
        if (typeof c === 'string') {
          return { name: c.trim(), amount: 0, leadSource: 'company' };
        }
        return {
          name: c.name ? c.name.trim() : '',
          amount: c.amount || 0,
          leadSource: c.leadSource || 'company'
        };
      }).filter(c => c.name) : [],
      companyLeadSharePercentage: companyLeadSharePercentage || 0,
      trainerLeadSharePercentage: trainerLeadSharePercentage || 0,
      availableTimings: timings
    });
    
    await trainer.save();
    res.status(201).json(trainer);
  } catch (error) {
    console.error('Error creating trainer:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Trainer with this email already exists' });
    }
    res.status(500).json({ error: 'Failed to create trainer', message: error.message });
  }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
  try {
    const { name, email, phone, alternativePhone, courses, companyLeadSharePercentage, trainerLeadSharePercentage, trainerSharePercentage, availableTimings, isActive } = req.body;
    
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    
    // Check if email is being changed and if new email already exists
    if (email && email !== trainer.email) {
      const existingTrainer = await Trainer.findOne({ email });
      if (existingTrainer) {
        return res.status(400).json({ error: 'Trainer with this email already exists' });
      }
      trainer.email = email;
    }
    
    if (name !== undefined) trainer.name = name;
    if (phone !== undefined) trainer.phone = phone;
    if (alternativePhone !== undefined) trainer.alternativePhone = alternativePhone || undefined;
    if (courses !== undefined) {
      trainer.courses = Array.isArray(courses) ? courses.map(c => {
        if (typeof c === 'string') {
          return { name: c.trim(), amount: 0, leadSource: 'company' };
        }
        return {
          name: c.name ? c.name.trim() : '',
          amount: c.amount || 0,
          leadSource: c.leadSource || 'company'
        };
      }).filter(c => c.name) : [];
    }
    if (companyLeadSharePercentage !== undefined) {
      if (companyLeadSharePercentage < 0 || companyLeadSharePercentage > 100) {
        return res.status(400).json({ error: 'Company lead share percentage must be between 0 and 100' });
      }
      trainer.companyLeadSharePercentage = companyLeadSharePercentage;
    }
    if (trainerLeadSharePercentage !== undefined) {
      if (trainerLeadSharePercentage < 0 || trainerLeadSharePercentage > 100) {
        return res.status(400).json({ error: 'Trainer lead share percentage must be between 0 and 100' });
      }
      trainer.trainerLeadSharePercentage = trainerLeadSharePercentage;
    }
    if (isActive !== undefined) trainer.isActive = isActive;
    
    if (availableTimings !== undefined && Array.isArray(availableTimings)) {
      trainer.availableTimings = availableTimings.map(dayTiming => ({
        day: dayTiming.day,
        isAvailable: dayTiming.isAvailable || false,
        timeSlots: dayTiming.timeSlots || []
      }));
    }
    
    await trainer.save();
    res.status(200).json(trainer);
  } catch (error) {
    console.error('Error updating trainer:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Trainer with this email already exists' });
    }
    res.status(500).json({ error: 'Failed to update trainer', message: error.message });
  }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    
    await Trainer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'Failed to delete trainer', message: error.message });
  }
};

