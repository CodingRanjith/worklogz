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
const CompanySettings = require('../models/CompanySettings');

const parseEmployeeNumber = (value = '') => {
  if (!value) return 0;
  const digits = value.toString().replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
};

const getEmployeeIdPrefix = async () => {
  try {
    const settings = await CompanySettings.findOne();
    return settings?.employeeIdPrefix || 'EMP';
  } catch (error) {
    console.error('Error fetching employee ID prefix from company settings:', error);
    return 'EMP'; // Fallback to default
  }
};

const formatEmployeeIdFromNumber = async (value) => {
  const safeNumber = Number.isFinite(value) && value > 0 ? value : 1;
  const prefix = await getEmployeeIdPrefix();
  return `${prefix}${safeNumber.toString().padStart(3, '0')}`;
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

  return await formatEmployeeIdFromNumber(maxNumeric + 1);
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
      // Exclude archived users by default
      const users = await User.find( { name: { $ne: "Admin" }, isDeleted: { $ne: true } },{
         
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
        adminAccess: req.body.adminAccess === true || req.body.adminAccess === 'true',
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
      const requestingUserId = req.user._id.toString();
      const requestedUserId = req.params.id;
      const isAdmin = req.user.role === 'admin' || req.user.role === 'master-admin' || req.user.adminAccess === true;

      // Allow access if: user is accessing their own data OR user is an admin
      if (requestingUserId !== requestedUserId && !isAdmin) {
        return res.status(403).json({ 
          error: 'Forbidden - You can only access your own profile' 
        });
      }

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
      const requestingUserId = req.user._id.toString();
      const requestedUserId = req.params.id;
      const isAdmin = req.user.role === 'admin' || req.user.role === 'master-admin' || req.user.adminAccess === true;

      // Allow access if: user is updating their own data OR user is an admin
      if (requestingUserId !== requestedUserId && !isAdmin) {
        return res.status(403).json({ 
          error: 'Forbidden - You can only update your own profile' 
        });
      }

      const {
        name,
        email,
        role,
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
        bankDetails,
        adminAccess
      } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      // Only admins can update role, salary, employeeId, and other sensitive fields
      if (isAdmin) {
        // Allow updating role from custom fields (store normalized value)
        if (role) {
          const normalizedRole = role.toString().toLowerCase().trim();
          updateData.role = normalizedRole;
        }
      } else {
        // Non-admins cannot update role
        if (role) {
          return res.status(403).json({ error: 'Forbidden - You cannot update your role' });
        }
      }

      if (phone) updateData.phone = phone;
      if (position) updateData.position = position;
      if (location) updateData.location = location;
      if (gender) updateData.gender = gender;
      if (maritalStatus) updateData.maritalStatus = maritalStatus;
      if (qualification) updateData.qualification = qualification;
      if (profilePic) updateData.profilePic = profilePic;
      if (Array.isArray(skills)) updateData.skills = skills;
      if (Array.isArray(rolesAndResponsibility)) updateData.rolesAndResponsibility = rolesAndResponsibility;
      if (bankDetails && typeof bankDetails === 'object') updateData.bankDetails = bankDetails;
      if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
      if (password) updateData.password = await bcrypt.hash(password, 10);

      // Only admins can update sensitive fields
      if (isAdmin) {
        if (company) updateData.company = company;
        if (employeeId !== undefined) updateData.employeeId = employeeId;
        if (salary !== undefined) updateData.salary = salary;
        if (department) updateData.department = department;
        if (dateOfJoining) updateData.dateOfJoining = new Date(dateOfJoining);
        // Only admins can grant/revoke admin access
        if (adminAccess !== undefined) {
          updateData.adminAccess = adminAccess === true || adminAccess === 'true';
        }
      } else {
        // Non-admins cannot update these fields
        if (company !== undefined || employeeId !== undefined || salary !== undefined || department !== undefined || dateOfJoining !== undefined || adminAccess !== undefined) {
          return res.status(403).json({ error: 'Forbidden - You cannot update company, employeeId, salary, department, dateOfJoining, or adminAccess' });
        }
      }

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

      if (user.isDeleted) {
        return res.status(400).json({ error: 'User is already archived' });
      }

      // Archive user instead of hard delete
      console.log(`Archiving user: ${user.name} (${user._id})`);
      console.log(`Before archive - isDeleted: ${user.isDeleted}, isActive: ${user.isActive}`);
      
      user.isDeleted = true;
      user.deletedAt = new Date();
      user.isActive = false; // Also deactivate the user
      
      const savedUser = await user.save();
      
      console.log(`After save - isDeleted: ${savedUser.isDeleted}, deletedAt: ${savedUser.deletedAt}, isActive: ${savedUser.isActive}`);
      
      // Verify the save worked by querying the database
      const verifyUser = await User.findById(user._id);
      console.log(`Verification - Found user in DB: ${verifyUser ? 'Yes' : 'No'}, isDeleted: ${verifyUser?.isDeleted}, deletedAt: ${verifyUser?.deletedAt}`);

      res.json({ 
        message: 'User has been archived successfully',
        user: {
          id: savedUser._id,
          name: savedUser.name,
          isDeleted: savedUser.isDeleted,
          deletedAt: savedUser.deletedAt,
          isActive: savedUser.isActive
        }
      });
    } catch (error) {
      console.error('Error archiving user:', error);
      res.status(500).json({ error: 'Failed to archive user' });
    }
  },

  // Permanently delete an archived user
  deleteUserPermanent: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isDeleted) {
        return res.status(400).json({ error: 'User must be archived before permanent deletion' });
      }

      await User.deleteOne({ _id: id });

      res.json({ message: 'User permanently deleted' });
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      res.status(500).json({ error: 'Failed to permanently delete user' });
    }
  },

  // Get archived users
  getArchivedUsers: async (req, res) => {
    try {
      console.log('=== Fetching archived users ===');
      
      // Try multiple query approaches to find archived users
      // First, try explicit isDeleted: true
      let users = await User.find({ 
        name: { $ne: "Admin" },
        isDeleted: true 
      }).select({
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
        deletedAt: 1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1
      }).sort({ deletedAt: -1, updatedAt: -1 });

      console.log(`Found ${users.length} archived users with isDeleted: true`);

      // Debug: Check all users and their isDeleted status
      const allUsers = await User.find({ name: { $ne: "Admin" } }).select('name email isDeleted deletedAt isActive');
      console.log(`Total users in database (excluding Admin): ${allUsers.length}`);
      
      const deletedUsers = allUsers.filter(u => u.isDeleted === true);
      const inactiveUsers = allUsers.filter(u => u.isActive === false && u.isDeleted !== true);
      
      console.log(`Users with isDeleted: true: ${deletedUsers.length}`);
      console.log(`Inactive users (not deleted): ${inactiveUsers.length}`);
      
      if (deletedUsers.length > 0) {
        console.log('Deleted users found:', deletedUsers.map(u => ({
          name: u.name,
          email: u.email,
          isDeleted: u.isDeleted,
          deletedAt: u.deletedAt,
          isActive: u.isActive
        })));
      }

      // If we found users, return them
      if (users && users.length > 0) {
        console.log('Returning archived users:', users.length);
        return res.json(users);
      }

      // If no users found, return empty array (not an error)
      console.log('No archived users found, returning empty array');
      return res.json([]);
      
    } catch (error) {
      console.error('Error fetching archived users:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({ 
        error: 'Failed to fetch archived users',
        details: error.message 
      });
    }
  },

  // Restore archived user
  restoreUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isDeleted) {
        return res.status(400).json({ error: 'User is not archived' });
      }

      // Restore user
      user.isDeleted = false;
      user.deletedAt = null;
      user.isActive = true; // Reactivate the user
      await user.save();

      res.json({ message: 'User has been restored successfully', user });
    } catch (error) {
      console.error('Error restoring user:', error);
      res.status(500).json({ error: 'Failed to restore user' });
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
      const requestingUserId = req.user._id.toString();
      const requestedUserId = id;
      const isAdmin = req.user.role === 'admin' || req.user.role === 'master-admin';
      
      // Allow access if: user is accessing their own data OR user is an admin
      if (requestingUserId !== requestedUserId && !isAdmin) {
        return res.status(403).json({ 
          error: 'Forbidden - You can only access your own sidebar access' 
        });
      }
      
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
      const requestingUserId = req.user._id.toString();
      const requestedUserId = id;
      const isAdmin = req.user.role === 'admin' || req.user.role === 'master-admin';

      // Allow access if: user is updating their own data OR user is an admin
      if (requestingUserId !== requestedUserId && !isAdmin) {
        return res.status(403).json({ 
          error: 'Forbidden - You can only update your own sidebar access' 
        });
      }

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
      const requestingUserId = req.user._id.toString();
      const isAdmin = req.user.role === 'admin' || req.user.role === 'master-admin';

      if (!userIds) {
        return res.status(400).json({ error: 'userIds query parameter is required' });
      }

      const ids = Array.isArray(userIds) ? userIds : userIds.split(',');
      
      // If not admin, only allow access to their own user ID
      if (!isAdmin) {
        if (ids.length !== 1 || ids[0] !== requestingUserId) {
          return res.status(403).json({ 
            error: 'Forbidden - You can only access your own sidebar access' 
          });
        }
      }
      
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
      const requestingUserId = req.user._id.toString();
      const isAdmin = req.user.role === 'admin' || req.user.role === 'master-admin';

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'userIds must be a non-empty array' });
      }

      // If not admin, only allow updating their own user ID
      if (!isAdmin) {
        if (userIds.length !== 1 || userIds[0] !== requestingUserId) {
          return res.status(403).json({ 
            error: 'Forbidden - You can only update your own sidebar access' 
          });
        }
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
