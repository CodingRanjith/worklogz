

// src/utils/api.js
export const BASE_URL = 'https://worklogz.onrender.com';

// src/utils/api.js

// // // // Base URL
// export const BASE_URL = 'http://localhost:5000'; // Change to your live domain when needed'https://worklogz.onrender.com'

// -----------------
// Auth & User APIss
// -----------------
export const API_ENDPOINTS = {
  
  authLogin: `${BASE_URL}/api/auth/login`,
   // -----------------
  // Auth
  // -----------------
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  // -----------------
  // Users
  // -----------------
  
  getUsers: `${BASE_URL}/users`,
  getCurrentUser: `${BASE_URL}/users/me`,
  updateMyProfile: `${BASE_URL}/users/me`,
  getUserById: (userId) => `${BASE_URL}/users/${userId}`,
  updateUser: (userId) => `${BASE_URL}/users/${userId}`,
  deleteUser: (userId) => `${BASE_URL}/users/${userId}`,
  updateSalary: (userId) => `${BASE_URL}/users/${userId}/salary`,
  getSchedules: `${BASE_URL}/schedules`,
  putUserSchedule: (userId) => `${BASE_URL}/schedules/${userId}`,
  getAllUsers: `${BASE_URL}/employeesAttendance`,
  // getUserById: (id) => `${BASE_URL}/users/${id}`,
  // getAttendanceByUser: (id) => `${BASE_URL}/attendance/user/${id}`,


  // -----------------
  // Attendance APIs
  // -----------------
  postAttendance: `${BASE_URL}/attendance`,
  getMyAttendance: `${BASE_URL}/attendance/me`,
  getLastAttendanceGlobal: `${BASE_URL}/attendance/last`,
  getAttendanceAll: `${BASE_URL}/attendance/all`,
  getAttendanceByDate: (date) => `${BASE_URL}/attendance/date/${date}`,
  getAttendanceByUser: (userId) => `${BASE_URL}/attendance/user/${userId}`,
  getUserSummary: (userId, year, month) => `${BASE_URL}/attendance/user/${userId}/summary/${year}/${month}`,
  getLastAttendanceByUser: (userId) => `${BASE_URL}/attendance/user/${userId}/last`,

  // -----------------
  // Admin Dashboard
  // -----------------
  getAdminSummary: `${BASE_URL}/api/admin/summary`,
  getRecentAttendanceLogs: `${BASE_URL}/api/admin/recent-attendance`,

  // -----------------
  // Pending Users
  // -----------------
  pendingUsers: `${BASE_URL}/api/admin/pending-users`,
  approveUser: `${BASE_URL}/api/admin/approve`,     // Use: `${approveUser}/${userId}`
  rejectUser: `${BASE_URL}/api/admin/reject`,       // Use: `${rejectUser}/${userId}`

  // -----------------
  // Leave Management
  // -----------------
  applyLeave: `${BASE_URL}/api/leaves/apply`,
  getMyLeaves: `${BASE_URL}/api/leaves/me`,
  getAllLeaves: `${BASE_URL}/api/leaves/all`,
  updateLeaveStatus: (id) => `${BASE_URL}/api/leaves/${id}`,

  // -----------------
  // Holidays
  // -----------------
  addHoliday: `${BASE_URL}/api/holidays`,
  getHolidays: `${BASE_URL}/api/holidays`,
  getHolidaysByMonth: `${BASE_URL}/api/holidays/filter`,
  deleteHoliday: (id) => `${BASE_URL}/api/holidays/delete/${id}`,
  editHoliday: (id) => `${BASE_URL}/api/holidays/update/${id}`,

  // // -----------------
  // // Tasks
  // // -----------------
  // getTasksByDate: (date) => `${BASE_URL}/api/tasks/${date}`,
  // addTask: `${BASE_URL}/api/tasks`,
  // updateTaskStatus: (id) => `${BASE_URL}/api/tasks/${id}`,
  // deleteTask: (id) => `${BASE_URL}/api/tasks/${id}`,
  // updateFullTask: (id) => `${BASE_URL}/api/tasks/${id}`,             // PUT full task (task name or date)
  // getTasksByMonth: (year, month) => `${BASE_URL}/api/tasks/month/${year}/${month}`,
  // getTaskSummary: `${BASE_URL}/api/tasks/summary`,
  //                    // Summary: total, done, pending

  // -----------------
  // Work Cards
  // -----------------
  getWorkCards: `${BASE_URL}/api/work-cards`,
  createWorkCard: `${BASE_URL}/api/work-cards`,
  getWorkCardById: (id) => `${BASE_URL}/api/work-cards/${id}`,
  updateWorkCard: (id) => `${BASE_URL}/api/work-cards/${id}`,
  deleteWorkCard: (id) => `${BASE_URL}/api/work-cards/${id}`,
  getWorkCardStats: `${BASE_URL}/api/work-cards/stats`,
  addWorkCardComment: (id) => `${BASE_URL}/api/work-cards/${id}/comments`,
  updateWorkCardProgress: (id) => `${BASE_URL}/api/work-cards/${id}/progress`,

  // -----------------
  // CRM APIs
  // -----------------
  getCRMStages: (pipelineType = 'course') => `${BASE_URL}/api/crm/stages?pipelineType=${pipelineType}`,
  createCRMStage: `${BASE_URL}/api/crm/stages`,
  updateCRMStage: (id) => `${BASE_URL}/api/crm/stages/${id}`,
  deleteCRMStage: (id) => `${BASE_URL}/api/crm/stages/${id}`,
  reorderCRMStages: `${BASE_URL}/api/crm/stages/reorder`,
  getCRMLeads: `${BASE_URL}/api/crm/leads`,
  getCRMLeadById: (id) => `${BASE_URL}/api/crm/leads/${id}`,
  createCRMLead: `${BASE_URL}/api/crm/leads`,
  updateCRMLead: (id) => `${BASE_URL}/api/crm/leads/${id}`,
  moveCRMLead: (id) => `${BASE_URL}/api/crm/leads/${id}/move`,
  deleteCRMLead: (id) => `${BASE_URL}/api/crm/leads/${id}`,
 
  // -----------------
  // Misc
  // -----------------
  uploadPath: `${BASE_URL}/uploads`,



  // -----------------
  // Payslip APIs
  // -----------------
  createPayslip: `${BASE_URL}/api/payslips`,              // POST new payslip
  getPayslips: `${BASE_URL}/api/payslips`,               // GET all payslips
  // getPayslipById: (id) => `${BASE_URL}/api/payslips/${id}`, // GET payslip by ID
  // getPayslipsByUser: (userId) => `${BASE_URL}/api/payslips/user/${userId}`, // GET all payslips for one user

  // -----------------
  // Employee Engagement APIs
  // -----------------
  getUserAchievements: `${BASE_URL}/api/engagement/achievements/me`,
  getUserAchievementsById: (userId) => `${BASE_URL}/api/engagement/achievements/${userId}`,
  awardAchievement: `${BASE_URL}/api/engagement/achievements/award`,
  getLeaderboard: `${BASE_URL}/api/engagement/leaderboard`,
  getUserGoals: `${BASE_URL}/api/engagement/goals/me`,
  createGoal: `${BASE_URL}/api/engagement/goals`,
  updateGoalProgress: (id) => `${BASE_URL}/api/engagement/goals/${id}/progress`,
  deleteGoal: (id) => `${BASE_URL}/api/engagement/goals/${id}`,
  getUserEvents: `${BASE_URL}/api/engagement/events`,
  createEvent: `${BASE_URL}/api/engagement/events`,
  updateEvent: (id) => `${BASE_URL}/api/engagement/events/${id}`,
  deleteEvent: (id) => `${BASE_URL}/api/engagement/events/${id}`,
  getEngagementDashboard: `${BASE_URL}/api/engagement/dashboard/stats`,

  // -----------------
  // Daily Salary Credit APIs
  // -----------------
  createDailySalaryConfig: `${BASE_URL}/api/daily-salary/config`,
  getDailySalaryConfigs: `${BASE_URL}/api/daily-salary/config`,
  getDailySalaryConfigById: (id) => `${BASE_URL}/api/daily-salary/config/${id}`,
  updateDailySalaryConfig: (id) => `${BASE_URL}/api/daily-salary/config/${id}`,
  deleteDailySalaryConfig: (id) => `${BASE_URL}/api/daily-salary/config/${id}`,
  toggleDailySalaryStatus: (id) => `${BASE_URL}/api/daily-salary/config/${id}/toggle`,
  applyDailyCredits: `${BASE_URL}/api/daily-salary/apply-credits`,
  getDailySalaryStats: `${BASE_URL}/api/daily-salary/stats`,
  getUserDailyEarnings: `${BASE_URL}/api/daily-salary/earnings`,
  getUserDailyEarningsById: (userId) => `${BASE_URL}/api/daily-salary/earnings/${userId}`,
  getMyEarnings: `${BASE_URL}/api/daily-salary/earnings/me`,
  resetUserEarnings: (userId) => `${BASE_URL}/api/daily-salary/reset-earnings/${userId}`,
  manualCredit: `${BASE_URL}/api/daily-salary/manual-credit`,
  updateUserSalary: `${BASE_URL}/api/daily-salary/update-salary`,
  getUserSalaryHistory: (userId) => `${BASE_URL}/api/daily-salary/salary-history/${userId}`,
  getMySalaryHistory: `${BASE_URL}/api/daily-salary/salary-history/me`,
  getUserCreditHistory: (userId) => `${BASE_URL}/api/daily-salary/credit-history/${userId}`,
  getMyCreditHistory: `${BASE_URL}/api/daily-salary/credit-history/me`,
  editCreditTransaction: (transactionId) => `${BASE_URL}/api/daily-salary/credit-transaction/${transactionId}`,
  deleteCreditTransaction: (transactionId) => `${BASE_URL}/api/daily-salary/credit-transaction/${transactionId}`,
  baseURL: BASE_URL,

};

// -----------------
// Helper Functions
// -----------------

// Create Payslip


// Get All Payslips
export const getPayslips = async () => {
  const response = await fetch(API_ENDPOINTS.getPayslips);
  if (!response.ok) throw new Error('Failed to fetch payslips');
  return response.json();
};
// // -----------------
// // Helper Functions (Optional)
// // -----------------

// export const getAttendanceAll = async () => {
//   const response = await fetch(API_ENDPOINTS.getAttendanceAll);
//   if (!response.ok) throw new Error('Failed to fetch attendance data');
//   return response.json();
// };

// export const getUsers = async () => {
//   const response = await fetch(API_ENDPOINTS.getUsers);
//   if (!response.ok) throw new Error('Failed to fetch users data');
//   return response.json();
// };

// export const getAttendanceByDate = async (date) => {
//   const response = await fetch(API_ENDPOINTS.getAttendanceByDate(date));
//   if (!response.ok) throw new Error('Failed to fetch attendance data');
//   return response.json();
// };

// export const getLastAttendance = async () => {
//   const response = await fetch(API_ENDPOINTS.getLastAttendanceGlobal);
//   if (!response.ok) throw new Error('Failed to fetch last attendance data');
//   return response.json();
// };

// export const login = async (email, password) => {
//   const response = await fetch(API_ENDPOINTS.login, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });
//   if (!response.ok) throw new Error('Failed to login');
//   return response.json();
// };

// export const register = async (userData) => {
//   const response = await fetch(API_ENDPOINTS.register, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(userData),
//   });
//   if (!response.ok) throw new Error('Failed to register');
//   return response.json();
// };

export const logout = () => {
  localStorage.removeItem('token');
};
// -----------------Schedule APIs-----------------
export const getSchedules = async () => {
  const response = await fetch(`${BASE_URL}/users/schedules`);
  if (!response.ok) throw new Error('Failed to fetch schedules');
  return response.json();
};

// -----------------
// Task Helper Functions (Dynamic CRUD)
// -----------------
export const getAllTasks = async (token) => {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const createTask = async (taskData, token) => {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const updateTask = async (id, taskData, token) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

export const deleteTask = async (id, token) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return response.json();
};

// Get single task by ID
export const getTaskById = async (id, token) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) throw new Error('Failed to fetch task');
  return response.json();
};

// Add comment to task
export const addTaskComment = async (id, commentText, token) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ text: commentText }),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};

// Get tasks by date range
export const getTasksByDateRange = async (startDate, endDate, token) => {
  const response = await fetch(`${BASE_URL}/api/tasks/date-range/${startDate}/${endDate}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) throw new Error('Failed to fetch tasks by date range');
  return response.json();
};

// Get task statistics
export const getTaskStats = async (startDate, endDate, token) => {
  let url = `${BASE_URL}/api/tasks/stats/summary`;
  const params = new URLSearchParams();
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) throw new Error('Failed to fetch task statistics');
  return response.json();
};

// Get all tasks with filters
export const getAllTasksWithFilters = async (filters = {}, token) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });

  let url = `${BASE_URL}/api/tasks`;
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

// Bulk update tasks
export const bulkUpdateTasks = async (taskIds, updateData, token) => {
  const response = await fetch(`${BASE_URL}/api/tasks/bulk-update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ taskIds, updateData }),
  });
  if (!response.ok) throw new Error('Failed to bulk update tasks');
  return response.json();
};

// -----------------
// CRM Helper Functions
// -----------------

const buildAuthHeaders = (token, includeJson = true) => {
  const headers = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const buildCRMQueryParams = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const fetchCRMStages = async (pipelineType = 'course', token) => {
  const response = await fetch(API_ENDPOINTS.getCRMStages(pipelineType), {
    method: 'GET',
    headers: buildAuthHeaders(token, false),
  });
  if (!response.ok) throw new Error('Failed to fetch CRM stages');
  return response.json();
};

export const createCRMStage = async (data, token) => {
  const response = await fetch(API_ENDPOINTS.createCRMStage, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create CRM stage');
  return response.json();
};

export const updateCRMStage = async (stageId, data, token) => {
  const response = await fetch(API_ENDPOINTS.updateCRMStage(stageId), {
    method: 'PUT',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update CRM stage');
  return response.json();
};

export const deleteCRMStage = async (stageId, token) => {
  const response = await fetch(API_ENDPOINTS.deleteCRMStage(stageId), {
    method: 'DELETE',
    headers: buildAuthHeaders(token, false),
  });
  if (!response.ok) throw new Error('Failed to delete CRM stage');
  return response.json();
};

export const reorderCRMStages = async (payload, token) => {
  const response = await fetch(API_ENDPOINTS.reorderCRMStages, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to reorder CRM stages');
  return response.json();
};

export const fetchCRMLeads = async (filters = {}, token) => {
  const query = buildCRMQueryParams(filters);
  const response = await fetch(`${API_ENDPOINTS.getCRMLeads}${query}`, {
    method: 'GET',
    headers: buildAuthHeaders(token, false),
  });
  if (!response.ok) throw new Error('Failed to fetch CRM leads');
  return response.json();
};

export const getCRMLeadById = async (leadId, token) => {
  const response = await fetch(API_ENDPOINTS.getCRMLeadById(leadId), {
    method: 'GET',
    headers: buildAuthHeaders(token, false),
  });
  if (!response.ok) throw new Error('Failed to fetch CRM lead details');
  return response.json();
};

export const createCRMLead = async (data, token) => {
  const response = await fetch(API_ENDPOINTS.createCRMLead, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create CRM lead');
  return response.json();
};

export const updateCRMLead = async (leadId, data, token) => {
  const response = await fetch(API_ENDPOINTS.updateCRMLead(leadId), {
    method: 'PUT',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update CRM lead');
  return response.json();
};

export const moveCRMLead = async (leadId, data, token) => {
  const response = await fetch(API_ENDPOINTS.moveCRMLead(leadId), {
    method: 'PATCH',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to move CRM lead');
  return response.json();
};

export const deleteCRMLead = async (leadId, token) => {
  const response = await fetch(API_ENDPOINTS.deleteCRMLead(leadId), {
    method: 'DELETE',
    headers: buildAuthHeaders(token, false),
  });
  if (!response.ok) throw new Error('Failed to delete CRM lead');
  return response.json();
};