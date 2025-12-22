import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
  FiMove,
} from 'react-icons/fi';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { API_ENDPOINTS } from '../../utils/api';
import { getEmployeeMenuItems } from '../../components/employee-dashboard/layout/EmployeeSidebar';
import { getAllMenuPaths, setAccessForUsers } from '../../utils/sidebarAccess';
import { normalizeMenuOrder } from '../../utils/sidebarMenu';

const ICON_OPTIONS = [
  { value: '', label: 'No icon', Icon: null },
  { value: 'FiHome', label: 'Home', Icon: FiHome },
  { value: 'FiClock', label: 'Clock / Time', Icon: FiClock },
  { value: 'FiUsers', label: 'Users / People', Icon: FiUsers },
  { value: 'FiBriefcase', label: 'Projects / Work', Icon: FiBriefcase },
  { value: 'FiDollarSign', label: 'Finance', Icon: FiDollarSign },
  { value: 'FiCalendar', label: 'Calendar', Icon: FiCalendar },
  { value: 'FiFolder', label: 'Documents', Icon: FiFolder },
  { value: 'FiShoppingCart', label: 'Sales / CRM', Icon: FiShoppingCart },
  { value: 'FiPieChart', label: 'Analytics', Icon: FiPieChart },
  { value: 'FiBookOpen', label: 'Learning', Icon: FiBookOpen },
  { value: 'FiTarget', label: 'Goals', Icon: FiTarget },
  { value: 'FiMessageCircle', label: 'Communication', Icon: FiMessageCircle },
  { value: 'FiActivity', label: 'Performance', Icon: FiActivity },
  { value: 'FiShield', label: 'Security', Icon: FiShield },
  { value: 'FiZap', label: 'AI & Automation', Icon: FiZap },
  { value: 'FiCode', label: 'Developer / Platform', Icon: FiCode },
  { value: 'FiSettings', label: 'Settings', Icon: FiSettings },
  { value: 'FiBarChart2', label: 'Reports / Dashboard', Icon: FiBarChart2 },
  { value: 'FiFileText', label: 'Reports / Docs', Icon: FiFileText },
];

// Helper to get icon component from string or component
const getIconComponent = (icon) => {
  if (!icon) return null;
  // If it's already a React component/element, return it
  if (React.isValidElement(icon)) return icon;
  // If it's a string, find the matching icon component
  if (typeof icon === 'string') {
    const iconOption = ICON_OPTIONS.find((opt) => opt.value === icon);
    return iconOption?.Icon || null;
  }
  return null;
};

const MasterControl = () => {
  const token = localStorage.getItem('token');

  // User data & filters
  const [users, setUsers] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const [isApplying, setIsApplying] = useState(false);

  // Sidebar menu structure (same as employee sidebar) - editable
  const [menuItems, setMenuItems] = useState([]);
  const employeeMenuItemsFallback = useMemo(() => getEmployeeMenuItems(), []);
  const allPaths = useMemo(
    () => getAllMenuPaths(menuItems.length ? menuItems : employeeMenuItemsFallback),
    [menuItems, employeeMenuItemsFallback]
  );

  const reindexMenu = (items = []) =>
    normalizeMenuOrder(
      items.map((item, idx) => ({
        ...item,
        order: idx,
        subItems: (item.subItems || []).map((sub, sIdx) => ({
          ...sub,
          order: typeof sub.order === 'number' ? sub.order : sIdx,
        })),
      }))
    );

  // Master template paths for current filter (what should be visible)
  const [segmentPaths, setSegmentPaths] = useState(allPaths);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getUsers, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data || []);
      } catch (err) {
        console.error('Failed to load users for Master Control', err);
      }
    };

    fetchUsers();
  }, [token]);

  // Filter options
  const companyOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => u.company && set.add(u.company));
    return Array.from(set).sort();
  }, [users]);

  const roleOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => u.role && set.add(u.role));
    return Array.from(set).sort();
  }, [users]);

  const departmentOptions = useMemo(() => {
    const set = new Set();
    users.forEach((u) => u.department && set.add(u.department));
    return Array.from(set).sort();
  }, [users]);

  // Load current sidebar menu structure from backend
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getSidebarMenu('employee'), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let items = res.data?.items || [];
        if (!items.length) {
          // Fallback: convert static JSX menu into plain JSON-safe objects
          items = employeeMenuItemsFallback.map((item, idx) => ({
            id: `fallback-${idx}`,
            label: item.label,
            icon: '', // optional: map icon name if you want
            path: item.path || '',
            order: idx,
            subItems: (item.subItems || []).map((sub, sIdx) => ({
              id: `fallback-${idx}-${sIdx}`,
              label: sub.label,
              path: sub.path || '',
              isSection: !!sub.isSection,
              order: sIdx,
              icon: '',
            })),
          }));
        }
        setMenuItems(normalizeMenuOrder(items));
      } catch (err) {
        console.error('Failed to load sidebar menu for Master Control', err);
        const items = employeeMenuItemsFallback.map((item, idx) => ({
          id: `fallback-${idx}`,
          label: item.label,
          icon: '',
          path: item.path || '',
          order: idx,
          subItems: (item.subItems || []).map((sub, sIdx) => ({
            id: `fallback-${idx}-${sIdx}`,
            label: sub.label,
            path: sub.path || '',
            isSection: !!sub.isSection,
            order: sIdx,
            icon: '',
          })),
        }));
        setMenuItems(normalizeMenuOrder(items));
      }
    };

    loadMenu();
  }, [token, employeeMenuItemsFallback]);

  // Users affected by current master filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesCompany = selectedCompany === 'all' || u.company === selectedCompany;
      const matchesRole = selectedRole === 'all' || u.role === selectedRole;
      const matchesDept = selectedDepartment === 'all' || u.department === selectedDepartment;
      return matchesCompany && matchesRole && matchesDept;
    });
  }, [users, selectedCompany, selectedRole, selectedDepartment]);

  const clearFilters = () => {
    setSelectedCompany('all');
    setSelectedRole('all');
    setSelectedDepartment('all');
  };

  // Toggle helpers for master template
  const togglePath = (path) => {
    setSegmentPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const toggleCategoryPaths = (paths, enable) => {
    setSegmentPaths((prev) => {
      const currentSet = new Set(prev);
      if (enable) {
        paths.forEach((p) => currentSet.add(p));
      } else {
        paths.forEach((p) => currentSet.delete(p));
      }
      return Array.from(currentSet);
    });
  };

  const toggleAll = (enable) => {
    setSegmentPaths(enable ? allPaths : []);
  };

  const isPathEnabled = (path) => segmentPaths.includes(path);

  // Apply template to all filtered users
  const handleApplyToUsers = async () => {
    if (!filteredUsers.length) {
      Swal.fire({
        icon: 'info',
        title: 'No Matching Users',
        text: 'No users match the selected company/role/department filters.',
      });
      return;
    }
    setIsApplying(true);
    try {
      const userIds = filteredUsers.map((u) => u._id);
      await setAccessForUsers(userIds, segmentPaths, 'employee');
      Swal.fire({
        icon: 'success',
        title: 'Sidebar Access Updated',
        text: `Applied master sidebar settings to ${userIds.length} user${userIds.length === 1 ? '' : 's'}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Failed to apply master control settings', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Apply Settings',
        text: 'Failed to apply master control settings. Please try again.',
      });
    } finally {
      setIsApplying(false);
    }
  };

  // -------- Sidebar menu CRUD helpers --------
  const handleAddCategory = () => {
    setMenuItems((prev) =>
      reindexMenu([
        ...prev,
        {
          id: `new-${Date.now()}-${prev.length}`,
          label: 'New Category',
          icon: '',
          path: '',
          order: prev.length,
          subItems: [],
        },
      ])
    );
  };

  const handleDeleteCategory = (index) => {
    setMenuItems((prev) => reindexMenu(prev.filter((_, i) => i !== index)));
  };

  const handleCategoryChange = (index, field, value) => {
    setMenuItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddSubItem = (categoryIndex) => {
    setMenuItems((prev) =>
      reindexMenu(
        prev.map((item, i) =>
          i === categoryIndex
            ? {
                ...item,
                subItems: [
                  ...(item.subItems || []),
                  {
                    label: 'New Item',
                    path: '/new-path',
                    isSection: false,
                    order: (item.subItems || []).length,
                    icon: '',
                  },
                ],
              }
            : item
        )
      )
    );
  };

  const handleSubItemChange = (categoryIndex, subIndex, field, value) => {
    setMenuItems((prev) =>
      reindexMenu(
        prev.map((item, i) => {
          if (i !== categoryIndex) return item;
          const updatedSubItems = (item.subItems || []).map((sub, si) =>
            si === subIndex
              ? {
                  ...sub,
                  [field]: field === 'isSection' ? !!value : value,
                  path: field === 'isSection' && value ? '#' : sub.path,
                }
              : sub
          );
          return { ...item, subItems: updatedSubItems };
        })
      )
    );
  };

  const handleDeleteSubItem = (categoryIndex, subIndex) => {
    setMenuItems((prev) =>
      reindexMenu(
        prev.map((item, i) => {
          if (i !== categoryIndex) return item;
          const updatedSubItems = (item.subItems || []).filter((_, si) => si !== subIndex);
          return { ...item, subItems: updatedSubItems };
        })
      )
    );
  };

  // Drag & drop ordering
  const handleDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'CATEGORY') {
      const updated = Array.from(menuItems);
      const [moved] = updated.splice(source.index, 1);
      updated.splice(destination.index, 0, moved);
      const reindexed = updated.map((item, idx) => ({ ...item, order: idx }));
      setMenuItems(normalizeMenuOrder(reindexed));
      return;
    }

    if (type === 'SUBITEM') {
      const sourceCat = parseInt(source.droppableId.replace('sub-', ''), 10);
      const destCat = parseInt(destination.droppableId.replace('sub-', ''), 10);
      if (Number.isNaN(sourceCat) || Number.isNaN(destCat) || sourceCat !== destCat) return;

      const updated = Array.from(menuItems);
      const targetCategory = updated[sourceCat];
      if (!targetCategory) return;

      const subItems = Array.from(targetCategory.subItems || []);
      const [movedSub] = subItems.splice(source.index, 1);
      subItems.splice(destination.index, 0, movedSub);

      updated[sourceCat] = {
        ...targetCategory,
        subItems: subItems.map((sub, idx) => ({ ...sub, order: idx })),
      };

      setMenuItems(normalizeMenuOrder(updated));
    }
  };

  const handleSaveSidebarStructure = async () => {
    try {
      const orderedMenu = normalizeMenuOrder(menuItems);
      // Strip any non‑JSON data (just to be safe)
      const payloadItems = orderedMenu.map((item, idx) => ({
        label: item.label,
        icon: item.icon || '',
        path: item.path || '',
        order: typeof item.order === 'number' ? item.order : idx,
        subItems: (item.subItems || []).map((sub, sIdx) => ({
          label: sub.label,
          path: sub.path || '',
          isSection: !!sub.isSection,
          order: typeof sub.order === 'number' ? sub.order : sIdx,
          icon: sub.icon || '',
        })),
      }));

      await axios.put(
        API_ENDPOINTS.updateSidebarMenu('employee'),
        { items: payloadItems },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      Swal.fire({
        icon: 'success',
        title: 'Sidebar Saved',
        text: 'Sidebar structure saved successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Failed to save sidebar structure', err);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Failed to save sidebar structure. Please try again.',
      });
    }
  };

  const renderMenuControls = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Sidebar Template</h3>
              <p className="text-sm text-gray-500">
                Choose which employee sidebar items should be visible by default for this company /
                role / department segment. You can also edit the sidebar structure below.
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
              <button
                onClick={handleApplyToUsers}
                disabled={isApplying || !filteredUsers.length}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filteredUsers.length && !isApplying
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isApplying
                  ? 'Applying...'
                  : `Apply to ${filteredUsers.length} user${
                      filteredUsers.length === 1 ? '' : 's'
                    }`}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Sidebar Structure</h4>
              <p className="text-xs text-gray-500">
                Add, rename, or remove categories and menu items. These definitions are stored in
                the database and used by the employee sidebar.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={handleSaveSidebarStructure}
                className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Save Sidebar
              </button>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided) => (
              <div
                className="space-y-6 mt-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {menuItems.map((item, categoryIndex) => {
                  if (item.subItems) {
                    const normalizedSubItems = normalizeMenuOrder(item.subItems || []);
                    const categoryPaths = normalizedSubItems
                      .filter((sub) => !sub.isSection && sub.path && sub.path !== '#')
                      .map((sub) => sub.path);

                    const allCategoryEnabled =
                      categoryPaths.length > 0 &&
                      categoryPaths.every((path) => segmentPaths.includes(path));

                    return (
                      <Draggable
                        key={item._id || item.id || item.path || `cat-${categoryIndex}`}
                        draggableId={item._id || item.id || item.path || `cat-${categoryIndex}`}
                        index={categoryIndex}
                      >
                        {(catProvided) => (
                          <div
                            ref={catProvided.innerRef}
                            {...catProvided.draggableProps}
                            className="border rounded-lg p-5 bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-3 flex-1 mr-4">
                                <span
                                  {...catProvided.dragHandleProps}
                                  className="text-gray-400 hover:text-gray-600 cursor-grab"
                                  title="Drag to reorder category"
                                >
                                  <FiMove />
                                </span>
                                {(() => {
                                  const IconComponent = getIconComponent(item.icon);
                                  return IconComponent ? (
                                    <span className="text-xl text-gray-700 flex-shrink-0">
                                      <IconComponent />
                                    </span>
                                  ) : null;
                                })()}
                                <div className="flex flex-col gap-2 flex-1">
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="text"
                                      value={item.label}
                                      onChange={(e) =>
                                        handleCategoryChange(categoryIndex, 'label', e.target.value)
                                      }
                                      className="border rounded-md px-2 py-1 text-sm flex-1"
                                      placeholder="Category label"
                                    />
                                    <div className="flex items-center gap-2">
                                      <select
                                        value={item.icon || ''}
                                        onChange={(e) =>
                                          handleCategoryChange(categoryIndex, 'icon', e.target.value)
                                        }
                                        className="border rounded-md px-2 py-1 text-xs"
                                      >
                                        {ICON_OPTIONS.map((opt) => (
                                          <option key={opt.value || 'none'} value={opt.value}>
                                            {opt.label}
                                          </option>
                                        ))}
                                      </select>
                                      {(() => {
                                        const IconDef =
                                          ICON_OPTIONS.find((o) => o.value === item.icon)?.Icon ||
                                          null;
                                        return IconDef ? (
                                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 text-gray-700">
                                            <IconDef size={14} />
                                          </span>
                                        ) : null;
                                      })()}
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {categoryPaths.length}{' '}
                                    {categoryPaths.length === 1 ? 'option' : 'options'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => toggleCategoryPaths(categoryPaths, true)}
                                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                                    allCategoryEnabled
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}
                                >
                                  {allCategoryEnabled ? 'All Enabled' : 'Enable All'}
                                </button>
                                <button
                                  onClick={() => toggleCategoryPaths(categoryPaths, false)}
                                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
                                >
                                  Disable All
                                </button>
                                <button
                                  onClick={() => handleAddSubItem(categoryIndex)}
                                  className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-md font-medium hover:bg-indigo-200 transition-colors"
                                >
                                  Add Item
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(categoryIndex)}
                                  className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md font-medium hover:bg-red-200 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <Droppable
                              droppableId={`sub-${categoryIndex}`}
                              type="SUBITEM"
                              direction="vertical"
                            >
                              {(subProvided) => (
                                <div
                                  ref={subProvided.innerRef}
                                  {...subProvided.droppableProps}
                                  className="space-y-2"
                                >
                                  {normalizedSubItems.map((sub, subIndex) => {
                                    const checked = isPathEnabled(sub.path);
                                    const draggableId =
                                      sub._id ||
                                      sub.id ||
                                      `${categoryIndex}-${sub.path || 'section'}-${subIndex}`;
                                    return (
                                      <Draggable
                                        key={draggableId}
                                        draggableId={draggableId}
                                        index={subIndex}
                                      >
                                        {(subProvidedInner) => (
                                          <div
                                            ref={subProvidedInner.innerRef}
                                            {...subProvidedInner.draggableProps}
                                            className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${
                                              checked && !sub.isSection
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-white border-gray-200'
                                            }`}
                                          >
                                            <span
                                              {...subProvidedInner.dragHandleProps}
                                              className="text-gray-400 hover:text-gray-600 cursor-grab mt-1"
                                              title="Drag to reorder item"
                                            >
                                              <FiMove size={14} />
                                            </span>
                                            <div className="flex-1 flex flex-col gap-2">
                                              <div className="flex items-center gap-2">
                                                {!sub.isSection && (
                                                  <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => togglePath(sub.path)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                  />
                                                )}
                                                <input
                                                  type="text"
                                                  value={sub.label}
                                                  onChange={(e) =>
                                                    handleSubItemChange(
                                                      categoryIndex,
                                                      subIndex,
                                                      'label',
                                                      e.target.value
                                                    )
                                                  }
                                                  className="border rounded-md px-2 py-1 text-xs flex-1"
                                                  placeholder="Item label"
                                                />
                                                <label className="flex items-center gap-1 text-xs text-gray-600">
                                                  <input
                                                    type="checkbox"
                                                    checked={!!sub.isSection}
                                                    onChange={(e) =>
                                                      handleSubItemChange(
                                                        categoryIndex,
                                                        subIndex,
                                                        'isSection',
                                                        e.target.checked
                                                      )
                                                    }
                                                  />
                                                  Section
                                                </label>
                                              </div>
                                              {!sub.isSection && (
                                                <input
                                                  type="text"
                                                  value={sub.path}
                                                  onChange={(e) =>
                                                    handleSubItemChange(
                                                      categoryIndex,
                                                      subIndex,
                                                      'path',
                                                      e.target.value
                                                    )
                                                  }
                                                  className="border rounded-md px-2 py-1 text-xs"
                                                  placeholder="/route-path"
                                                />
                                              )}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteSubItem(categoryIndex, subIndex)}
                                              className="text-xs text-red-600 hover:text-red-800 mt-1"
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                  {subProvided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        )}
                      </Draggable>
                    );
                  }

                  const checked = isPathEnabled(item.path);

                  const dragId = item._id || item.id || item.path || `item-${categoryIndex}`;
                  return (
                    <Draggable
                      key={dragId}
                      draggableId={dragId}
                      index={categoryIndex}
                    >
                      {(catProvided) => (
                        <div
                          ref={catProvided.innerRef}
                          {...catProvided.draggableProps}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <label className="flex items-center gap-3 cursor-pointer">
                            <span
                              {...catProvided.dragHandleProps}
                              className="text-gray-400 hover:text-gray-600 cursor-grab"
                              title="Drag to reorder item"
                            >
                              <FiMove />
                            </span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePath(item.path)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              {(() => {
                                const IconComponent = getIconComponent(item.icon);
                                return IconComponent ? (
                                  <span className="text-xl text-gray-700">
                                    <IconComponent />
                                  </span>
                                ) : null;
                              })()}
                              <span
                                className={`text-sm font-medium ${
                                  checked ? 'text-gray-900' : 'text-gray-700'
                                }`}
                              >
                                {item.label}
                              </span>
                            </div>
                          </label>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <p className="text-xs text-gray-500 mt-3">
          This template will be applied to all users matching the selected filters when you click
          &quot;Apply&quot;. You can still fine-tune individual users in Administration &gt; Access
          Control.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Master Control</h2>
            <p className="text-sm text-gray-500">
              Define sidebar access templates by company, role, and department, then apply them to
              matching users in one click.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
            {(selectedCompany !== 'all' ||
              selectedRole !== 'all' ||
              selectedDepartment !== 'all') && (
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

        <div className="text-xs text-gray-600">
          Matching users:{' '}
          <span className="font-semibold text-gray-900">{filteredUsers.length}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        <div className="md:col-span-1">{renderMenuControls()}</div>
      </div>
    </div>
  );
};

export default MasterControl;
