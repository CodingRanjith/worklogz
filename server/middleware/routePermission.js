const RoutePermission = require('../models/RoutePermission');
const User = require('../models/User');

/**
 * Middleware to check if user has permission to access a route
 * Usage: app.use('/api/some-route', routePermission(['GET', 'POST']), handler)
 * Or: routePermission.checkRoutePermission(req, res, next)
 */
const routePermission = {
  /**
   * Check if user has permission for the current route
   */
  checkRoutePermission: async (req, res, next) => {
    try {
      // Skip permission check for auth routes
      if (req.path.startsWith('/auth/')) {
        return next();
      }

      // Skip if no user (should be handled by auth middleware first)
      if (!req.user || !req.user._id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.user._id;
      const method = req.method;
      const path = req.path;
      const routeKey = `${method}:${path}`;
      const allMethodsKey = `ALL:${path}`;

      // Get user's role
      const user = await User.findById(userId).select('role');
      
      // Both master-admin and admin have full access by default
      if (user && (user.role === 'admin' || user.role === 'master-admin')) {
        return next();
      }

      // Get user's route permissions
      const permission = await RoutePermission.findOne({ userId });

      // If no permission record exists, check role-based defaults
      if (!permission) {
        // Default: Allow all routes for now (can be changed to deny by default)
        return next();
      }

      // Check denied routes first (blacklist)
      if (permission.deniedRoutes && permission.deniedRoutes.length > 0) {
        const isDenied = permission.deniedRoutes.some(route => {
          if (route === routeKey || route === allMethodsKey) return true;
          // Check wildcard patterns
          if (route.includes('*')) {
            const pattern = route.replace(/\*/g, '.*');
            const regex = new RegExp(`^${pattern}$`);
            return regex.test(routeKey) || regex.test(allMethodsKey);
          }
          return false;
        });

        if (isDenied) {
          return res.status(403).json({ 
            error: 'Access denied',
            message: 'You do not have permission to access this route'
          });
        }
      }

      // Check allowed routes (whitelist)
      if (permission.allowedRoutes && permission.allowedRoutes.length > 0) {
        const isAllowed = permission.allowedRoutes.some(route => {
          if (route === routeKey || route === allMethodsKey) return true;
          // Check wildcard patterns
          if (route.includes('*')) {
            const pattern = route.replace(/\*/g, '.*');
            const regex = new RegExp(`^${pattern}$`);
            return regex.test(routeKey) || regex.test(allMethodsKey);
          }
          return false;
        });

        if (!isAllowed) {
          return res.status(403).json({ 
            error: 'Access denied',
            message: 'You do not have permission to access this route'
          });
        }
      }

      // If using detailed routes array
      if (permission.routes && permission.routes.length > 0) {
        const routePermission = permission.routes.find(r => {
          const pathMatch = r.path === path || 
            (r.path.includes('*') && new RegExp(`^${r.path.replace(/\*/g, '.*')}$`).test(path));
          
          if (!pathMatch) return false;

          if (r.allowed === false) return false; // Explicitly denied

          const methods = r.methods || [];
          return methods.includes('ALL') || methods.includes(method);
        });

        if (!routePermission || routePermission.allowed === false) {
          return res.status(403).json({ 
            error: 'Access denied',
            message: 'You do not have permission to access this route'
          });
        }
      }

      next();
    } catch (error) {
      console.error('Route permission check error:', error);
      // On error, allow access (fail open) - change to deny if preferred
      next();
    }
  },

  /**
   * Create a middleware function for specific routes
   */
  requirePermission: (allowedMethods = ['ALL']) => {
    return async (req, res, next) => {
      await routePermission.checkRoutePermission(req, res, next);
    };
  }
};

module.exports = routePermission;

