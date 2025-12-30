const DayTodayCard = require('../models/DayTodayCard');
const DayTodayAttendance = require('../models/DayTodayAttendance');
const User = require('../models/User');

// Get all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await DayTodayCard.find({ isDeleted: { $ne: true } })
      .populate('employeeIds', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      cards
    });
  } catch (error) {
    console.error('Error fetching day today cards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cards'
    });
  }
};

// Get single card by ID
exports.getCardById = async (req, res) => {
  try {
    const card = await DayTodayCard.findById(req.params.id)
      .populate('employeeIds', 'name email')
      .populate('createdBy', 'name email');

    if (!card || card.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    res.json({
      success: true,
      card
    });
  } catch (error) {
    console.error('Error fetching day today card:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch card'
    });
  }
};

// Create new card
exports.createCard = async (req, res) => {
  try {
    const { title, description, year, employeeIds } = req.body;

    // Validate required fields
    if (!title || !description || !year || !employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, year, and at least one employee'
      });
    }

    // Validate year
    if (year < 2020 || year > 2100) {
      return res.status(400).json({
        success: false,
        error: 'Year must be between 2020 and 2100'
      });
    }

    // Validate employees exist
    const employees = await User.find({ _id: { $in: employeeIds }, isDeleted: { $ne: true } });
    if (employees.length !== employeeIds.length) {
      return res.status(400).json({
        success: false,
        error: 'One or more employees not found'
      });
    }

    const card = new DayTodayCard({
      title,
      description,
      year,
      employeeIds,
      createdBy: req.user._id
    });

    await card.save();
    await card.populate('employeeIds', 'name email');
    await card.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      card
    });
  } catch (error) {
    console.error('Error creating day today card:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create card'
    });
  }
};

// Update card
exports.updateCard = async (req, res) => {
  try {
    const { title, description, year, employeeIds } = req.body;
    const card = await DayTodayCard.findById(req.params.id);

    if (!card || card.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    // Update fields if provided
    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;
    if (year !== undefined) {
      if (year < 2020 || year > 2100) {
        return res.status(400).json({
          success: false,
          error: 'Year must be between 2020 and 2100'
        });
      }
      card.year = year;
    }
    if (employeeIds !== undefined) {
      if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one employee is required'
        });
      }
      // Validate employees exist
      const employees = await User.find({ _id: { $in: employeeIds }, isDeleted: { $ne: true } });
      if (employees.length !== employeeIds.length) {
        return res.status(400).json({
          success: false,
          error: 'One or more employees not found'
        });
      }
      card.employeeIds = employeeIds;
    }

    await card.save();
    await card.populate('employeeIds', 'name email');
    await card.populate('createdBy', 'name email');

    res.json({
      success: true,
      card
    });
  } catch (error) {
    console.error('Error updating day today card:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update card'
    });
  }
};

// Delete card (soft delete)
exports.deleteCard = async (req, res) => {
  try {
    const card = await DayTodayCard.findById(req.params.id);

    if (!card || card.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    // Soft delete
    card.isDeleted = true;
    card.deletedAt = new Date();
    await card.save();

    // Also delete all attendance records for this card
    await DayTodayAttendance.deleteMany({ card: card._id });

    res.json({
      success: true,
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting day today card:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete card'
    });
  }
};

// Get attendance data for a card
exports.getAttendance = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { userId, startDate, endDate } = req.query;

    // Verify card exists
    const card = await DayTodayCard.findById(cardId);
    if (!card || card.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    // Build query
    const query = { card: cardId };
    if (userId) {
      query.user = userId;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await DayTodayAttendance.find(query)
      .populate('user', 'name email')
      .populate('createdBy', 'name email')
      .sort({ date: 1, user: 1 });

    // Format response as object for easier frontend use
    const attendanceMap = {};
    attendance.forEach(record => {
      const dateKey = new Date(record.date).toISOString().split('T')[0];
      const key = `${record.user._id}_${dateKey}`;
      attendanceMap[key] = record.status;
    });

    res.json({
      success: true,
      attendance: attendanceMap,
      records: attendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch attendance'
    });
  }
};

// Update attendance (create or update)
exports.updateAttendance = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { userId, date, status } = req.body;

    // Validate required fields
    if (!userId || !date || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, date, and status'
      });
    }

    if (!['worked', 'not_worked'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "worked" or "not_worked"'
      });
    }

    // Verify card exists
    const card = await DayTodayCard.findById(cardId);
    if (!card || card.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    // Verify user is in card's employee list
    if (!card.employeeIds.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'User is not assigned to this card'
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Parse date
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    // Check if attendance record exists
    let attendance = await DayTodayAttendance.findOne({
      card: cardId,
      user: userId,
      date: attendanceDate
    });

    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.updatedBy = req.user._id;
      await attendance.save();
    } else {
      // Create new record
      attendance = new DayTodayAttendance({
        card: cardId,
        user: userId,
        date: attendanceDate,
        status,
        createdBy: req.user._id
      });
      await attendance.save();
    }

    await attendance.populate('user', 'name email');

    res.json({
      success: true,
      attendance
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Attendance record already exists for this date'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update attendance'
    });
  }
};

// Delete attendance record by ID
exports.deleteAttendance = async (req, res) => {
  try {
    const { cardId, attendanceId } = req.params;

    const attendance = await DayTodayAttendance.findOne({
      _id: attendanceId,
      card: cardId
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    await DayTodayAttendance.deleteOne({ _id: attendanceId });

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete attendance record'
    });
  }
};

// Delete attendance record by userId and date
exports.deleteAttendanceByUserAndDate = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { userId, date } = req.body;

    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and date'
      });
    }

    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    const attendance = await DayTodayAttendance.findOneAndDelete({
      card: cardId,
      user: userId,
      date: attendanceDate
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete attendance record'
    });
  }
};

// Bulk update attendance
exports.bulkUpdateAttendance = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { attendanceData } = req.body; // Array of { userId, date, status }

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'attendanceData must be a non-empty array'
      });
    }

    // Verify card exists
    const card = await DayTodayCard.findById(cardId);
    if (!card || card.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    const results = [];
    const errors = [];

    for (const item of attendanceData) {
      try {
        const { userId, date, status } = item;

        if (!userId || !date || !status) {
          errors.push({ item, error: 'Missing required fields' });
          continue;
        }

        if (!['worked', 'not_worked'].includes(status)) {
          errors.push({ item, error: 'Invalid status' });
          continue;
        }

        // Verify user is in card's employee list
        if (!card.employeeIds.includes(userId)) {
          errors.push({ item, error: 'User not assigned to card' });
          continue;
        }

        const attendanceDate = new Date(date);
        if (isNaN(attendanceDate.getTime())) {
          errors.push({ item, error: 'Invalid date' });
          continue;
        }

        // Update or create attendance record
        const attendance = await DayTodayAttendance.findOneAndUpdate(
          {
            card: cardId,
            user: userId,
            date: attendanceDate
          },
          {
            card: cardId,
            user: userId,
            date: attendanceDate,
            status,
            updatedBy: req.user._id,
            $setOnInsert: { createdBy: req.user._id }
          },
          {
            upsert: true,
            new: true
          }
        );

        results.push(attendance);
      } catch (error) {
        errors.push({ item, error: error.message });
      }
    }

    res.json({
      success: true,
      updated: results.length,
      errors: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error bulk updating attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update attendance'
    });
  }
};

