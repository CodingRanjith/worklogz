// server/middleware/role.js
module.exports = function(roles) {
  return function(req, res, next) {
    // Handle both single role (string) and multiple roles (array)
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    next();
  };
};