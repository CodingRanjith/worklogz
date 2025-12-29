/**
 * API Configuration
 * Centralized API base URL and configuration
 */

const DEFAULT_PROD_URL = 'https://zovcur-worklogz.onrender.com';
const DEFAULT_DEV_URL = 'http://localhost:5000';

export const API_CONFIG = {
  // Prefer explicit env; otherwise pick prod URL in production builds, dev URL locally
  BASE_URL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === 'production' ? DEFAULT_PROD_URL : DEFAULT_DEV_URL),
  TIMEOUT: 30000, // 30 seconds
};

/**
 * Common API Endpoint Paths
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/auth/register',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id) => `/users/${id}`,
    ARCHIVED: '/users/archived/list',
    NEXT_EMPLOYEE_ID: '/users/next/employee-id',
  },
  
  // Company Settings
  COMPANY: {
    SETTINGS: '/api/company-settings',
    LOGO: '/api/company-settings/logo',
  },
  
  // Custom Fields
  CUSTOM_FIELDS: {
    BASE: '/api/custom-fields',
    BY_TYPE: (type) => `/api/custom-fields/type/${type}`,
    SUMMARY: '/api/custom-fields/summary',
    BULK: '/api/custom-fields/bulk',
    BY_ID: (id) => `/api/custom-fields/${id}`,
    TOGGLE: (id) => `/api/custom-fields/${id}/toggle`,
  },
  
  // Sidebar
  SIDEBAR: {
    MENU: (scope = 'employee') => `/api/sidebar-menu/${scope}`,
    ACCESS: (userId, scope = 'admin') => `/users/${userId}/sidebar-access?scope=${scope}`,
    BULK_ACCESS: '/users/sidebar-access/bulk',
  },
  
  // Permissions
  PERMISSIONS: {
    ROUTES: {
      AVAILABLE: '/api/route-permissions/available-routes',
      USER: (userId) => `/api/route-permissions/user/${userId}`,
      BULK: '/api/route-permissions/bulk',
    },
    PAGES: {
      AVAILABLE: '/api/page-permissions/available-pages',
      USER: (userId) => `/api/page-permissions/user/${userId}`,
      BULK: '/api/page-permissions/bulk',
    },
  },
  
  // Schedules
  SCHEDULES: {
    BASE: '/schedules',
    BY_USER: (userId) => `/schedules/${userId}`,
  },
  
  // Applications
  APPLICATIONS: {
    BASE: '/api/applications',
  },
  
  // Community
  COMMUNITY: {
    GROUPS: '/api/community/groups',
    GROUP_MESSAGES: (groupId) => `/api/community/groups/${groupId}/messages`,
    GROUP_LEAVE: (groupId) => `/api/community/groups/${groupId}/leave`,
    GROUP_DELETE: (groupId) => `/api/community/groups/${groupId}`,
  },
  
  // Projects
  PROJECTS: {
    BASE: '/api/projects',
    BY_ID: (projectId) => `/api/projects/${projectId}`,
  },
  
  // Assistant/Chat
  ASSISTANT: {
    CHAT: '/api/assistant/chat',
    SKILL_CHAT: '/api/assistant/skill-chat',
    WORKLOGZ_CHAT: '/api/assistant/worklogz-chat',
    CHAT_HISTORY: '/api/assistant/chat-history',
    CLEAR_HISTORY: '/api/assistant/chat-history',
  },
};

/**
 * Helper function to construct full endpoint URL
 * @param {string} endpoint - Endpoint path
 * @returns {string} Full URL
 */
export const getEndpointUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG;

