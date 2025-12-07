// Sidebar access control helpers with backend sync.
// These functions manage per-user maps of allowed sidebar paths.
// Supports multiple scopes (e.g., 'admin', 'employee') so admin and employee
// menus can be controlled independently.
// Falls back to localStorage if backend is unavailable.

import axios from 'axios';
import { API_ENDPOINTS } from './api';

const STORAGE_KEY = 'worklogz-sidebar-access';

const canUseStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const readMap = () => {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to read sidebar access map', err);
    return {};
  }
};

const writeMap = (map) => {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to write sidebar access map', err);
  }
};

// Fetch access map from backend
export const fetchAccessMapFromBackend = async (scope = 'admin') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return {};

    // Get all users first
    const usersRes = await axios.get(API_ENDPOINTS.getUsers, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const userIds = usersRes.data?.map(u => u._id) || [];
    if (userIds.length === 0) return {};

    // Fetch bulk access
    const accessRes = await axios.get(API_ENDPOINTS.getBulkSidebarAccess(userIds, scope), {
      headers: { Authorization: `Bearer ${token}` }
    });

    return accessRes.data?.accessMap || {};
  } catch (err) {
    console.warn('Failed to fetch sidebar access from backend, using localStorage', err);
    return {};
  }
};

// Get access map (tries backend first, falls back to localStorage)
export const getAccessMap = async (scope = 'admin') => {
  const backendMap = await fetchAccessMapFromBackend(scope);
  if (Object.keys(backendMap).length > 0) {
    // Update localStorage with backend data
    const map = readMap();
    map[scope] = backendMap;
    writeMap(map);
    return backendMap;
  }
  
  // Fallback to localStorage
  const map = readMap();
  return map[scope] || {};
};

// Set access for user (saves to backend and localStorage)
export const setAccessForUser = async (userId, paths, scope = 'admin') => {
  if (!userId) return;
  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Save to backend
      await axios.put(
        API_ENDPOINTS.updateSidebarAccess(userId),
        { paths, scope },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (err) {
    console.warn('Failed to save sidebar access to backend, saving to localStorage only', err);
  }
  
  // Always update localStorage as fallback
  const map = readMap();
  const scoped = map[scope] || {};
  scoped[userId] = paths;
  map[scope] = scoped;
  writeMap(map);
  return map;
};

// Set access for multiple users (bulk update)
export const setAccessForUsers = async (userIds, paths, scope = 'admin') => {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) return;
  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Save to backend
      await axios.put(
        API_ENDPOINTS.updateBulkSidebarAccess,
        { userIds, paths, scope },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (err) {
    console.warn('Failed to save bulk sidebar access to backend, saving to localStorage only', err);
  }
  
  // Always update localStorage as fallback
  const map = readMap();
  const scoped = map[scope] || {};
  userIds.forEach(userId => {
    scoped[userId] = paths;
  });
  map[scope] = scoped;
  writeMap(map);
  return map;
};

// Get access for user (tries backend first, falls back to localStorage)
export const getAccessForUser = async (userId, scope = 'admin') => {
  if (!userId) return null;
  
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const res = await axios.get(API_ENDPOINTS.getSidebarAccess(userId, scope), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const paths = res.data?.paths;
      if (paths !== undefined) {
        // Update localStorage
        const map = readMap();
        if (!map[scope]) map[scope] = {};
        map[scope][userId] = paths;
        writeMap(map);
        return paths;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch sidebar access from backend, using localStorage', err);
  }
  
  // Fallback to localStorage
  const map = readMap();
  const userAccess = map[scope]?.[userId];
  
  // If explicitly set, return it
  if (userAccess !== undefined) return userAccess;
  
  // Default behavior:
  // - Admin menu: empty array (all disabled) until admin enables items
  // - Employee menu: null (all allowed) - always open
  if (scope === 'admin') {
    return []; // Admin menu starts with all disabled
  }
  return null; // Employee menu always shows all by default
};

export const getAllMenuPaths = (items = []) => {
  const paths = [];

  items.forEach((item) => {
    if (item.path) {
      paths.push(item.path);
    }
    if (item.subItems && item.subItems.length) {
      item.subItems.forEach((sub) => {
        if (sub.path) paths.push(sub.path);
      });
    }
  });

  return paths;
};

export const filterMenuByPaths = (items = [], allowedPaths) => {
  if (!allowedPaths || !Array.isArray(allowedPaths)) {
    // No override configured: show everything.
    return items;
  }

  const allowedSet = new Set(allowedPaths);

  return items
    .map((item) => {
      if (item.subItems && item.subItems.length) {
        const visibleSubItems = item.subItems.filter((sub) => allowedSet.has(sub.path));

        // Keep parent only if it has visible children.
        if (visibleSubItems.length) {
          return { ...item, subItems: visibleSubItems };
        }
        return null;
      }

      return allowedSet.has(item.path) ? item : null;
    })
    .filter(Boolean);
};

