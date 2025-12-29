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

// ✅ Assign missing employee IDs to existing users
router.post('/assign-employee-ids', auth, role('admin'), userController.assignMissingEmployeeIds);

// ✅ GET archived users (must be before /:id route)
router.get('/archived/list', auth, role('admin'), (req, res, next) => {
  console.log('Route /archived/list matched!');
  next();
}, userController.getArchivedUsers);

// ✅ Permanently delete archived user
router.delete('/:id/permanent', auth, role('admin'), userController.deleteUserPermanent);

// ✅ GET user by ID (users can access their own, admins can access any)
router.get('/:id', auth, userController.getSingleUser);

// ✅ UPDATE user (users can update their own, admins can update any)
router.put('/:id', auth, userController.updateUser);

// ✅ UPDATE salary
router.put('/:id/salary', auth, role('admin'), userController.updateSalary);

// ✅ DELETE user and related data (archive)
router.delete('/:id', auth, role('admin'), userController.deleteUser);

// ✅ RESTORE archived user
router.post('/:id/restore', auth, role('admin'), userController.restoreUser);

// ✅ Sidebar Access Management
router.get('/sidebar-access/bulk', auth, userController.getBulkSidebarAccess);
router.put('/sidebar-access/bulk', auth, userController.updateBulkSidebarAccess);
// Allow users to access their own sidebar access, or admins to access any user's access
router.get('/:id/sidebar-access', auth, userController.getSidebarAccess);
router.put('/:id/sidebar-access', auth, userController.updateSidebarAccess);

module.exports = router;