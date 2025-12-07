const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

// ✅ GET all users
router.get('/', auth, userController.getAllUsers);

// ✅ CREATE user (admin)
router.post('/', auth, role('admin'), userController.createUser);

// ✅ GET my profile (logged in user)
router.get('/me', auth, userController.getLoggedInUser);

// ✅ UPDATE my profile (logged in user)
router.put('/me', auth, upload.single('profilePic'), userController.updateMyProfile);
// ✅ GET schedules for admin

// ✅ Get next employee ID
router.get('/next/employee-id', auth, role('admin'), userController.getNextEmployeeId);

// ✅ GET user by ID
router.get('/:id', auth, role('admin'), userController.getSingleUser);

// ✅ UPDATE user
router.put('/:id', auth, role('admin'), userController.updateUser);

// ✅ UPDATE salary
router.put('/:id/salary', auth, role('admin'), userController.updateSalary);

// ✅ DELETE user and related data
router.delete('/:id', auth, role('admin'), userController.deleteUser);

// ✅ Sidebar Access Management
router.get('/sidebar-access/bulk', auth, role('admin'), userController.getBulkSidebarAccess);
router.put('/sidebar-access/bulk', auth, role('admin'), userController.updateBulkSidebarAccess);
router.get('/:id/sidebar-access', auth, role('admin'), userController.getSidebarAccess);
router.put('/:id/sidebar-access', auth, role('admin'), userController.updateSidebarAccess);

module.exports = router;