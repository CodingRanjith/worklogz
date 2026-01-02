const RoutePermission = require('../models/RoutePermission');
const User = require('../models/User');

/**
 * Authorization middleware that checks route permissions
 * Replaces role-based middleware with permission-based access control
 * 
 * Usage:
 *   router.get('/path', auth, authorizeAccess, handler);
 *   router.post('/path', auth, authorizeAccess, handler);
 * 
 * Admins and master-admins automatically have full access
 */
const authorizeAccess = async (req, res, next) => {
  try {
    // Skip if no user (should be handled by auth middleware first)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = req.user._id;
    const method = req.method;
    const path = req.originalUrl.split('?')[0]; // Remove query string
    const baseUrl = req.baseUrl || '';
    const fullPath = baseUrl + path;

    // Get user's role and adminAccess flag
    const user = await User.findById(userId).select('role adminAccess');
    
    // If user has adminAccess flag or is admin/master-admin, grant full access
    if (user && (user.adminAccess || user.role === 'admin' || user.role === 'master-admin')) {
      return next();
    }

    // Check route permissions
    const permission = await RoutePermission.findOne({ userId });

    if (!permission || !permission.routes || permission.routes.length === 0) {
      // No permissions set - allow access (default behavior)
      // Change this to deny if you want deny-by-default
      return next();
    }

    // Check if route is explicitly allowed
    const routePermission = permission.routes.find(r => {
      // Exact path match
      if (r.path === fullPath || r.path === path) return true;
      
      // Wildcard pattern match (e.g., /users/:id matches /users/123)
      if (r.path.includes(':')) {
        const pattern = r.path.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/');
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(fullPath) || regex.test(path)) return true;
      }
      
      // Path prefix match (e.g., /users matches /users/me)
      if (fullPath.startsWith(r.path + '/') || fullPath === r.path ||
          path.startsWith(r.path + '/') || path === r.path) return true;
      
      return false;
    });

    // If no specific permission found, allow access (can be changed to deny)
    if (!routePermission) {
      return next();
    }

    // If explicitly denied, block access
    if (routePermission.allowed === false) {
      return res.status(403).json({ 
        error: 'Forbidden - Route access denied',
        message: `You do not have permission to ${method} ${fullPath}`
      });
    }

    // Check if method is allowed
    const allowedMethods = routePermission.methods || [];
    if (allowedMethods.includes('ALL') || allowedMethods.includes(method)) {
      return next();
    }

    // Method not allowed
    return res.status(403).json({ 
      error: 'Forbidden - Method not allowed',
      message: `You do not have permission to ${method} ${fullPath}`
    });
  } catch (error) {
    console.error('Authorization middleware error:', error);
    // On error, allow access (fail open) - change to deny if preferred
    return next();
  }
};

module.exports = authorizeAccess;

