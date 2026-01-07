const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [employee, admin, master-admin]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, authorizeAccess, userController.getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 */
router.post('/', auth, authorizeAccess, userController.createUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, authorizeAccess, userController.getLoggedInUser);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.put('/me', auth, authorizeAccess, upload.single('profilePic'), userController.updateMyProfile);
// ✅ GET schedules for admin

/**
 * @swagger
 * /users/next/employee-id:
 *   get:
 *     summary: Get next available employee ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next employee ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nextEmployeeId:
 *                   type: string
 *                   example: EMP001
 */
router.get('/next/employee-id', auth, authorizeAccess, userController.getNextEmployeeId);

/**
 * @swagger
 * /users/assign-employee-ids:
 *   post:
 *     summary: Assign missing employee IDs to existing users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee IDs assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Admin access required
 */
router.post('/assign-employee-ids', auth, authorizeAccess, userController.assignMissingEmployeeIds);

/**
 * @swagger
 * /users/archived/list:
 *   get:
 *     summary: Get all archived users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of archived users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/archived/list', auth, authorizeAccess, (req, res, next) => {
  console.log('Route /archived/list matched!');
  next();
}, userController.getArchivedUsers);

/**
 * @swagger
 * /users/{id}/permanent:
 *   delete:
 *     summary: Permanently delete an archived user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User permanently deleted
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */
router.delete('/:id/permanent', auth, authorizeAccess, userController.deleteUserPermanent);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */
router.get('/:id', auth, authorizeAccess, userController.getSingleUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.put('/:id', auth, authorizeAccess, userController.updateUser);

/**
 * @swagger
 * /users/{id}/salary:
 *   put:
 *     summary: Update user salary (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salary
 *             properties:
 *               salary:
 *                 type: number
 *                 example: 50000
 *               dailyEarnings:
 *                 type: number
 *                 example: 200
 *     responses:
 *       200:
 *         description: Salary updated successfully
 *       403:
 *         description: Admin access required
 */
router.put('/:id/salary', auth, authorizeAccess, userController.updateSalary);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Archive (soft delete) a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User archived successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.delete('/:id', auth, authorizeAccess, userController.deleteUser);

/**
 * @swagger
 * /users/{id}/restore:
 *   post:
 *     summary: Restore an archived user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.post('/:id/restore', auth, authorizeAccess, userController.restoreUser);

/**
 * @swagger
 * /users/sidebar-access/bulk:
 *   get:
 *     summary: Get bulk sidebar access for all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bulk sidebar access data
 *       403:
 *         description: Admin access required
 */
router.get('/sidebar-access/bulk', auth, authorizeAccess, userController.getBulkSidebarAccess);

/**
 * @swagger
 * /users/sidebar-access/bulk:
 *   put:
 *     summary: Update bulk sidebar access for multiple users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               sidebarAccess:
 *                 $ref: '#/components/schemas/SidebarAccess'
 *     responses:
 *       200:
 *         description: Bulk sidebar access updated
 *       403:
 *         description: Admin access required
 */
router.put('/sidebar-access/bulk', auth, authorizeAccess, userController.updateBulkSidebarAccess);

/**
 * @swagger
 * /users/{id}/sidebar-access:
 *   get:
 *     summary: Get sidebar access for a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Sidebar access data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SidebarAccess'
 *       403:
 *         description: Access denied
 */
router.get('/:id/sidebar-access', auth, authorizeAccess, userController.getSidebarAccess);

/**
 * @swagger
 * /users/{id}/sidebar-access:
 *   put:
 *     summary: Update sidebar access for a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SidebarAccess'
 *     responses:
 *       200:
 *         description: Sidebar access updated successfully
 *       403:
 *         description: Access denied
 */
router.put('/:id/sidebar-access', auth, authorizeAccess, userController.updateSidebarAccess);

module.exports = router;