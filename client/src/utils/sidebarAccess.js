// Local-only sidebar access control helpers.
// These functions manage per-user maps of allowed sidebar paths in localStorage.
// Supports multiple scopes (e.g., 'admin', 'employee') so admin and employee
// menus can be controlled independently.

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

export const getAccessMap = (scope = 'admin') => {
  const map = readMap();
  return map[scope] || {};
};

export const setAccessForUser = (userId, paths, scope = 'admin') => {
  if (!userId) return;
  const map = readMap();
  const scoped = map[scope] || {};
  scoped[userId] = paths;
  map[scope] = scoped;
  writeMap(map);
  return map;
};

export const getAccessForUser = (userId, scope = 'admin') => {
  if (!userId) return null;
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

