// Route to Page/Feature mapping
// Groups API routes by the pages/features they belong to

export const ROUTE_PAGE_MAPPING = {
  'Home': {
    label: 'Home',
    icon: 'FiHome',
    routes: [
      '/users/me',
      '/api/notifications',
      '/api/notifications/unread-count',
      '/api/notifications/read-all',
      '/api/admin/summary',
      '/api/admin/recent-attendance',
    ]
  },
  'Attendance': {
    label: 'Attendance',
    icon: 'FiClock',
    routes: [
      '/attendance',
      '/attendance/all',
      '/attendance/me',
      '/attendance/last',
      '/attendance/user/:userId',
      '/attendance/date/:date',
      '/schedules',
      '/schedules/:userId',
    ]
  },
  'Users & Employees': {
    label: 'Users & Employees',
    icon: 'FiUsers',
    routes: [
      '/users',
      '/users/:id',
      '/users/archived/list',
      '/users/next/employee-id',
      '/users/:id/salary',
      '/users/:id/permanent',
      '/users/:id/restore',
      '/users/sidebar-access/bulk',
      '/users/:id/sidebar-access',
    ]
  },
  'Tasks & Timesheets': {
    label: 'Tasks & Timesheets',
    icon: 'FiCheckSquare',
    routes: [
      '/api/tasks',
      '/api/tasks/:id',
      '/api/tasks/archived/list',
      '/api/tasks/:id/restore',
      '/api/tasks/:id/comments',
      '/api/tasks/date-range/:startDate/:endDate',
      '/api/tasks/stats/summary',
      '/api/tasks/bulk-update',
      '/api/timesheets',
    ]
  },
  'Leave Management': {
    label: 'Leave Management',
    icon: 'FiCalendar',
    routes: [
      '/api/leaves',
      '/api/leaves/apply',
      '/api/leaves/all',
      '/api/leaves/me',
      '/api/leaves/:id',
      '/api/holidays',
      '/api/holidays/filter',
      '/api/holidays/delete/:id',
      '/api/holidays/update/:id',
    ]
  },
  'Salary & Finance': {
    label: 'Salary & Finance',
    icon: 'FiDollarSign',
    routes: [
      '/api/payslips',
      '/api/daily-salary',
      '/api/daily-salary/earnings/me',
      '/api/daily-salary/earnings/:userId',
      '/api/daily-salary/salary-history/me',
      '/api/daily-salary/credit-history/me',
      '/api/daily-salary/config',
      '/api/daily-salary/stats',
      '/api/daily-salary/update-salary',
      '/api/fee-payments',
      '/api/fee-payments/submit',
      '/api/fee-payments/my-payments',
      '/api/income-expense',
      '/api/income-expense/summary',
    ]
  },
  'Projects & Workspace': {
    label: 'Projects & Workspace',
    icon: 'FiBriefcase',
    routes: [
      '/api/projects',
      '/api/projects/user/me',
      '/api/projects/:projectId',
      '/api/projects/:projectId/members',
      '/api/work-cards',
      '/api/work-cards/stats',
      '/api/work-cards/:id',
      '/api/work-cards/:id/comments',
      '/api/work-cards/:id/progress',
      '/api/daytoday',
      '/api/daytoday/cards',
      '/api/daytoday/cards/:id',
      '/api/daytoday/cards/:cardId/attendance',
    ]
  },
  'Team Management': {
    label: 'Team Management',
    icon: 'FiUsers',
    routes: [
      '/api/teams',
      '/api/teams/me',
      '/api/teams/:teamId',
      '/api/teams/:teamId/members',
    ]
  },
  'Community': {
    label: 'Community',
    icon: 'FiMessageCircle',
    routes: [
      '/api/community/groups',
      '/api/community/groups/:id',
      '/api/community/groups/:id/leave',
      '/api/community/groups/:id/messages',
    ]
  },
  'Achievements & Goals': {
    label: 'Achievements & Goals',
    icon: 'FiTarget',
    routes: [
      '/api/engagement/achievements/me',
      '/api/engagement/achievements/:userId',
      '/api/engagement/achievements/award',
      '/api/engagement/leaderboard',
      '/api/engagement/goals/me',
      '/api/engagement/goals/:userId',
      '/api/engagement/goals',
      '/api/engagement/goals/:id/progress',
      '/api/engagement/events',
      '/api/engagement/dashboard/stats',
    ]
  },
  'Assessments': {
    label: 'Assessments',
    icon: 'FiBookOpen',
    routes: [
      '/api/assessments',
      '/api/assessments/:id',
      '/api/assessments/employee/my-assessments',
      '/api/assessments/:id/start',
      '/api/assessments/:id/answer',
      '/api/assessments/:id/submit',
      '/api/assessments/:id/submissions/:submissionId',
    ]
  },
  'Applications': {
    label: 'Applications',
    icon: 'FiGrid',
    routes: [
      '/api/applications',
      '/api/applications/my-applications',
    ]
  },
  'CRM': {
    label: 'CRM',
    icon: 'FiBriefcase',
    routes: [
      '/api/crm/stages',
      '/api/crm/stages/:id',
      '/api/crm/stages/reorder',
      '/api/crm/leads',
      '/api/crm/leads/:id',
      '/api/crm/leads/:id/move',
    ]
  },
  'Helpdesk': {
    label: 'Helpdesk',
    icon: 'FiHelpCircle',
    routes: [
      '/api/helpdesk/tickets',
      '/api/helpdesk/tickets/:id',
      '/api/helpdesk/tickets/:id/status',
      '/api/helpdesk/tickets/:id/messages',
      '/api/helpdesk/summary',
      '/api/helpdesk/contacts',
    ]
  },
  'Assistant & AI': {
    label: 'Assistant & AI',
    icon: 'FiZap',
    routes: [
      '/api/assistant/chat',
      '/api/assistant/skill-chat',
      '/api/assistant/worklogz-chat',
      '/api/assistant/worklogz-chat/history',
    ]
  },
  'Documents': {
    label: 'Documents',
    icon: 'FiFileText',
    routes: [
      '/api/documents',
      '/api/documents/stats',
      '/api/documents/:id',
      '/api/documents/:id/download',
    ]
  },
  'Company Settings': {
    label: 'Company Settings',
    icon: 'FiSettings',
    routes: [
      '/api/company-settings',
      '/api/company-settings/logo',
      '/api/custom-fields',
      '/api/custom-fields/summary',
      '/api/custom-fields/type/:fieldType',
      '/api/custom-fields/:id',
      '/api/custom-fields/bulk',
      '/api/sidebar-menu/:scope',
    ]
  },
  'Admin & Configuration': {
    label: 'Admin & Configuration',
    icon: 'FiShield',
    routes: [
      '/api/route-permissions/available-routes',
      '/api/route-permissions/user/:userId',
      '/api/route-permissions/bulk',
    ]
  },
};

// Helper to find which page a route belongs to
export const getRoutePage = (routePath) => {
  // Normalize route path (remove query strings, trailing slashes)
  const normalizedPath = routePath.split('?')[0].replace(/\/$/, '');
  
  for (const [pageKey, pageData] of Object.entries(ROUTE_PAGE_MAPPING)) {
    if (pageData.routes.some(r => {
      // Exact match
      if (r === normalizedPath) return true;
      
      // Check if route starts with the pattern (for prefix matching)
      // e.g., /api/tasks matches /api/tasks/:id
      const normalizedPattern = r.replace(/:[^/]+/g, '[^/]+');
      if (normalizedPath.startsWith(r.replace(/:[^/]+/g, '').replace(/\/$/, '')) || 
          new RegExp(`^${normalizedPattern.replace(/\//g, '\\/')}`).test(normalizedPath)) {
        return true;
      }
      
      // Pattern match (e.g., /users/:id matches /users/123)
      const regex = new RegExp(`^${normalizedPattern.replace(/\//g, '\\/')}$`);
      return regex.test(normalizedPath);
    })) {
      return pageKey;
    }
  }
  return 'Other';
};

// Group routes by pages
export const groupRoutesByPages = (routes) => {
  const grouped = {};
  
  routes.forEach(route => {
    const page = getRoutePage(route.path);
    
    // Create page group if it doesn't exist
    if (!grouped[page]) {
      if (ROUTE_PAGE_MAPPING[page]) {
        grouped[page] = {
          ...ROUTE_PAGE_MAPPING[page],
          routes: []
        };
      } else {
        // Create "Other" group for unmatched routes
        grouped[page] = {
          label: 'Other',
          icon: 'FiCode',
          routes: []
        };
      }
    }
    
    // Add route to the group if not already present
    if (!grouped[page].routes.find(r => r.path === route.path)) {
      grouped[page].routes.push(route);
    }
  });
  
  return grouped;
};

