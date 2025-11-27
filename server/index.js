// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const authMiddleware = require('./middleware/auth');
const app = express();
const server = http.createServer(app);


// Middleware
app.use(cors({
  origin: ['https://worklogz.netlify.app', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ['https://worklogz.netlify.app', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.user = {
      _id: decoded.userId,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
      company: decoded.company,
      position: decoded.position
    };
    next();
  } catch (err) {
    console.error('Socket authentication error:', err.message);
    next(new Error('Authentication error'));
  }
});

// Store active users and their socket connections
const activeUsers = new Map(); // userId -> socketId
const userGroups = new Map(); // userId -> Set of groupIds

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  activeUsers.set(socket.userId, socket.id);

  // Join all groups the user is a member of
  socket.on('join-groups', (groupIds) => {
    if (Array.isArray(groupIds)) {
      groupIds.forEach(groupId => {
        socket.join(`group:${groupId}`);
      });
      userGroups.set(socket.userId, new Set(groupIds));
      console.log(`User ${socket.userId} joined groups:`, groupIds);
    }
  });

  // Join a specific group
  socket.on('join-group', (groupId) => {
    socket.join(`group:${groupId}`);
    if (!userGroups.has(socket.userId)) {
      userGroups.set(socket.userId, new Set());
    }
    userGroups.get(socket.userId).add(groupId);
    console.log(`User ${socket.userId} joined group: ${groupId}`);
  });

  // Leave a group
  socket.on('leave-group', (groupId) => {
    socket.leave(`group:${groupId}`);
    if (userGroups.has(socket.userId)) {
      userGroups.get(socket.userId).delete(groupId);
    }
    console.log(`User ${socket.userId} left group: ${groupId}`);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`group:${data.groupId}`).emit('user-typing', {
      userId: socket.userId,
      userName: socket.user?.name || 'User',
      groupId: data.groupId,
      isTyping: data.isTyping,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    activeUsers.delete(socket.userId);
    userGroups.delete(socket.userId);
  });
});

// Export io for use in controllers
app.set('io', io);

// Handle preflight requests
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());

// Static uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    const mime = require('mime');
    res.setHeader('Content-Type', mime.getType(filePath));
  }
}));

// Ping Route
app.get('/ping', (req, res) => res.send('pong'));

// Route Mounts 
app.use('/attendance', require('./routes/attendanceRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/timeRoutes'));
app.use('/api/timesheets', require('./routes/timeRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/holidays', require('./routes/holidayRoutes'));
app.use('/schedules', require('./routes/scheduleRoutes'));
app.use("/api/payslips", require("./routes/payslipRoutes"));
app.use('/api/work-cards', require('./routes/workCardRoutes'));
app.use('/api/daily-salary', require('./routes/dailySalaryRoutes'));
app.use('/api/engagement', require('./routes/achievementRoutes'));
app.use('/api/crm', require('./routes/crmRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/helpdesk', require('./routes/helpdeskRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Default Admin Setup
const User = require('./models/User');
const bcrypt = require('bcryptjs');
async function setupAdmin() {
  const existing = await User.findOne({ email: 'ranjith.c96me@gmail.com' });
  if (!existing) {
    const hashed = await bcrypt.hash('12345678', 10);
    await User.create({
      name: 'Admin',
      email: 'ranjith.c96me@gmail.com',
      password: hashed,
      role: 'admin',
      phone: '6374129515',
      position: 'Admin',
      company: 'Techackode'
    });
    console.log('Admin created: ranjith.c96me@gmail.com / 12345678');
  }
}
setupAdmin();

app.get('/employeesAttendance',authMiddleware, async (req, res) => {
   try {
    const users = await User.find({ role: 'employee' }, '_id name email role company position');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io server initialized`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
startServer();
