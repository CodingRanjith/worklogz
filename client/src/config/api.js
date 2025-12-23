/**
 * API Configuration
 * Centralized API base URL and configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000, // 30 seconds
};

export default API_CONFIG;

