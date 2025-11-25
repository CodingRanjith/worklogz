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

  getEmployeesForAttendance: async (req, res) => {
    try {
      const users = await User.find({ role: 'employee' }, '_id name email role');
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

};

module.exports = userController;
