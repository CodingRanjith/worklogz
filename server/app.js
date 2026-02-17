const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Import routes
const attendanceRoutes = require('./routes/attendanceRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const timeRoutes = require('./routes/timeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const payslipRoutes = require('./routes/payslipRoutes');
const workCardRoutes = require('./routes/workCardRoutes');
const dailySalaryRoutes = require('./routes/dailySalaryRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const crmRoutes = require('./routes/crmRoutes');
const teamRoutes = require('./routes/teamRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const communityRoutes = require('./routes/communityRoutes');
const helpdeskRoutes = require('./routes/helpdeskRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const demoRoutes = require('./routes/demoRoutes');
const feePaymentRoutes = require('./routes/feePaymentRoutes');
const companySettingsRoutes = require('./routes/companySettingsRoutes');
const sidebarMenuRoutes = require('./routes/sidebarMenuRoutes');
const customFieldRoutes = require('./routes/customFieldRoutes');
const incomeExpenseRoutes = require('./routes/incomeExpenseRoutes');
const personalIncomeExpenseRoutes = require('./routes/personalIncomeExpenseRoutes');
const dayTodayRoutes = require('./routes/dayTodayRoutes');
const routePermissionRoutes = require('./routes/routePermissionRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const payoutRoutes = require('./routes/payoutRoutes');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Initialize Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'https://worklogz.com',
  'http://worklogz.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Normalize origin by removing trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if normalized origin is in allowed list
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WorkLogz API Documentation',
}));

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: pong
 */
app.get('/ping', (req, res) => res.send('pong'));

/**
 * @swagger
 * /attendance/test:
 *   get:
 *     summary: Test attendance route (for debugging)
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: Attendance route is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance route is working
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/attendance/test', (req, res) => {
  res.json({ message: 'Attendance route is working', timestamp: new Date() });
});

// API Routes
app.use('/attendance', attendanceRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/api/tasks', timeRoutes);
app.use('/api/timesheets', timeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/work-cards', workCardRoutes);
app.use('/api/daily-salary', dailySalaryRoutes);
app.use('/api/engagement', achievementRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/fee-payments', feePaymentRoutes);
app.use('/api/company-settings', companySettingsRoutes);
app.use('/api/sidebar-menu', sidebarMenuRoutes);
app.use('/api/income-expense', incomeExpenseRoutes);
app.use('/api/personal-income-expense', personalIncomeExpenseRoutes);
app.use('/api/daytoday', dayTodayRoutes);
app.use('/api/route-permissions', routePermissionRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/payouts', payoutRoutes);

// Custom Fields Routes
try {
  app.use('/api/custom-fields', customFieldRoutes);
  console.log('Custom fields routes registered successfully');
} catch (error) {
  console.error('Error loading custom fields routes:', error);
}

/**
 * @swagger
 * /employeesAttendance:
 *   get:
 *     summary: Get employees attendance list (Legacy route)
 *     description: Returns list of users for attendance purposes. Admins see all users, employees see only employees.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users for attendance
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   company:
 *                     type: string
 *                   position:
 *                     type: string
 *                   department:
 *                     type: string
 *                   employeeId:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   adminAccess:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// Legacy route - consider moving to proper controller
app.get('/employeesAttendance', authMiddleware, async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Check if user has admin access (via role or adminAccess flag)
    const userRole = req.user.role?.toLowerCase();
    const adminAccess = req.user.adminAccess || false;
    const isAdmin = ['admin', 'master-admin', 'administrator'].includes(userRole) || adminAccess;
    
    // Allow admins to see all users, employees see only employees
    const query = isAdmin
      ? { isDeleted: { $ne: true } } // Admins see all non-deleted users
      : { role: 'employee', isDeleted: { $ne: true } }; // Employees see only employees
    
    const users = await User.find(
      query,
      '_id name email role company position department employeeId phone isActive adminAccess'
    ).sort({ name: 1 });
    
    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;

