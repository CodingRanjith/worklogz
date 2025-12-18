// -----------------------------
// 📁 controllers/userController.js
// -----------------------------
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Task = require('../models/Task');
const WorkCard = require('../models/WorkCard');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const CRMLead = require('../models/CRMLead');
const DailyEarningTransaction = require('../models/DailyEarningTransaction');
const SalaryHistory = require('../models/SalaryHistory');
const Payslip = require('../models/Payslip');


const EMPLOYEE_ID_PREFIX = 'THC';

const parseEmployeeNumber = (value = '') => {
  if (!value) return 0;
  const digits = value.toString().replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
};

const formatEmployeeIdFromNumber = (value) => {
  const safeNumber = Number.isFinite(value) && value > 0 ? value : 1;
  return `${EMPLOYEE_ID_PREFIX}${safeNumber.toString().padStart(3, '0')}`;
};

const getNextEmployeeIdValue = async () => {
  const users = await User.find(
    { employeeId: { $exists: true, $ne: null, $ne: '' } },
    'employeeId'
  ).lean();

  const maxNumeric = users.reduce((max, user) => {
    const numeric = parseEmployeeNumber(user.employeeId);
    return numeric > max ? numeric : max;
  }, 0);

  return formatEmployeeIdFromNumber(maxNumeric + 1);
};

const sanitizeArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim());
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const sanitizeBankDetails = (details) => {
  if (!details || typeof details !== 'object') return undefined;
  const allowedKeys = ['bankingName', 'bankAccountNumber', 'ifscCode', 'upiId'];
  const sanitized = {};

  allowedKeys.forEach((key) => {
    if (details[key]) {
      sanitized[key] = details[key];
    }
  });

  return Object.keys(sanitized).length ? sanitized : undefined;
};

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find( { name: { $ne: "Admin" } },{
         
        name: 1,
        email: 1,
        role: 1,
        phone: 1,
        position: 1,
        company: 1,
        employeeId: 1,
        salary: 1,
        department: 1,
        qualification: 1,
        dateOfJoining: 1,
        isActive: 1,
        profilePic: 1,
        skills: 1,
        rolesAndResponsibility: 1,
        bankDetails: 1,
        createdAt: 1,
        updatedAt: 1
      }).sort({name: 1});

      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  createUser: async (req, res) => {
    try {
      const requiredFields = ['name', 'email', 'password', 'phone', 'position', 'company'];
      const missingField = requiredFields.find((field) => !req.body[field]);

      if (missingField) {
        return res.status(400).json({ error: `${missingField} is required` });
      }

      const normalizedEmail = req.body.email.toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const providedEmployeeId = req.body.employeeId?.toString().trim();
      const employeeId = providedEmployeeId || (await getNextEmployeeIdValue());

      const payload = {
        name: req.body.name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: req.body.phone,
        position: req.body.position,
        company: req.body.company,
        employeeId,
        role: req.body.role || 'employee',
        salary: Number.isNaN(Number(req.body.salary)) ? 0 : Number(req.body.salary),
        department: req.body.department,
        qualification: req.body.qualification,
        dateOfJoining: req.body.dateOfJoining ? new Date(req.body.dateOfJoining) : undefined,
        profilePic: req.body.profilePic,
        skills: sanitizeArrayField(req.body.skills),
        rolesAndResponsibility: sanitizeArrayField(req.body.rolesAndResponsibility),
        bankDetails: sanitizeBankDetails(req.body.bankDetails)
      };

      const newUser = await User.create(payload);
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({ message: 'User created successfully', user: userResponse });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  getSingleUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getLoggedInUser: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateMyProfile: async (req, res) => {
    try {
      const allowedFields = [
        'name',
        'email',
        'phone',
        'position',
        'company',
        'department',
        'location',
        'gender',
        'maritalStatus',
        'employeeId'
      ];

      const updateData = {};

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      if (req.body.dateOfBirth) {
        updateData.dateOfBirth = new Date(req.body.dateOfBirth);
      }

      // Handle password update if provided
      if (req.body.currentPassword && req.body.newPassword) {
        // Get the current user with password
        const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Validate new password length
        if (req.body.newPassword.length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Hash and set new password
        updateData.password = await bcrypt.hash(req.body.newPassword, 10);
      } else if (req.body.newPassword || req.body.currentPassword) {
        // If only one password field is provided, return error
        return res.status(400).json({ error: 'Both current password and new password are required to change password' });
      }

      if (req.file) {
        updateData.profilePic = req.file.path;
      } else if (req.body.profilePic) {
        updateData.profilePic = req.body.profilePic;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No profile fields provided' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      ).select('-password');

      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateUser: async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      position,
      company,
      employeeId,
      location,
      gender,
      maritalStatus,
      salary,
      department,
      qualification,
      dateOfJoining,
      dateOfBirth,
      skills,
      rolesAndResponsibility,
      profilePic,
      bankDetails
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (position) updateData.position = position;
    if (company) updateData.company = company;
    if (employeeId !== undefined) updateData.employeeId = employeeId;
    if (location) updateData.location = location;
    if (gender) updateData.gender = gender;
    if (maritalStatus) updateData.maritalStatus = maritalStatus;
    if (salary !== undefined) updateData.salary = salary;
    if (department) updateData.department = department;
    if (qualification) updateData.qualification = qualification;
    if (profilePic) updateData.profilePic = profilePic;
    if (Array.isArray(skills)) updateData.skills = skills;
    if (Array.isArray(rolesAndResponsibility)) updateData.rolesAndResponsibility = rolesAndResponsibility;
    if (bankDetails && typeof bankDetails === 'object') updateData.bankDetails = bankDetails;
    if (dateOfJoining) updateData.dateOfJoining = new Date(dateOfJoining);
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
},

  updateSalary: async (req, res) => {
    try {
      const { salary } = req.body;
      if (!salary || isNaN(salary)) return res.status(400).json({ error: 'Invalid salary value' });

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { salary },
        { new: true }
      ).select('-password');

      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.json({ message: 'Salary updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating salary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await Promise.all([
        Task.deleteMany({ user: id }),
        WorkCard.deleteMany({ createdBy: id }),
        Schedule.deleteOne({ user: id }),
        Attendance.deleteMany({ user: id }),
        LeaveRequest.deleteMany({ user: id }),
        CRMLead.deleteMany({ createdBy: id }),
        CRMLead.updateMany({ leadOwner: id }, { $set: { leadOwner: null } }),
        CRMLead.updateMany({ assignedUsers: id }, { $pull: { assignedUsers: id } }),
      ]);

      await User.findByIdAndDelete(id);

      res.json({ message: 'User and related data deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },

  getNextEmployeeId: async (req, res) => {
    try {
      const nextId = await getNextEmployeeIdValue();
      res.json({ employeeId: nextId });
    } catch (error) {
      console.error('Error generating employee ID:', error);
      res.status(500).json({ error: 'Failed to generate employee ID' });
    }
  },

  assignMissingEmployeeIds: async (req, res) => {
    try {
      const usersWithoutId = await User.find({
        $or: [
          { employeeId: { $exists: false } },
          { employeeId: null },
          { employeeId: '' },
          { employeeId: 'N/A' }
        ],
        name: { $ne: 'Admin' }
      });

      let assignedCount = 0;
      for (const user of usersWithoutId) {
        try {
          const nextId = await getNextEmployeeIdValue();
          await User.findByIdAndUpdate(user._id, { employeeId: nextId });
          assignedCount++;
        } catch (error) {
          console.error(`Error assigning employee ID to user ${user._id}:`, error);
        }
      }

      res.json({ 
        message: `Assigned employee IDs to ${assignedCount} users`,
        assignedCount 
      });
    } catch (error) {
      console.error('Error assigning employee IDs:', error);
      res.status(500).json({ error: 'Failed to assign employee IDs' });
    }
  },

  getEmployeesForAttendance: async (req, res) => {
    try {
      const users = await User.find({ role: 'employee' }, '_id name email role');
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get sidebar access for a user
  getSidebarAccess: async (req, res) => {
    try {
      const { id } = req.params;
      const { scope = 'admin' } = req.query;
      
      const user = await User.findById(id).select('sidebarAccess');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const access = user.sidebarAccess?.[scope] || [];
      res.json({ userId: id, scope, paths: access });
    } catch (error) {
      console.error('Error fetching sidebar access:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update sidebar access for a user
  updateSidebarAccess: async (req, res) => {
    try {
      const { id } = req.params;
      const { paths, scope = 'admin' } = req.body;

      if (!Array.isArray(paths)) {
        return res.status(400).json({ error: 'Paths must be an array' });
      }

      if (!['admin', 'employee'].includes(scope)) {
        return res.status(400).json({ error: 'Scope must be "admin" or "employee"' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Initialize sidebarAccess if it doesn't exist
      if (!user.sidebarAccess) {
        user.sidebarAccess = { admin: [], employee: [] };
      }

      // Update the specific scope
      user.sidebarAccess[scope] = paths;
      await user.save();

      res.json({ 
        message: 'Sidebar access updated successfully', 
        userId: id, 
        scope, 
        paths: user.sidebarAccess[scope] 
      });
    } catch (error) {
      console.error('Error updating sidebar access:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get sidebar access for multiple users (bulk)
  getBulkSidebarAccess: async (req, res) => {
    try {
      const { userIds } = req.query;
      const { scope = 'admin' } = req.query;

      if (!userIds) {
        return res.status(400).json({ error: 'userIds query parameter is required' });
      }

      const ids = Array.isArray(userIds) ? userIds : userIds.split(',');
      
      const users = await User.find(
        { _id: { $in: ids } },
        '_id sidebarAccess'
      );

      const accessMap = {};
      users.forEach((user) => {
        accessMap[user._id.toString()] = user.sidebarAccess?.[scope] || [];
      });

      res.json({ scope, accessMap });
    } catch (error) {
      console.error('Error fetching bulk sidebar access:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update sidebar access for multiple users (bulk)
  updateBulkSidebarAccess: async (req, res) => {
    try {
      const { userIds, paths, scope = 'admin' } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'userIds must be a non-empty array' });
      }

      if (!Array.isArray(paths)) {
        return res.status(400).json({ error: 'Paths must be an array' });
      }

      if (!['admin', 'employee'].includes(scope)) {
        return res.status(400).json({ error: 'Scope must be "admin" or "employee"' });
      }

      const users = await User.find({ _id: { $in: userIds } });
      
      if (users.length !== userIds.length) {
        return res.status(400).json({ error: 'Some users were not found' });
      }

      // Update all users
      const updatePromises = users.map((user) => {
        if (!user.sidebarAccess) {
          user.sidebarAccess = { admin: [], employee: [] };
        }
        user.sidebarAccess[scope] = paths;
        return user.save();
      });

      await Promise.all(updatePromises);

      res.json({ 
        message: 'Sidebar access updated successfully for all users', 
        userIds, 
        scope, 
        paths 
      });
    } catch (error) {
      console.error('Error updating bulk sidebar access:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

};

module.exports = userController;
