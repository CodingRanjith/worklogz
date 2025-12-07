import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import { menuItems } from '../../components/admin-dashboard/layout/Sidebar';
import { employeeMenuItems } from '../../components/employee/EmployeeNavigation';
import {
  getAccessMap,
  getAllMenuPaths,
  setAccessForUser
} from '../../utils/sidebarAccess';

const AdministrationAccess = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [scope, setScope] = useState('admin'); // 'admin' or 'employee'
  const [accessMap, setAccessMapState] = useState(getAccessMap('admin'));
  const allPaths = useMemo(
    () => getAllMenuPaths(scope === 'admin' ? menuItems : employeeMenuItems),
    [scope]
  );
  const currentMenuItems = scope === 'admin' ? menuItems : employeeMenuItems;

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

  // Refresh access map when scope changes so UI shows correct values
  useEffect(() => {
    setAccessMapState(getAccessMap(scope));
  }, [scope]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.employeeId?.toLowerCase().includes(query)
    );
  }, [search, users]);

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
    // Default: admin menu starts empty (all disabled), employee menu shows all
    return scope === 'admin' ? [] : allPaths;
  };

  const togglePath = (path) => {
    // Apply to all selected users
    setAccessMapState((prev) => {
      const updated = { ...prev };
      selectedUserIds.forEach((userId) => {
        const defaultPaths = scope === 'admin' ? [] : allPaths;
        const current = prev[userId] !== undefined ? prev[userId] : defaultPaths;
        const hasPath = current.includes(path);
        const nextPaths = hasPath ? current.filter((p) => p !== path) : [...current, path];
        updated[userId] = nextPaths;
        setAccessForUser(userId, nextPaths, scope);
      });
      return updated;
    });
  };

  const toggleAll = (enabled) => {
    // Apply to all selected users
    setAccessMapState((prev) => {
      const updated = { ...prev };
      const nextPaths = enabled ? allPaths : [];
      selectedUserIds.forEach((userId) => {
        updated[userId] = nextPaths;
        setAccessForUser(userId, nextPaths, scope);
      });
      return updated;
    });
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
              Control which sidebar items the selected users can see. Changes apply to all selected users and save locally.
            </p>
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
          </div>
        </div>

        <div className="space-y-4">
          {currentMenuItems.map((item) => {
            if (item.subItems) {
              return (
                <div key={item.label} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium text-gray-800">{item.label}</span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {item.subItems.map((sub) => {
                      const pathState = getPathState(sub.path);
                      return (
                        <label
                          key={sub.path}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={pathState.checked}
                            ref={(el) => {
                              if (el) el.indeterminate = pathState.indeterminate;
                            }}
                            onChange={() => togglePath(sub.path)}
                          />
                          <span className="text-sm text-gray-800">{sub.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const pathState = getPathState(item.path);

            return (
              <label
                key={item.path}
                className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={pathState.checked}
                  ref={(el) => {
                    if (el) el.indeterminate = pathState.indeterminate;
                  }}
                  onChange={() => togglePath(item.path)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-800">{item.label}</span>
                </div>
              </label>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Changes apply to all {selectedUsers.length} selected {selectedUsers.length === 1 ? 'user' : 'users'}.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Administration</h2>
          <p className="text-sm text-gray-500">
            Manage which sidebar options are visible for each user.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-md overflow-hidden border text-sm">
            <button
              onClick={() => setScope('admin')}
              className={`px-3 py-2 ${scope === 'admin' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Admin Menu
            </button>
            <button
              onClick={() => setScope('employee')}
              className={`px-3 py-2 ${scope === 'employee' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Employee Menu
            </button>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-64"
          />
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

