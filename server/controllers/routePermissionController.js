const RoutePermission = require('../models/RoutePermission');
const User = require('../models/User');

// Available routes list - based on routes in app.js
// This can be expanded or made dynamic in the future
const AVAILABLE_ROUTES = [
  { path: '/users', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/users/me', methods: ['GET', 'PUT'] },
  { path: '/users/:id', methods: ['GET', 'PUT', 'DELETE'] },
  { path: '/users/archived/list', methods: ['GET'] },
  { path: '/users/next/employee-id', methods: ['GET'] },
  { path: '/attendance', methods: ['GET', 'POST'] },
  { path: '/attendance/all', methods: ['GET'] },
  { path: '/attendance/me', methods: ['GET'] },
  { path: '/attendance/user/:userId', methods: ['GET'] },
  { path: '/schedules', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/schedules/:userId', methods: ['GET', 'PUT'] },
  { path: '/api/tasks', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/tasks/:id', methods: ['GET', 'PUT', 'DELETE'] },
  { path: '/api/timesheets', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/leaves', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/holidays', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/payslips', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/work-cards', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/daily-salary', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/engagement', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/crm', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/teams', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/applications', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/community', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/helpdesk', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/assistant', methods: ['POST'] },
  { path: '/api/projects', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/notifications', methods: ['GET', 'PUT', 'DELETE'] },
  { path: '/api/assessments', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/fee-payments', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/company-settings', methods: ['GET', 'PUT'] },
  { path: '/api/company-settings/logo', methods: ['DELETE'] },
  { path: '/api/sidebar-menu/:scope', methods: ['GET', 'PUT'] },
  { path: '/api/custom-fields', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/custom-fields/:id', methods: ['PUT', 'DELETE'] },
  { path: '/api/income-expense', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/daytoday', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/admin/summary', methods: ['GET'] },
  { path: '/api/admin/recent-attendance', methods: ['GET'] },
];

// Get all available routes
exports.getAvailableRoutes = async (req, res) => {
  try {
    res.json({ routes: AVAILABLE_ROUTES });
  } catch (error) {
    console.error('Error fetching available routes:', error);
    res.status(500).json({ error: 'Failed to fetch available routes' });
  }
};

// Get route permissions for a specific user
exports.getUserRoutePermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const permission = await RoutePermission.findOne({ userId }).lean();
    
    if (!permission) {
      return res.json({ 
        userId, 
        routes: [],
        message: 'No route permissions set for this user. Default access applies.'
      });
    }
    
    res.json({ 
      userId, 
      routes: permission.routes || [],
      allowedRoutes: permission.allowedRoutes || [],
      deniedRoutes: permission.deniedRoutes || []
    });
  } catch (error) {
    console.error('Error fetching user route permissions:', error);
    res.status(500).json({ error: 'Failed to fetch user route permissions' });
  }
};

// Set route permissions for a specific user
exports.setUserRoutePermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { routes } = req.body;
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate routes array
    if (!Array.isArray(routes)) {
      return res.status(400).json({ error: 'Routes must be an array' });
    }
    
    // Validate each route
    for (const route of routes) {
      if (!route.path) {
        return res.status(400).json({ error: 'Each route must have a path' });
      }
      if (route.methods && !Array.isArray(route.methods)) {
        return res.status(400).json({ error: 'Route methods must be an array' });
      }
      if (route.methods) {
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'ALL'];
        const invalidMethods = route.methods.filter(m => !validMethods.includes(m));
        if (invalidMethods.length > 0) {
          return res.status(400).json({ 
            error: `Invalid methods: ${invalidMethods.join(', ')}. Valid methods are: ${validMethods.join(', ')}` 
          });
        }
      }
    }
    
    // Upsert permission
    const permission = await RoutePermission.findOneAndUpdate(
      { userId },
      { 
        userId,
        routes,
        // Clear old allowedRoutes/deniedRoutes for cleaner data
        allowedRoutes: [],
        deniedRoutes: []
      },
      { new: true, upsert: true }
    );
    
    res.json({ 
      message: 'Route permissions updated successfully',
      userId,
      routes: permission.routes
    });
  } catch (error) {
    console.error('Error setting user route permissions:', error);
    res.status(500).json({ error: 'Failed to set user route permissions' });
  }
};

// Get route permissions for multiple users (bulk)
exports.getBulkRoutePermissions = async (req, res) => {
  try {
    const userIds = req.query.userIds ? req.query.userIds.split(',') : [];
    
    if (userIds.length === 0) {
      return res.json({ permissionsMap: {} });
    }
    
    const permissions = await RoutePermission.find({ 
      userId: { $in: userIds } 
    }).lean();
    
    // Create a map of userId -> routes
    const permissionsMap = {};
    permissions.forEach(perm => {
      permissionsMap[perm.userId.toString()] = perm.routes || [];
    });
    
    // Include empty arrays for users without permissions
    userIds.forEach(userId => {
      if (!permissionsMap[userId]) {
        permissionsMap[userId] = [];
      }
    });
    
    res.json({ permissionsMap });
  } catch (error) {
    console.error('Error fetching bulk route permissions:', error);
    res.status(500).json({ error: 'Failed to fetch bulk route permissions' });
  }
};

// Set route permissions for multiple users (bulk)
exports.setBulkRoutePermissions = async (req, res) => {
  try {
    const { permissionsMap } = req.body;
    
    if (!permissionsMap || typeof permissionsMap !== 'object') {
      return res.status(400).json({ error: 'permissionsMap must be an object' });
    }
    
    const userIds = Object.keys(permissionsMap);
    if (userIds.length === 0) {
      return res.json({ message: 'No users to update' });
    }
    
    // Verify all users exist
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({ error: 'One or more users not found' });
    }
    
    // Validate and update permissions for each user
    const updatePromises = userIds.map(async (userId) => {
      const routes = permissionsMap[userId];
      
      if (!Array.isArray(routes)) {
        throw new Error(`Routes for user ${userId} must be an array`);
      }
      
      // Validate routes
      for (const route of routes) {
        if (!route.path) {
          throw new Error(`Route for user ${userId} must have a path`);
        }
        if (route.methods && !Array.isArray(route.methods)) {
          throw new Error(`Route methods for user ${userId} must be an array`);
        }
      }
      
      return RoutePermission.findOneAndUpdate(
        { userId },
        { 
          userId,
          routes,
          allowedRoutes: [],
          deniedRoutes: []
        },
        { new: true, upsert: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({ 
      message: `Route permissions updated successfully for ${userIds.length} user(s)`,
      updatedCount: userIds.length
    });
  } catch (error) {
    console.error('Error setting bulk route permissions:', error);
    res.status(500).json({ error: error.message || 'Failed to set bulk route permissions' });
  }
};

// Delete route permissions for a user (reset to default)
exports.deleteUserRoutePermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await RoutePermission.findOneAndDelete({ userId });
    
    res.json({ 
      message: 'Route permissions deleted successfully. User will use default access.',
      userId
    });
  } catch (error) {
    console.error('Error deleting user route permissions:', error);
    res.status(500).json({ error: 'Failed to delete user route permissions' });
  }
};

