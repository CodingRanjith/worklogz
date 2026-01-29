import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  FiHome,
  FiClock,
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiFolder,
  FiShoppingCart,
  FiPieChart,
  FiBookOpen,
  FiTarget,
  FiMessageCircle,
  FiActivity,
  FiShield,
  FiZap,
  FiCode,
  FiSettings,
  FiBarChart2,
  FiFileText,
  FiHelpCircle,
  FiGrid,
  FiCheckSquare,
} from 'react-icons/fi';
import { API_ENDPOINTS } from '../../utils/api';
import {
  getAccessMap,
  getAllMenuPaths,
  setAccessForUsers
} from '../../utils/sidebarAccess';
import { normalizeMenuOrder } from '../../utils/sidebarMenu';
import {
  fetchAvailableRoutes,
  getRoutePermissionsMap,
  setRoutePermissionsForUsers
} from '../../utils/routePermissions';
import { groupRoutesByPages } from '../../utils/routePageMapping';
import { getPagesWithAccess, getPageForSidebarPath } from '../../utils/pageAccessMapping';

// Icon map for resolving icon strings to components
const ICON_MAP = {
  FiHome,
  FiClock,
  FiUsers,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiFolder,
  FiShoppingCart,
  FiPieChart,
  FiBookOpen,
  FiTarget,
  FiMessageCircle,
  FiActivity,
  FiShield,
  FiZap,
  FiCode,
  FiSettings,
  FiBarChart2,
  FiFileText,
  FiHelpCircle,
  FiGrid,
  FiCheckSquare,
};

// Helper to get icon component from string or component
const getIconComponent = (icon) => {
  if (!icon) return null;
  // If it's already a React component/element, return it
  if (React.isValidElement(icon)) return icon;
  // If it's a string, find the matching icon component
  if (typeof icon === 'string') {
    const IconComp = ICON_MAP[icon];
    return IconComp || null;
  }
  return null;
};

const AdministrationAccess = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Sidebar access state
  const [accessMap, setAccessMapState] = useState({});
  const [savedAccessMap, setSavedAccessMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const scope = 'employee'; // Only employee menu now
  const [menuItems, setMenuItems] = useState([]);
  const allPaths = useMemo(
    () => getAllMenuPaths(menuItems),
    [menuItems]
  );

  // Route permissions state
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [routePermissionsMap, setRoutePermissionsMap] = useState({});
  const [savedRoutePermissionsMap, setSavedRoutePermissionsMap] = useState({});
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getUsers, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data || []);
        if (res.data?.length && selectedUserIds.length === 0) {
          setSelectedUserIds([res.data[0]._id]);
        }
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    fetchUsers();
  }, [token]);

  // Load sidebar menu so ordering matches Master Control
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getSidebarMenu(scope), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const items = res.data?.items || [];
        if (items.length) {
          setMenuItems(normalizeMenuOrder(items));
        } else {
          setMenuItems([]);
        }
      } catch (err) {
        console.error('Failed to load sidebar menu for access control', err);
        setMenuItems([]);
      }
    };

    loadMenu();
  }, [scope, token]);

  // Load access map on mount
  useEffect(() => {
    const loadAccessMap = async () => {
      setIsLoading(true);
      try {
        const map = await getAccessMap(scope);
        setAccessMapState(map);
        setSavedAccessMap(map);
      } catch (err) {
        console.error('Failed to load access map', err);
        setAccessMapState({});
        setSavedAccessMap({});
      } finally {
        setIsLoading(false);
      }
    };

    loadAccessMap();
  }, [scope]);

  // Load available routes
  useEffect(() => {
    const loadAvailableRoutes = async () => {
      setIsLoadingRoutes(true);
      try {
        const routes = await fetchAvailableRoutes();
        setAvailableRoutes(routes);
      } catch (err) {
        console.error('Failed to load available routes', err);
        setAvailableRoutes([]);
      } finally {
        setIsLoadingRoutes(false);
      }
    };

    loadAvailableRoutes();
  }, []);

  // Load route permissions when selected users change
  useEffect(() => {
    const loadRoutePermissions = async () => {
      if (selectedUserIds.length === 0) {
        setRoutePermissionsMap({});
        setSavedRoutePermissionsMap({});
        return;
      }

      setIsLoadingRoutes(true);
      try {
        const permissions = await getRoutePermissionsMap(selectedUserIds);
        setRoutePermissionsMap(permissions);
        setSavedRoutePermissionsMap(permissions);
      } catch (err) {
        console.error('Failed to load route permissions', err);
        setRoutePermissionsMap({});
        setSavedRoutePermissionsMap({});
      } finally {
        setIsLoadingRoutes(false);
      }
    };

    loadRoutePermissions();
  }, [selectedUserIds]);

  // Derive available filters from users list
  const roleOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => {
      if (u.role) set.add(u.role);
    });
    return Array.from(set).sort();
  }, [users]);

  const departmentOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => {
      if (u.department) set.add(u.department);
    });
    return Array.from(set).sort();
  }, [users]);

  const companyOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => {
      if (u.company) set.add(u.company);
    });
    return Array.from(set).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !query ||
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.employeeId?.toLowerCase().includes(query);

      const matchesRole = selectedRole === 'all' || u.role === selectedRole;
      const matchesDept = selectedDepartment === 'all' || u.department === selectedDepartment;
      const matchesCompany = selectedCompany === 'all' || u.company === selectedCompany;

      return matchesSearch && matchesRole && matchesDept && matchesCompany;
    });
  }, [search, users, selectedRole, selectedDepartment, selectedCompany]);

  const hasActiveFilters =
    !!search || selectedRole !== 'all' || selectedDepartment !== 'all' || selectedCompany !== 'all';

  const clearFilters = () => {
    setSearch('');
    setSelectedRole('all');
    setSelectedDepartment('all');
    setSelectedCompany('all');
  };

  const selectedUsers = users.filter((u) => selectedUserIds.includes(u._id));

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const toggleAllUsers = (selectAll) => {
    if (selectAll) {
      setSelectedUserIds(filteredUsers.map((u) => u._id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const getPathsForUser = (userId) => {
    const userAccess = accessMap[userId];
    // If explicitly set, use it
    if (userAccess !== undefined) return userAccess;
    // Default: employee menu shows all paths
    return allPaths;
  };

  const togglePath = (path) => {
    // Apply to all selected users (only update local state, don't save yet)
    setAccessMapState((prev) => {
      const updated = { ...prev };
      selectedUserIds.forEach((userId) => {
        const current = prev[userId] !== undefined ? prev[userId] : allPaths;
        const hasPath = current.includes(path);
        const nextPaths = hasPath ? current.filter((p) => p !== path) : [...current, path];
        updated[userId] = nextPaths;
      });
      return updated;
    });
  };

  const toggleAll = (enabled) => {
    // Apply to all selected users (only update local state, don't save yet)
    setAccessMapState((prev) => {
      const updated = { ...prev };
      const nextPaths = enabled ? allPaths : [];
      selectedUserIds.forEach((userId) => {
        updated[userId] = nextPaths;
      });
      return updated;
    });
  };

  const toggleCategoryPaths = (paths, enable) => {
    // Apply to all selected users
    setAccessMapState((prev) => {
      const updated = { ...prev };
      selectedUserIds.forEach((userId) => {
        const current = prev[userId] !== undefined ? prev[userId] : allPaths;
        let nextPaths;
        if (enable) {
          // Add all paths that aren't already present
          const currentSet = new Set(current);
          paths.forEach(path => currentSet.add(path));
          nextPaths = Array.from(currentSet);
        } else {
          // Remove all paths
          nextPaths = current.filter(p => !paths.includes(p));
        }
        updated[userId] = nextPaths;
      });
      return updated;
    });
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const allUserIds = new Set([...Object.keys(accessMap), ...Object.keys(savedAccessMap)]);
    for (const userId of allUserIds) {
      const current = accessMap[userId];
      const saved = savedAccessMap[userId];
      const currentPaths = current !== undefined ? current : allPaths;
      const savedPaths = saved !== undefined ? saved : allPaths;

      // Compare arrays
      if (currentPaths.length !== savedPaths.length) return true;
      const currentSet = new Set(currentPaths);
      const savedSet = new Set(savedPaths);
      if (currentSet.size !== savedSet.size) return true;
      for (const path of currentSet) {
        if (!savedSet.has(path)) return true;
      }
    }
    return false;
  }, [accessMap, savedAccessMap, allPaths]);

  // Check if there are unsaved changes (routes)
  const hasUnsavedRouteChanges = useMemo(() => {
    const allUserIds = new Set([...Object.keys(routePermissionsMap), ...Object.keys(savedRoutePermissionsMap)]);
    for (const userId of allUserIds) {
      const current = routePermissionsMap[userId] || [];
      const saved = savedRoutePermissionsMap[userId] || [];

      if (current.length !== saved.length) return true;

      // Compare route objects
      const currentStr = JSON.stringify(current.sort((a, b) => a.path.localeCompare(b.path)));
      const savedStr = JSON.stringify(saved.sort((a, b) => a.path.localeCompare(b.path)));
      if (currentStr !== savedStr) return true;
    }
    return false;
  }, [routePermissionsMap, savedRoutePermissionsMap]);

  // Combined unsaved changes check
  const hasUnsavedChangesCombined = useMemo(() => {
    return hasUnsavedChanges || hasUnsavedRouteChanges;
  }, [hasUnsavedChanges, hasUnsavedRouteChanges]);

  // Save all changes (sidebar)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get all users that have changes (either in current or saved map)
      const allUserIds = new Set([...Object.keys(accessMap), ...Object.keys(savedAccessMap)]);

      if (allUserIds.size === 0) {
        setIsSaving(false);
        return;
      }

      // Group users by their paths to use bulk update efficiently
      const pathGroups = new Map();
      allUserIds.forEach((userId) => {
        const paths = accessMap[userId] !== undefined ? accessMap[userId] : allPaths;
        const key = JSON.stringify(paths.sort());
        if (!pathGroups.has(key)) {
          pathGroups.set(key, []);
        }
        pathGroups.get(key).push(userId);
      });

      // Save each group
      const savePromises = Array.from(pathGroups.entries()).map(([key, userIds]) => {
        const paths = JSON.parse(key);
        return setAccessForUsers(userIds, paths, scope);
      });

      await Promise.all(savePromises);

      // Update saved state to match current state
      setSavedAccessMap({ ...accessMap });

      // Dispatch event to notify sidebar to refresh
      selectedUserIds.forEach(userId => {
        window.dispatchEvent(new CustomEvent('sidebarAccessUpdated', {
          detail: { userId, scope, paths: accessMap[userId] || allPaths }
        }));
      });

      alert(`Successfully saved access for ${selectedUserIds.length} user(s). Sidebar will refresh automatically.`);
    } catch (err) {
      console.error('Failed to save access changes', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save route permissions
  const handleSaveRoutes = async () => {
    try {
      if (selectedUserIds.length === 0) {
        return;
      }

      // Build permissions map for selected users
      const permissionsMap = {};
      selectedUserIds.forEach(userId => {
        permissionsMap[userId] = routePermissionsMap[userId] || [];
      });

      await setRoutePermissionsForUsers(selectedUserIds, permissionsMap);

      // Update saved state
      setSavedRoutePermissionsMap({ ...routePermissionsMap });

      alert(`Successfully saved route permissions for ${selectedUserIds.length} user(s).`);
    } catch (err) {
      console.error('Failed to save route permissions', err);
      alert('Failed to save route permissions. Please try again.');
    }
  };

  const getPathState = (path) => {
    if (selectedUserIds.length === 0) return { checked: false, indeterminate: false };

    const userStates = selectedUserIds.map((userId) => {
      const userPaths = getPathsForUser(userId);
      return userPaths.includes(path);
    });

    const allChecked = userStates.every((state) => state === true);
    const someChecked = userStates.some((state) => state === true);

    return {
      checked: allChecked,
      indeterminate: someChecked && !allChecked
    };
  };

  // Route permissions helper functions
  const getRoutesForUser = (userId) => {
    return routePermissionsMap[userId] || [];
  };

  const toggleRouteMethod = (routePath, method) => {
    setRoutePermissionsMap((prev) => {
      const updated = { ...prev };
      selectedUserIds.forEach((userId) => {
        const userRoutes = prev[userId] || [];
        const routeIndex = userRoutes.findIndex(r => r.path === routePath);

        if (routeIndex >= 0) {
          const route = { ...userRoutes[routeIndex] };
          const methods = route.methods || [];
          const methodIndex = methods.indexOf(method);

          if (methodIndex >= 0) {
            // Remove method
            route.methods = methods.filter(m => m !== method);
            if (route.methods.length === 0) {
              // Remove route if no methods left
              updated[userId] = userRoutes.filter(r => r.path !== routePath);
            } else {
              updated[userId] = [...userRoutes];
              updated[userId][routeIndex] = route;
            }
          } else {
            // Add method
            route.methods = [...methods, method];
            updated[userId] = [...userRoutes];
            updated[userId][routeIndex] = route;
          }
        } else {
          // Add new route
          updated[userId] = [...userRoutes, { path: routePath, methods: [method], allowed: true }];
        }
      });
      return updated;
    });
  };

  const getRouteMethodState = (routePath, method) => {
    if (selectedUserIds.length === 0) return false;

    const userStates = selectedUserIds.map((userId) => {
      const routes = getRoutesForUser(userId);
      const route = routes.find(r => r.path === routePath);
      if (!route) return false;
      const methods = route.methods || [];
      return methods.includes(method) || methods.includes('ALL');
    });

    return userStates.every(state => state === true);
  };

  const toggleAllRouteMethods = (routePath, enable) => {
    setRoutePermissionsMap((prev) => {
      const updated = { ...prev };
      selectedUserIds.forEach((userId) => {
        const userRoutes = prev[userId] || [];
        const routeIndex = userRoutes.findIndex(r => r.path === routePath);

        if (enable) {
          // Enable all methods for this route
          const route = routeIndex >= 0 ? { ...userRoutes[routeIndex] } : { path: routePath, methods: [], allowed: true };
          const availableRoute = availableRoutes.find(r => r.path === routePath);
          if (availableRoute) {
            route.methods = [...availableRoute.methods];
            if (routeIndex >= 0) {
              updated[userId] = [...userRoutes];
              updated[userId][routeIndex] = route;
            } else {
              updated[userId] = [...userRoutes, route];
            }
          }
        } else {
          // Remove route entirely
          if (routeIndex >= 0) {
            updated[userId] = userRoutes.filter(r => r.path !== routePath);
          } else {
            updated[userId] = userRoutes;
          }
        }
      });
      return updated;
    });
  };

  const renderMenuControls = () => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500">
          Loading access settings...
        </div>
      );
    }

    if (selectedUserIds.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-gray-500">
          Select one or more users to manage sidebar access.
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {selectedUsers.length} {selectedUsers.length === 1 ? 'User' : 'Users'} Selected
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedUsers.map((user) => (
                <span
                  key={user._id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                >
                  {user.name || user.email}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Control which sidebar items the selected users can see. Changes apply to all selected users. Click Save to persist changes.
            </p>
            {hasUnsavedChanges && (
              <p className="text-sm text-orange-600 font-medium mt-1">
                You have unsaved changes
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleAll(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Enable All
            </button>
            <button
              onClick={() => toggleAll(false)}
              className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200"
            >
              Disable All
            </button>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving || selectedUserIds.length === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium ${hasUnsavedChanges && !isSaving && selectedUserIds.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-8 divide-y divide-gray-200">
          {menuItems.map((item) => {
            if (item.subItems) {
              // Get all non-section paths for this category
              const categoryPaths = item.subItems
                .filter(sub => !sub.isSection && sub.path !== '#')
                .map(sub => sub.path);

              // Check if all category items are enabled for all selected users
              const allCategoryEnabled = categoryPaths.length > 0 &&
                categoryPaths.every(path => {
                  const state = getPathState(path);
                  return state.checked;
                });

              // Group sub-items by sections
              const sections = [];
              let currentSection = null;

              item.subItems.forEach((sub) => {
                if (sub.isSection) {
                  currentSection = {
                    label: sub.label,
                    items: []
                  };
                  sections.push(currentSection);
                } else if (sub.path !== '#') {
                  if (!currentSection) {
                    currentSection = { label: null, items: [] };
                    sections.push(currentSection);
                  }
                  currentSection.items.push(sub);
                }
              });

              return (
                <div key={item.label} className="pt-8 first:pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const IconComponent = getIconComponent(item.icon);
                        return IconComponent ? (
                          <span className="text-xl text-blue-600">
                            <IconComponent />
                          </span>
                        ) : null;
                      })()}
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">{item.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {categoryPaths.length} {categoryPaths.length === 1 ? 'option' : 'options'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCategoryPaths(categoryPaths, true)}
                        className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${allCategoryEnabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                      >
                        {allCategoryEnabled ? 'All Enabled' : 'Enable All'}
                      </button>
                      <button
                        onClick={() => toggleCategoryPaths(categoryPaths, false)}
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 pl-1">
                    {sections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="space-y-2">
                        {section.label && (
                          <div className="mb-2">
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              {section.label}
                            </h5>
                          </div>
                        )}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {section.items.map((sub) => {
                            const pathState = getPathState(sub.path);
                            return (
                              <label
                                key={sub.path}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${pathState.checked
                                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                  }`}
                              >
                                <div className="flex items-center justify-center w-5 h-5">
                                  <input
                                    type="checkbox"
                                    checked={pathState.checked}
                                    ref={(el) => {
                                      if (el) el.indeterminate = pathState.indeterminate;
                                    }}
                                    onChange={() => togglePath(sub.path)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                  />
                                </div>
                                <span className={`text-sm ${pathState.checked ? 'text-gray-900 font-medium' : 'text-gray-600'
                                  }`}>
                                  {sub.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const pathState = getPathState(item.path);

            return (
              <div key={item.path} className="pt-8 first:pt-0">
                <label className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${pathState.checked
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}>
                  <input
                    type="checkbox"
                    checked={pathState.checked}
                    ref={(el) => {
                      if (el) el.indeterminate = pathState.indeterminate;
                    }}
                    onChange={() => togglePath(item.path)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    {(() => {
                      const IconComponent = getIconComponent(item.icon);
                      return IconComponent ? (
                        <span className="text-xl text-blue-600">
                          <IconComponent />
                        </span>
                      ) : null;
                    })()}
                    <div>
                      <span className={`text-base font-medium block ${pathState.checked ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                        {item.label}
                      </span>
                      <span className="text-xs text-gray-400">Main Menu Item</span>
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Changes apply to all {selectedUsers.length} selected {selectedUsers.length === 1 ? 'user' : 'users'}.
          {hasUnsavedChanges && (
            <span className="text-orange-600 font-medium ml-1">Don't forget to save!</span>
          )}
        </p>
      </div>
    );
  };

  // Render function is simply renderMenuControls from above

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Administration</h2>
            <p className="text-sm text-gray-500">
              Manage sidebar access for users.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-48 md:w-64"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border rounded-md px-2 py-2 text-sm"
          >
            <option value="all">All roles</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded-md px-2 py-2 text-sm"
          >
            <option value="all">All departments</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border rounded-md px-2 py-2 text-sm"
          >
            <option value="all">All companies</option>
            {companyOptions.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Users</h3>
            <div className="flex gap-1">
              <button
                onClick={() => toggleAllUsers(true)}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                title="Select All"
              >
                All
              </button>
              <button
                onClick={() => toggleAllUsers(false)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                title="Deselect All"
              >
                None
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user._id);
              return (
                <label
                  key={user._id}
                  className={`flex items-start gap-3 w-full text-left p-3 rounded-md border transition cursor-pointer ${isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleUserSelection(user._id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{user.name || 'Unnamed user'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    {user.employeeId && (
                      <div className="text-[11px] text-gray-400">ID: {user.employeeId}</div>
                    )}
                  </div>
                </label>
              );
            })}
            {!filteredUsers.length && (
              <div className="text-sm text-gray-500">No users match this search.</div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          {renderMenuControls()}
        </div>
      </div>
    </div>
  );
};

export default AdministrationAccess;

