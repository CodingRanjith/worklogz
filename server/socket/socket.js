const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

/**
 * Initialize Socket.io server
 * @param {http.Server} httpServer - HTTP server instance
 * @returns {Server} Socket.io server instance
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'https://worklogz.netlify.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://worklogz.com',
        'http://worklogz.com',
      ],
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
        position: decoded.position,
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
        groupIds.forEach((groupId) => {
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

  return io;
};

module.exports = initializeSocket;

