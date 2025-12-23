const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');
const initializeSocket = require('./socket/socket');
const { setupDefaultAdmin } = require('./services/adminService');
const { setupTaskCleanup } = require('./services/taskService');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);
app.set('io', io);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Setup default admin user
    await setupDefaultAdmin();

    // Setup task cleanup job
    setupTaskCleanup();

    // Start listening
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io server initialized`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

module.exports = server;

