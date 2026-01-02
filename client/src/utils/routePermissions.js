// Route permissions management utilities
// These functions manage per-user route + HTTP method permissions

import axios from 'axios';
import { API_ENDPOINTS } from './api';

const STORAGE_KEY = 'worklogz-route-permissions';

const canUseStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const readMap = () => {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to read route permissions map', err);
    return {};
  }
};

const writeMap = (map) => {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to write route permissions map', err);
  }
};

// Fetch available routes from backend
export const fetchAvailableRoutes = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const res = await axios.get(API_ENDPOINTS.getAvailableRoutes, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data?.routes || [];
  } catch (err) {
    console.error('Failed to fetch available routes', err);
    return [];
  }
};

// Fetch route permissions map from backend (bulk)
export const fetchRoutePermissionsFromBackend = async (userIds) => {
  try {
    const token = localStorage.getItem('token');
    if (!token || !userIds || userIds.length === 0) return {};

    const userIdsParam = Array.isArray(userIds) ? userIds.join(',') : userIds;
    const res = await axios.get(API_ENDPOINTS.getBulkRoutePermissions(userIdsParam), {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data?.permissionsMap || {};
  } catch (err) {
    console.warn('Failed to fetch route permissions from backend, using localStorage', err);
    return {};
  }
};

// Get route permissions map (tries backend first, falls back to localStorage)
export const getRoutePermissionsMap = async (userIds) => {
  const backendMap = await fetchRoutePermissionsFromBackend(userIds);
  if (Object.keys(backendMap).length > 0) {
    // Update localStorage with backend data
    const map = readMap();
    Object.assign(map, backendMap);
    writeMap(map);
    return backendMap;
  }
  
  // Fallback to localStorage
  const map = readMap();
  const result = {};
  const userIdArray = Array.isArray(userIds) ? userIds : [userIds];
  userIdArray.forEach(userId => {
    result[userId] = map[userId] || [];
  });
  return result;
};

// Set route permissions for a user
export const setRoutePermissionsForUser = async (userId, routes) => {
  if (!userId) return;
  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.put(
        API_ENDPOINTS.setUserRoutePermissions(userId),
        { routes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (err) {
    console.warn('Failed to save route permissions to backend, saving to localStorage only', err);
  }
  
  // Always update localStorage as fallback
  const map = readMap();
  map[userId] = routes;
  writeMap(map);
};

// Set route permissions for multiple users (bulk)
export const setRoutePermissionsForUsers = async (userIds, routesMap) => {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) return;
  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.put(
        API_ENDPOINTS.setBulkRoutePermissions,
        { permissionsMap: routesMap },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (err) {
    console.warn('Failed to save bulk route permissions to backend, saving to localStorage only', err);
  }
  
  // Always update localStorage as fallback
  const map = readMap();
  Object.assign(map, routesMap);
  writeMap(map);
};

// Get route permissions for a user
export const getRoutePermissionsForUser = async (userId) => {
  if (!userId) return [];
  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const res = await axios.get(API_ENDPOINTS.getUserRoutePermissions(userId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const routes = res.data?.routes || [];
      
      // Update localStorage
      const map = readMap();
      map[userId] = routes;
      writeMap(map);
      return routes;
    }
  } catch (err) {
    console.warn('Failed to fetch route permissions from backend, using localStorage', err);
  }
  
  // Fallback to localStorage
  const map = readMap();
  return map[userId] || [];
};

// Check if user has permission for a route and method
export const hasRoutePermission = (userRoutes, path, method) => {
  if (!userRoutes || !Array.isArray(userRoutes)) return false;
  
  const route = userRoutes.find(r => {
    // Exact path match
    if (r.path === path) return true;
    
    // Wildcard pattern match (e.g., /users/:id matches /users/123)
    if (r.path.includes(':')) {
      const pattern = r.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(path)) return true;
    }
    
    // Path prefix match (e.g., /users matches /users/me)
    if (path.startsWith(r.path + '/') || path === r.path) return true;
    
    return false;
  });
  
  if (!route) return false;
  if (route.allowed === false) return false;
  
  const methods = route.methods || [];
  return methods.includes('ALL') || methods.includes(method);
};

