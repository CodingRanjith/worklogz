const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

// ✅ GET all users
router.get('/', auth, authorizeAccess, userController.getAllUsers);

// ✅ CREATE user (admin)
router.post('/', auth, authorizeAccess, userController.createUser);

// ✅ GET my profile (logged in user)
router.get('/me', auth, authorizeAccess, userController.getLoggedInUser);

// ✅ UPDATE my profile (logged in user)
router.put('/me', auth, authorizeAccess, upload.single('profilePic'), userController.updateMyProfile);
// ✅ GET schedules for admin

// ✅ Get next employee ID
router.get('/next/employee-id', auth, authorizeAccess, userController.getNextEmployeeId);

// ✅ Assign missing employee IDs to existing users
router.post('/assign-employee-ids', auth, authorizeAccess, userController.assignMissingEmployeeIds);

// ✅ GET archived users (must be before /:id route)
router.get('/archived/list', auth, authorizeAccess, (req, res, next) => {
  console.log('Route /archived/list matched!');
  next();
}, userController.getArchivedUsers);

// ✅ Permanently delete archived user
router.delete('/:id/permanent', auth, authorizeAccess, userController.deleteUserPermanent);

// ✅ GET user by ID (users can access their own, admins can access any)
router.get('/:id', auth, authorizeAccess, userController.getSingleUser);

// ✅ UPDATE user (users can update their own, admins can update any)
router.put('/:id', auth, authorizeAccess, userController.updateUser);

// ✅ UPDATE salary
router.put('/:id/salary', auth, authorizeAccess, userController.updateSalary);

// ✅ DELETE user and related data (archive)
router.delete('/:id', auth, authorizeAccess, userController.deleteUser);

// ✅ RESTORE archived user
router.post('/:id/restore', auth, authorizeAccess, userController.restoreUser);

// ✅ Sidebar Access Management
router.get('/sidebar-access/bulk', auth, authorizeAccess, userController.getBulkSidebarAccess);
router.put('/sidebar-access/bulk', auth, authorizeAccess, userController.updateBulkSidebarAccess);
// Allow users to access their own sidebar access, or admins to access any user's access
router.get('/:id/sidebar-access', auth, authorizeAccess, userController.getSidebarAccess);
router.put('/:id/sidebar-access', auth, authorizeAccess, userController.updateSidebarAccess);

module.exports = router;