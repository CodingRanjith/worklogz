// server/middleware/role.js
module.exports = function(roles) {
  return function(req, res, next) {
    try {
      // Handle both single role (string) and multiple roles (array)
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      // Check if req.user exists (should be set by auth middleware)
      if (!req.user) {
        console.error('Role middleware: req.user is not defined');
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const userRole = req.user.role;
      const adminAccess = req.user.adminAccess || false;
      
      if (!userRole) {
        console.error('Role middleware: User role not found in req.user:', req.user);
        return res.status(401).json({ error: 'User role not found' });
      }
      
      // If user has adminAccess flag set to true, grant FULL ACCESS (master-admin level)
      // This means they can access ANY route regardless of role requirements
      if (adminAccess) {
        console.log(`Full admin access granted via adminAccess flag for user: ${req.user._id} (role: ${userRole})`);
        return next();
      }
      
      // Normalize admin roles - treat administrator, admin, and master-admin as equivalent
      const isAdminRole = ['admin', 'master-admin', 'administrator'].includes(userRole.toLowerCase());
      
      // Check if user role is allowed (normalize admin roles)
      const normalizedAllowedRoles = allowedRoles.map(role => {
        if (role === 'admin') {
          return ['admin', 'master-admin', 'administrator'];
        }
        return role;
      }).flat();
      
      // Normalize user role for comparison (case-insensitive)
      const normalizedUserRole = userRole.toLowerCase();
      const normalizedAllowedRolesLower = normalizedAllowedRoles.map(r => r.toLowerCase());
      
      // Also allow 'user' role if 'employee' is in allowed roles (for backward compatibility)
      if (normalizedAllowedRolesLower.includes('user') && normalizedUserRole === 'employee') {
        return next();
      }
      
      // Check if user role matches any allowed role
      if (normalizedAllowedRolesLower.includes(normalizedUserRole)) {
        return next();
      }
      
      // If user has admin role but it's not in the normalized list, still allow if admin is requested
      if (isAdminRole && allowedRoles.includes('admin')) {
        return next();
      }
      
      console.error(`Access denied: User role '${userRole}' (adminAccess: ${adminAccess}) not in allowed roles:`, normalizedAllowedRoles);
      return res.status(403).json({ 
        error: 'Forbidden - Insufficient permissions',
        userRole: userRole,
        adminAccess: adminAccess,
        allowedRoles: normalizedAllowedRoles
      });
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ error: 'Internal server error in role middleware', details: error.message });
    }
  };
};