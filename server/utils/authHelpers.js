/**
 * Helper functions for authentication and authorization
 */

/**
 * Check if a user has admin access (either via role or adminAccess flag)
 * @param {Object} user - The user object from req.user
 * @returns {boolean} - True if user has admin access
 */
function hasAdminAccess(user) {
  if (!user) return false;
  
  const userRole = user.role?.toLowerCase();
  const adminAccess = user.adminAccess || false;
  
  // Check if user has adminAccess flag set
  if (adminAccess) return true;
  
  // Check if user has admin role
  const adminRoles = ['admin', 'master-admin', 'administrator'];
  return adminRoles.includes(userRole);
}

/**
 * Check if a user has a specific role or admin access
 * @param {Object} user - The user object from req.user
 * @param {string|string[]} allowedRoles - Role(s) to check against
 * @returns {boolean} - True if user has access
 */
function hasRoleAccess(user, allowedRoles) {
  if (!user) return false;
  
  // If user has adminAccess, grant access to everything
  if (user.adminAccess) return true;
  
  const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const userRole = user.role?.toLowerCase();
  
  // Normalize admin roles
  const normalizedAllowedRoles = allowedRolesArray.map(role => {
    if (role === 'admin') {
      return ['admin', 'master-admin', 'administrator'];
    }
    return role;
  }).flat().map(r => r.toLowerCase());
  
  return normalizedAllowedRoles.includes(userRole);
}

module.exports = {
  hasAdminAccess,
  hasRoleAccess
};

