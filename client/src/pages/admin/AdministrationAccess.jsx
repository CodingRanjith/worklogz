import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import { getEmployeeMenuItems } from '../../components/employee-dashboard/layout/EmployeeSidebar';
import {
  getAccessMap,
  getAllMenuPaths,
  setAccessForUsers
} from '../../utils/sidebarAccess';

const AdministrationAccess = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [accessMap, setAccessMapState] = useState({});
  const [savedAccessMap, setSavedAccessMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const scope = 'employee'; // Only employee menu now
  const employeeMenuItems = useMemo(() => getEmployeeMenuItems(), []);
  const allPaths = useMemo(
    () => getAllMenuPaths(employeeMenuItems),
    [employeeMenuItems]
  );
  const currentMenuItems = employeeMenuItems;

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

  // Save all changes
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
    } catch (err) {
      console.error('Failed to save access changes', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
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
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                hasUnsavedChanges && !isSaving && selectedUserIds.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {currentMenuItems.map((item) => {
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
                <div key={item.label} className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
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
                        className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                          allCategoryEnabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        title="Enable all items in this category"
                      >
                        {allCategoryEnabled ? 'All Enabled' : 'Enable All'}
                      </button>
                      <button
                        onClick={() => toggleCategoryPaths(categoryPaths, false)}
                        className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
                        title="Disable all items in this category"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {sections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="space-y-2">
                        {section.label && (
                          <div className="px-2 py-1.5 bg-gray-200 rounded-md">
                            <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {section.label}
                            </h5>
                          </div>
                        )}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-2">
                          {section.items.map((sub) => {
                            const pathState = getPathState(sub.path);
                            return (
                              <label
                                key={sub.path}
                                className={`flex items-center gap-2 p-2.5 rounded-md border transition-colors cursor-pointer ${
                                  pathState.checked
                                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={pathState.checked}
                                  ref={(el) => {
                                    if (el) el.indeterminate = pathState.indeterminate;
                                  }}
                                  onChange={() => togglePath(sub.path)}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className={`text-sm ${
                                  pathState.checked ? 'text-gray-900 font-medium' : 'text-gray-700'
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
              <div key={item.path} className="border rounded-lg p-4 bg-gray-50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pathState.checked}
                    ref={(el) => {
                      if (el) el.indeterminate = pathState.indeterminate;
                    }}
                    onChange={() => togglePath(item.path)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">{item.icon}</span>
                    <span className={`text-sm font-medium ${
                      pathState.checked ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </span>
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Administration</h2>
            <p className="text-sm text-gray-500">
              Manage which employee sidebar options are visible for each user.
            </p>
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
                  className={`flex items-start gap-3 w-full text-left p-3 rounded-md border transition cursor-pointer ${
                    isSelected
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

        <div className="md:col-span-2">{renderMenuControls()}</div>
      </div>
    </div>
  );
};

export default AdministrationAccess;

