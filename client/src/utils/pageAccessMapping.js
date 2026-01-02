// Unified page access mapping
// Maps sidebar menu paths and API routes to pages/features

import { ROUTE_PAGE_MAPPING } from './routePageMapping';

// Map sidebar menu paths to page names
export const SIDEBAR_PATH_TO_PAGE = {
  // Home & Dashboard
  '/home': 'Home',
  '/dashboard': 'Home',
  
  // Attendance
  '/attendance': 'Attendance',
  
  // Users & Employees
  '/all-users': 'Users & Employees',
  '/employees': 'Users & Employees',
  '/pending-users': 'Users & Employees',
  '/team-management': 'Users & Employees',
  '/employee/people': 'Users & Employees',
  
  // Tasks & Timesheets
  '/timesheet': 'Tasks & Timesheets',
  '/task-manager': 'Tasks & Timesheets',
  
  // Leave Management
  '/apply-leave': 'Leave Management',
  '/calendar': 'Leave Management',
  
  // Salary & Finance
  '/my-earnings': 'Salary & Finance',
  '/salary': 'Salary & Finance',
  
  // Projects & Workspace
  '/employee/workspace': 'Projects & Workspace',
  
  // Community
  '/employee/community': 'Community',
  
  // Achievements & Goals
  '/goals-achievements': 'Achievements & Goals',
  
  // Assessments
  '/employee/assessments': 'Assessments',
  
  // Applications
  '/employee/applications': 'Applications',
  
  // Helpdesk
  '/helpdesk': 'Helpdesk',
  
  // Documents
  '/documents': 'Documents',
  
  // Skill Development
  '/skill-development': 'Achievements & Goals',
  
  // Performance
  '/performance': 'Achievements & Goals',
};

// Get page name for a sidebar path
export const getPageForSidebarPath = (path) => {
  return SIDEBAR_PATH_TO_PAGE[path] || 'Other';
};

// Get all pages with their sidebar paths and API routes
export const getPagesWithAccess = (menuItems, availableRoutes) => {
  const pages = {};
  
  // Initialize pages from route mapping
  Object.keys(ROUTE_PAGE_MAPPING).forEach(pageKey => {
    pages[pageKey] = {
      ...ROUTE_PAGE_MAPPING[pageKey],
      sidebarPaths: [],
      apiRoutes: []
    };
  });
  
  // Add "Other" page
  pages['Other'] = {
    label: 'Other',
    icon: 'FiCode',
    sidebarPaths: [],
    apiRoutes: []
  };
  
  // Map sidebar menu items to pages
  const mapSidebarItems = (items) => {
    items.forEach(item => {
      if (item.path && item.path !== '#') {
        const page = getPageForSidebarPath(item.path);
        if (!pages[page]) {
          pages[page] = {
            label: page,
            icon: 'FiCode',
            sidebarPaths: [],
            apiRoutes: []
          };
        }
        if (!pages[page].sidebarPaths.find(p => p.path === item.path)) {
          pages[page].sidebarPaths.push({
            path: item.path,
            label: item.label,
            icon: item.icon
          });
        }
      }
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach(sub => {
          if (sub.path && sub.path !== '#' && !sub.isSection) {
            const page = getPageForSidebarPath(sub.path);
            if (!pages[page]) {
              pages[page] = {
                label: page,
                icon: 'FiCode',
                sidebarPaths: [],
                apiRoutes: []
              };
            }
            if (!pages[page].sidebarPaths.find(p => p.path === sub.path)) {
              pages[page].sidebarPaths.push({
                path: sub.path,
                label: sub.label,
                icon: sub.icon
              });
            }
          }
        });
      }
    });
  };
  
  mapSidebarItems(menuItems);
  
  // Map API routes to pages using routePageMapping
  const { groupRoutesByPages } = require('./routePageMapping');
  const groupedRoutes = groupRoutesByPages(availableRoutes);
  
  Object.entries(groupedRoutes).forEach(([pageKey, pageData]) => {
    if (!pages[pageKey]) {
      pages[pageKey] = {
        label: pageKey,
        icon: 'FiCode',
        sidebarPaths: [],
        apiRoutes: []
      };
    }
    pages[pageKey].apiRoutes = pageData.routes || [];
    // Merge label and icon if not set
    if (pageData.label && !pages[pageKey].label) {
      pages[pageKey].label = pageData.label;
    }
    if (pageData.icon && !pages[pageKey].icon) {
      pages[pageKey].icon = pageData.icon;
    }
  });
  
  // Filter to show pages that have either sidebar items OR API routes (or both)
  // This ensures pages with only API routes (no sidebar items) are still shown
  const filteredPages = {};
  Object.entries(pages).forEach(([key, page]) => {
    if (page.sidebarPaths.length > 0 || page.apiRoutes.length > 0) {
      filteredPages[key] = page;
    }
  });
  
  return filteredPages;
};

