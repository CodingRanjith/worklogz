/**
 * Application constants
 */

const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const CORS_ORIGINS = [
  'https://worklogz.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://worklogz.com',
  'http://worklogz.com',
];

module.exports = {
  ROLES,
  HTTP_STATUS,
  CORS_ORIGINS,
};

