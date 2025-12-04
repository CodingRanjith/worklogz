import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useEffect } from 'react';



// Savitha Admnin Dashboard
import DashSavi from './pages/Dashboard';

// Public Pages
import Login from './components/Login';
import Register from './components/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Employees from './pages/admin/Employees';
// import Salary from './pages/admin/Salary'; // Unused - commented out
import Attendance from './pages/admin/Attendance';
import Reports from './pages/admin/Reports';
import LeaveRequestsAdmin from './pages/admin/LeaveRequests';


import AttendancePage from './pages/employee/AttendancePage';
import Leave from './pages/employee/ApplyLeaveForm';
import LeaveManagement from './pages/employee/LeaveManagement';
import GoalsAchievements from './pages/employee/GoalsAchievements';
import CalendarView from './pages/employee/CalendarView';
import PerformanceDashboard from './pages/employee/PerformanceDashboard';
import MyEarnings from './pages/employee/MyEarnings';
import EditUser from './components/EditUser';
import PendingUsers from './pages/admin/PendingUsers';
import AllUsers from './pages/admin/AllUsers';
import Holidays from './pages/admin/Holidays';
import TimeSheet from './pages/employee/Timesheet';
import SkillDevelopment from './pages/employee/SkillDevelopment';
import PayslipGenerator from './pages/admin/PayslipGenerator';
import PayslipList from './pages/admin/PayslipList';
import TaskManager from './pages/admin/TaskManager';
import UserTimesheet from './pages/admin/UserTimesheet';
import CompanyWorklogz from './pages/admin/CompanyWorkcards';
import CompanyDepartments from './pages/admin/CompanyDepartments';
import CreateWorkCard from './pages/admin/CreateWorkCard';
import DepartmentWorkCards from './pages/admin/DepartmentWorkCards';
import DailySalaryCredit from './pages/admin/DailySalaryCredit';
import LateReports from './pages/admin/LateReports';
import ExperienceLetters from './pages/admin/ExperienceLetters';
import OfferLetters from './pages/admin/OfferLetters';
import RelievingLetters from './pages/admin/RelievingLetters';
import UploadDocuments from './pages/admin/UploadDocuments';
import Settings from './pages/admin/Settings';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import CourseCRM from './pages/admin/CourseCRM';
import InternshipCRM from './pages/admin/InternshipCRM';
import ITProjectsCRM from './pages/admin/ITProjectsCRM';
import ProjectsWorkspace from './pages/admin/ProjectsWorkspace';
import Helpdesk from './pages/admin/Helpdesk';
import Plans from './pages/admin/Plans';
// Layout
import Layout from './components/admin-dashboard/layout/Layout';

// Documentation Pages
import Introduction from './docs/pages/Introduction';
import ComponentShowcase from './docs/pages/ComponentShowcase';
import QuickStart from './docs/pages/getting-started/QuickStart';
import Installation from './docs/pages/getting-started/Installation';
import Architecture from './docs/pages/getting-started/Architecture';
import Configuration from './docs/pages/getting-started/Configuration';
import Migration from './docs/pages/getting-started/Migration';
import ComponentsOverview from './docs/pages/components/Overview';
import ComponentsShowcase from './docs/pages/components/Showcase';
import LayoutComponents from './docs/pages/components/Layout';
import FormComponents from './docs/pages/components/Forms';
import DataDisplay from './docs/pages/components/DataDisplay';
import NavigationComponents from './docs/pages/components/Navigation';
import FeedbackComponents from './docs/pages/components/Feedback';
import OverlayComponents from './docs/pages/components/Overlay';
import AdminDashboard from './docs/pages/admin/Dashboard';
import AdminAnalytics from './docs/pages/admin/Analytics';
import AdminUserManagement from './docs/pages/admin/UserManagement';
import AdminAttendance from './docs/pages/admin/Attendance';
import AdminTaskManager from './docs/pages/admin/TaskManager';
import AdminProjects from './docs/pages/admin/Projects';
import AdminWorklogz from './docs/pages/admin/Worklogz';
import AdminDepartments from './docs/pages/admin/Departments';
import AdminCRM from './docs/pages/admin/CRM';
import AdminHelpdesk from './docs/pages/admin/Helpdesk';
import AdminPayroll from './docs/pages/admin/Payroll';
import AdminDocuments from './docs/pages/admin/Documents';
import AdminReports from './docs/pages/admin/Reports';
import AdminSettings from './docs/pages/admin/Settings';
import EmployeeAttendance from './docs/pages/employee/Attendance';
import EmployeeTimesheet from './docs/pages/employee/Timesheet';
import EmployeeLeave from './docs/pages/employee/Leave';
import EmployeePerformance from './docs/pages/employee/Performance';
import EmployeeGoals from './docs/pages/employee/Goals';
import EmployeeEarnings from './docs/pages/employee/Earnings';
import EmployeeCalendar from './docs/pages/employee/Calendar';
import EmployeeSkills from './docs/pages/employee/Skills';
import EmployeeCommunity from './docs/pages/employee/Community';
import EmployeeWorkspace from './docs/pages/employee/Workspace';
import AuthenticationGuide from './docs/pages/guides/Authentication';
import APIGuide from './docs/pages/guides/API';
import ThemingGuide from './docs/pages/guides/Theming';
import StateGuide from './docs/pages/guides/State';
import RoutingGuide from './docs/pages/guides/Routing';
import BestPractices from './docs/pages/guides/BestPractices';
import Troubleshooting from './docs/pages/guides/Troubleshooting';
import APIEndpoints from './docs/pages/api/Endpoints';
import APIAuth from './docs/pages/api/Auth';
import APIUsers from './docs/pages/api/Users';
import APIAttendance from './docs/pages/api/Attendance';
import APIProjects from './docs/pages/api/Projects';
import APICRM from './docs/pages/api/CRM';

function App() {
   const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('token');
        } else {
          // Only redirect if user is on login page or root page
          if (currentPath === '/' || currentPath === '/login') {
            if (decoded.role === 'admin') navigate('/dashboard');
            else if (decoded.role === 'employee') navigate('/attendance');
          }
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);
  return (
   
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance/:userId" element={<AttendancePage />} />
        <Route path="/apply-leave" element={<LeaveManagement />} />
        <Route path="/timesheet" element={<TimeSheet />} />
        <Route path="/skill-development" element={<SkillDevelopment />} />
        <Route path="/goals-achievements" element={<GoalsAchievements />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/performance" element={<PerformanceDashboard />} />
        <Route path="/my-earnings" element={<MyEarnings />} />
        
        {/* Documentation Routes */}
        <Route path="/docs" element={<Introduction />} />
        <Route path="/docs/getting-started/quick-start" element={<QuickStart />} />
        <Route path="/docs/getting-started/installation" element={<Installation />} />
        <Route path="/docs/getting-started/architecture" element={<Architecture />} />
        <Route path="/docs/getting-started/configuration" element={<Configuration />} />
        <Route path="/docs/getting-started/migration" element={<Migration />} />
        <Route path="/docs/components/overview" element={<ComponentsOverview />} />
        <Route path="/docs/components/showcase" element={<ComponentsShowcase />} />
        <Route path="/docs/components/layout" element={<LayoutComponents />} />
        <Route path="/docs/components/forms" element={<FormComponents />} />
        <Route path="/docs/components/data-display" element={<DataDisplay />} />
        <Route path="/docs/components/navigation" element={<NavigationComponents />} />
        <Route path="/docs/components/feedback" element={<FeedbackComponents />} />
        <Route path="/docs/components/overlay" element={<OverlayComponents />} />
        <Route path="/docs/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/docs/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/docs/admin/user-management" element={<AdminUserManagement />} />
        <Route path="/docs/admin/attendance" element={<AdminAttendance />} />
        <Route path="/docs/admin/task-manager" element={<AdminTaskManager />} />
        <Route path="/docs/admin/projects" element={<AdminProjects />} />
        <Route path="/docs/admin/worklogz" element={<AdminWorklogz />} />
        <Route path="/docs/admin/departments" element={<AdminDepartments />} />
        <Route path="/docs/admin/crm" element={<AdminCRM />} />
        <Route path="/docs/admin/helpdesk" element={<AdminHelpdesk />} />
        <Route path="/docs/admin/payroll" element={<AdminPayroll />} />
        <Route path="/docs/admin/documents" element={<AdminDocuments />} />
        <Route path="/docs/admin/reports" element={<AdminReports />} />
        <Route path="/docs/admin/settings" element={<AdminSettings />} />
        <Route path="/docs/employee/attendance" element={<EmployeeAttendance />} />
        <Route path="/docs/employee/timesheet" element={<EmployeeTimesheet />} />
        <Route path="/docs/employee/leave" element={<EmployeeLeave />} />
        <Route path="/docs/employee/performance" element={<EmployeePerformance />} />
        <Route path="/docs/employee/goals" element={<EmployeeGoals />} />
        <Route path="/docs/employee/earnings" element={<EmployeeEarnings />} />
        <Route path="/docs/employee/calendar" element={<EmployeeCalendar />} />
        <Route path="/docs/employee/skills" element={<EmployeeSkills />} />
        <Route path="/docs/employee/community" element={<EmployeeCommunity />} />
        <Route path="/docs/employee/workspace" element={<EmployeeWorkspace />} />
        <Route path="/docs/guides/authentication" element={<AuthenticationGuide />} />
        <Route path="/docs/guides/api" element={<APIGuide />} />
        <Route path="/docs/guides/theming" element={<ThemingGuide />} />
        <Route path="/docs/guides/state" element={<StateGuide />} />
        <Route path="/docs/guides/routing" element={<RoutingGuide />} />
        <Route path="/docs/guides/best-practices" element={<BestPractices />} />
        <Route path="/docs/guides/troubleshooting" element={<Troubleshooting />} />
        <Route path="/docs/api/endpoints" element={<APIEndpoints />} />
        <Route path="/docs/api/auth" element={<APIAuth />} />
        <Route path="/docs/api/users" element={<APIUsers />} />
        <Route path="/docs/api/attendance" element={<APIAttendance />} />
        <Route path="/docs/api/projects" element={<APIProjects />} />
        <Route path="/docs/api/crm" element={<APICRM />} />

        {/* Protected Admin Layout Wrapper */}
        <Route element={<Layout />}>
          <Route path="/admin" element={<DashSavi />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/salaryhistory" element={<PayslipList />} />
          <Route path="/attendances" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/pending-users" element={<PendingUsers />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/payslip" element={<PayslipGenerator />} />
          <Route path="/leave-requests" element={<LeaveRequestsAdmin />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="/user-timesheet/:userId" element={<UserTimesheet />} />
          <Route path="/company-worklogz" element={<CompanyWorklogz />} />
          <Route path="/company-departments" element={<CompanyDepartments />} />
          <Route path="/company-departments/create" element={<CreateWorkCard />} />
          <Route path="/company-departments/:department" element={<DepartmentWorkCards />} />
          <Route path="/projects" element={<ProjectsWorkspace />} />
          <Route path="/crm/course" element={<CourseCRM />} />
          <Route path="/crm/internship" element={<InternshipCRM />} />
          <Route path="/crm/it-projects" element={<ITProjectsCRM />} />
          <Route path="/daily-salary-credit" element={<DailySalaryCredit />} />
          <Route path="/late-reports" element={<LateReports />} />
          <Route path="/experience-letters" element={<ExperienceLetters />} />
          <Route path="/offer-letters" element={<OfferLetters />} />
          <Route path="/relieving-letters" element={<RelievingLetters />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
          <Route path="/plans" element={<Plans />} />
          {/* Add other admin routes here */}
          <Route path="/edit-user" element={<EditUser />} />
        </Route>

      </Routes>
   
  );
}

export default App;
