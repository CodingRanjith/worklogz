const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

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

// Import middleware
const authMiddleware = require('./middleware/auth');

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://worklogz.netlify.app',
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

// Health check route
app.get('/ping', (req, res) => res.send('pong'));

// Test attendance route (for debugging)
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

// Custom Fields Routes
try {
  app.use('/api/custom-fields', customFieldRoutes);
  console.log('Custom fields routes registered successfully');
} catch (error) {
  console.error('Error loading custom fields routes:', error);
}

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

