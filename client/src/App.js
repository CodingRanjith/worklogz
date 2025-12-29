import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Public authentication
import Login from './components/Login';
import Register from './components/Register';

// Layouts
import Layout from './components/admin-dashboard/layout/Layout';
import EmployeeLayout from './components/employee-dashboard/layout/EmployeeLayout';

// Admin pages
import Company from './pages/admin/Company';
import AdministrationAccess from './pages/admin/AdministrationAccess';
import MasterControl from './pages/admin/MasterControl';
import AllUsers from './pages/admin/AllUsers';
import Employees from './pages/admin/Employees';
import PendingUsers from './pages/admin/PendingUsers';
import EditUser from './components/EditUser';
import ThemeBranding from './pages/admin/ThemeBranding';
import CustomFields from './pages/admin/CustomFields';
import WorkflowRules from './pages/admin/WorkflowRules';
import Settings from './pages/admin/Settings';
import AttendanceDashboard from './pages/admin/AttendanceDashboard';
import Attendance from './pages/admin/Attendance';
import UserTimesheet from './pages/admin/UserTimesheet';
import TeamManagement from './pages/admin/TeamManagement';
import TaskManager from './pages/admin/TaskManager';
import LeaveRequestsAdmin from './pages/admin/LeaveRequests';
import LateReports from './pages/admin/LateReports';
import Holidays from './pages/admin/Holidays';
import PayslipGenerator from './pages/admin/PayslipGenerator';
import PayslipList from './pages/admin/PayslipList';
import DailySalaryCredit from './pages/admin/DailySalaryCredit';
import UploadDocuments from './pages/admin/UploadDocuments';
import OfferLetters from './pages/admin/OfferLetters';
import ExperienceLetters from './pages/admin/ExperienceLetters';
import RelievingLetters from './pages/admin/RelievingLetters';
import ProjectsWorkspace from './pages/admin/ProjectsWorkspace';
import CompanyWorklogz from './pages/admin/CompanyWorkcards';
import CompanyDepartments from './pages/admin/CompanyDepartments';
import CreateWorkCard from './pages/admin/CreateWorkCard';
import DepartmentWorkCards from './pages/admin/DepartmentWorkCards';
import CourseCRM from './pages/admin/CourseCRM';
import InternshipCRM from './pages/admin/InternshipCRM';
import ITProjectsCRM from './pages/admin/ITProjectsCRM';
import FeePaymentsManagement from './pages/admin/FeePaymentsManagement';
import Plans from './pages/admin/Plans';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import Reports from './pages/admin/Reports';
import Assessments from './pages/admin/Assessments';
import Helpdesk from './pages/admin/Helpdesk';

// Employee pages (shared layout)
import HomePage from './pages/employee/HomePage';
import AttendancePage from './pages/employee/AttendancePage';
import PeoplePage from './pages/employee/PeoplePage';
import ApplicationsPage from './pages/employee/ApplicationsPage';
import EmployeeTeamManagement from './pages/employee/TeamManagement';
import TimeSheet from './pages/employee/Timesheet';
import CalendarView from './pages/employee/CalendarView';
import LeaveManagement from './pages/employee/LeaveManagement';
import MyEarnings from './pages/employee/MyEarnings';
import Invoices from './pages/employee/Invoices';
import DocumentCenter from './pages/employee/DocumentCenter';
import WorkspacePage from './pages/employee/WorkspacePage';
import FeePayment from './pages/employee/FeePayment';
import SkillDevelopment from './pages/employee/SkillDevelopment';
import EmployeeAssessments from './pages/employee/Assessments';
import WorklogzTube from './pages/employee/WorklogzTube';
import GoalsAchievements from './pages/employee/GoalsAchievements';
import PerformanceDashboard from './pages/employee/PerformanceDashboard';
import CommunityPage from './pages/employee/CommunityPage';
import HelpdeskPage from './pages/employee/HelpdeskPage';
import AICopilotPage from './pages/employee/AICopilotPage';
import NotificationPage from './pages/employee/NotificationPage';
import ProfileSettings from './pages/employee/ProfileSettings';

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
        } else if (currentPath === '/login' || currentPath === '/') {
          // Redirect authenticated users away from login
          if (decoded.role === 'master-admin') {
            navigate('/admin');
          } else if (decoded.role === 'admin') {
            navigate('/home');
          } else if (decoded.role === 'employee') {
            navigate('/home');
          }
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Authentication routes only */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin-only layout */}
      <Route element={<Layout />}>
        <Route path="/admin" element={<Company />} />
        <Route path="/administration/access-control" element={<AdministrationAccess />} />
        <Route path="/master-control" element={<MasterControl />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/pending-users" element={<PendingUsers />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/theme-branding" element={<ThemeBranding />} />
        <Route path="/custom-fields" element={<CustomFields />} />
        <Route path="/workflow-rules" element={<WorkflowRules />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin & employee shared layout */}
      <Route element={<EmployeeLayout />}>
        {/* Admin routes */}
        <Route path="/dashboard" element={<AttendanceDashboard />} />
        <Route path="/attendances" element={<Attendance />} />
        <Route path="/user-timesheet/:userId" element={<UserTimesheet />} />
        <Route path="/admin/team-management" element={<TeamManagement />} />
        <Route path="/admin/task-manager" element={<TaskManager />} />
        <Route path="/leave-requests" element={<LeaveRequestsAdmin />} />
        <Route path="/late-reports" element={<LateReports />} />
        <Route path="/holidays" element={<Holidays />} />
        <Route path="/payslip" element={<PayslipGenerator />} />
        <Route path="/salaryhistory" element={<PayslipList />} />
        <Route path="/daily-salary-credit" element={<DailySalaryCredit />} />
        <Route path="/upload-documents" element={<UploadDocuments />} />
        <Route path="/offer-letters" element={<OfferLetters />} />
        <Route path="/experience-letters" element={<ExperienceLetters />} />
        <Route path="/relieving-letters" element={<RelievingLetters />} />
        <Route path="/projects" element={<ProjectsWorkspace />} />
        <Route path="/company-worklogz" element={<CompanyWorklogz />} />
        <Route path="/company-departments" element={<CompanyDepartments />} />
        <Route path="/company-departments/create" element={<CreateWorkCard />} />
        <Route path="/company-departments/:department" element={<DepartmentWorkCards />} />
        <Route path="/crm/course" element={<CourseCRM />} />
        <Route path="/crm/internship" element={<InternshipCRM />} />
        <Route path="/crm/it-projects" element={<ITProjectsCRM />} />
        <Route path="/fee-payments" element={<FeePaymentsManagement />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/admin/helpdesk" element={<Helpdesk />} />

        {/* Employee routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance/:userId" element={<AttendancePage />} />
        <Route path="/employee/people" element={<PeoplePage />} />
        <Route path="/employee/applications" element={<ApplicationsPage />} />
        <Route path="/team-management" element={<EmployeeTeamManagement />} />
        <Route path="/timesheet" element={<TimeSheet />} />
        <Route path="/task-manager" element={<TaskManager />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/apply-leave" element={<LeaveManagement />} />
        <Route path="/my-earnings" element={<MyEarnings />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/documents" element={<DocumentCenter />} />
        <Route path="/employee/workspace" element={<WorkspacePage />} />
        <Route path="/employee/fee-payment" element={<FeePayment />} />
        <Route path="/skill-development" element={<SkillDevelopment />} />
        <Route path="/employee/assessments" element={<EmployeeAssessments />} />
        <Route path="/employee/worklogztube" element={<WorklogzTube />} />
        <Route path="/goals-achievements" element={<GoalsAchievements />} />
        <Route path="/performance" element={<PerformanceDashboard />} />
        <Route path="/employee/community" element={<CommunityPage />} />
        <Route path="/helpdesk" element={<HelpdeskPage />} />
        <Route path="/employee/ai" element={<AICopilotPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
