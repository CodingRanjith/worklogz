const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

// ✅ GET all users
router.get('/', auth, userController.getAllUsers);

// ✅ GET my profile (logged in user)
router.get('/me', auth, userController.getLoggedInUser);

// ✅ UPDATE my profile (logged in user)
router.put('/me', auth, upload.single('profilePic'), userController.updateMyProfile);
// ✅ GET schedules for admin

// ✅ GET user by ID
router.get('/:id', auth, role('admin'), userController.getSingleUser);

// ✅ UPDATE user
router.put('/:id', auth, role('admin'), userController.updateUser);

// ✅ UPDATE salary
router.put('/:id/salary', auth, role('admin'), userController.updateSalary);

// ✅ DELETE user and related data
router.delete('/:id', auth, role('admin'), userController.deleteUser);

module.exports = router;