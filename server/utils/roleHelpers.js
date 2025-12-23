/**
 * Utility functions for role checking
 */

/**
 * Check if user has admin role (either 'admin' or 'master-admin')
 * @param {string} role - User role
 * @returns {boolean}
 */
const isAdmin = (role) => {
  return role === 'admin' || role === 'master-admin';
};

/**
 * Check if user has admin role from request object
 * @param {object} req - Express request object
 * @returns {boolean}
 */
const isAdminFromReq = (req) => {
  return req.user && (req.user.role === 'admin' || req.user.role === 'master-admin');
};

module.exports = {
  isAdmin,
  isAdminFromReq
};

