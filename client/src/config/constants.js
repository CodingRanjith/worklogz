/**
 * Application Constants
 * Centralized constants used throughout the application
 */

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
};

// Route Paths
export const ROUTES = {
  // Public
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRICING: '/pricing',
  
  // Employee
  EMPLOYEE_HOME: '/home',
  EMPLOYEE_ATTENDANCE: '/attendance',
  EMPLOYEE_TIMESHEET: '/timesheet',
  EMPLOYEE_LEAVE: '/apply-leave',
  EMPLOYEE_PROFILE: '/profile-settings',
  
  // Admin
  ADMIN_DASHBOARD: '/dashboard',
  ADMIN_EMPLOYEES: '/employees',
  ADMIN_ATTENDANCE: '/attendances',
  ADMIN_REPORTS: '/reports',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// API Response Status
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export default {
  ROLES,
  ROUTES,
  STORAGE_KEYS,
  HTTP_STATUS,
  DATE_FORMATS,
  PAGINATION,
};

