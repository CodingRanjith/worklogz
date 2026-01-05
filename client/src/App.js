import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';

// ============================================================================
// PUBLIC PAGES & AUTHENTICATION
// ============================================================================
import Login from './components/Login';
import Register from './components/Register';

// Landing Pages
import LandingPage from './pages/landing/LandingPage';
import PublicLandingPage from './pages/landing/PublicLandingPage';

// Static Pages
import Pricing from './pages/static/Pricing';
import ForBusiness from './pages/static/ForBusiness';
import ForEnterprise from './pages/static/ForEnterprise';
import ForEducation from './pages/static/ForEducation';
import ForIndividuals from './pages/static/ForIndividuals';
import ProductOverview from './pages/static/ProductOverview';
import ProductPdfConfigurator from './pages/static/ProductPdfConfigurator';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================
import Layout from './components/admin-dashboard/layout/Layout';
import EmployeeLayout from './components/employee-dashboard/layout/EmployeeLayout';

// ============================================================================
// HOME & CORE MODULE
// ============================================================================
// Employee
import HomePage from './pages/employee/HomePage';
import AttendancePage from './pages/employee/AttendancePage';
import AttendanceDashboard from './pages/admin/AttendanceDashboard';
import Dashboard from './pages/admin/Dashboard';

// ============================================================================
// HR & ADMINISTRATION MODULE
// ============================================================================
// User & Employee Management
import Employees from './pages/admin/Employees';
import AllUsers from './pages/admin/AllUsers';
import PendingUsers from './pages/admin/PendingUsers';
import Trainers from './pages/admin/Trainers';
import EditUser from './components/EditUser';
import PeoplePage from './pages/employee/PeoplePage';
import ApplicationsPage from './pages/employee/ApplicationsPage';
import Company from './pages/admin/Company';

// Team Management
import TeamManagement from './pages/admin/TeamManagement';
import EmployeeTeamManagement from './pages/employee/TeamManagement';

// Roles & Permissions
import AdministrationAccess from './pages/admin/AdministrationAccess';
import MasterControl from './pages/admin/MasterControl';

// ============================================================================
// TIME & TASK TRACKING MODULE
// ============================================================================
// Task Manager
import TaskManager from './pages/admin/TaskManager';

// Timesheets
import TimeSheet from './pages/employee/Timesheet';
import UserTimesheet from './pages/admin/UserTimesheet';

// Calendar View
import CalendarView from './pages/employee/CalendarView';

// Attendance
import Attendance from './pages/admin/Attendance';

// ============================================================================
// LEAVE MANAGEMENT MODULE
// ============================================================================
// Apply Leave & Leave Records
import LeaveManagement from './pages/employee/LeaveManagement';
import LeaveRequestsAdmin from './pages/admin/LeaveRequests';

// Late Reports
import LateReports from './pages/admin/LateReports';

// Holiday List
import Holidays from './pages/admin/Holidays';

// ============================================================================
// FINANCE & COMPENSATION MODULE
// ============================================================================
// Salary & Pay History
import MyEarnings from './pages/employee/MyEarnings';
import PayslipGenerator from './pages/admin/PayslipGenerator';
import PayslipList from './pages/admin/PayslipList';
import DailySalaryCredit from './pages/admin/DailySalaryCredit';

// Invoices
import Invoices from './pages/employee/Invoices';

// Income & Expense
import IncomeExpense from './pages/admin/IncomeExpense';
import DayToday from './pages/admin/DayToday';

// ============================================================================
// DOCUMENTS & ADMINISTRATION MODULE
// ============================================================================
// Document Center
import DocumentCenter from './pages/employee/DocumentCenter';
import UploadDocuments from './pages/admin/UploadDocuments';

// Document Generation
import OfferLetters from './pages/admin/OfferLetters';
import ExperienceLetters from './pages/admin/ExperienceLetters';
import RelievingLetters from './pages/admin/RelievingLetters';

// ============================================================================
// PROJECT MANAGEMENT MODULE
// ============================================================================
// Project Workspace
import ProjectsWorkspace from './pages/admin/ProjectsWorkspace';
import WorkspacePage from './pages/employee/WorkspacePage';

// Company Worklogz & Departments
import CompanyWorklogz from './pages/admin/CompanyWorkcards';
import CompanyDepartments from './pages/admin/CompanyDepartments';
import CreateWorkCard from './pages/admin/CreateWorkCard';
import DepartmentWorkCards from './pages/admin/DepartmentWorkCards';

// ============================================================================
// SALES & CRM MODULE
// ============================================================================
// CRM Pipelines
import CourseCRM from './pages/admin/CourseCRM';
import InternshipCRM from './pages/admin/InternshipCRM';
import ITProjectsCRM from './pages/admin/ITProjectsCRM';

// ============================================================================
// PAYMENT & BILLING MODULE (SALES)
// ============================================================================
// Fee Payments
import FeePayment from './pages/employee/FeePayment';
import FeePaymentsManagement from './pages/admin/FeePaymentsManagement';

// Plans
import Plans from './pages/admin/Plans';

// ============================================================================
// MARKETING & ANALYTICS MODULE
// ============================================================================
// Analytics Dashboard
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';

// Monthly Reports
import Reports from './pages/admin/Reports';

// ============================================================================
// EDUTECH & LEARNING MODULE
// ============================================================================
// Skill Development
import SkillDevelopment from './pages/employee/SkillDevelopment';

// Assessments
import Assessments from './pages/admin/Assessments';
import EmployeeAssessments from './pages/employee/Assessments';

// WorklogzTube
import WorklogzTube from './pages/employee/WorklogzTube';

// ============================================================================
// GOALS & PERFORMANCE MODULE
// ============================================================================
// Goals & Achievements
import GoalsAchievements from './pages/employee/GoalsAchievements';

// Performance Dashboard
import PerformanceDashboard from './pages/employee/PerformanceDashboard';

// ============================================================================
// COLLABORATION, COMMUNICATION & SUPPORT MODULE
// ============================================================================
// Community
import CommunityPage from './pages/employee/CommunityPage';

// Helpdesk
import HelpdeskPage from './pages/employee/HelpdeskPage';
import Helpdesk from './pages/admin/Helpdesk';

// ============================================================================
// AI & AUTOMATION MODULE
// ============================================================================
// AI Copilot
import AICopilotPage from './pages/employee/AICopilotPage';

// ============================================================================
// CORE NAVIGATION & PLATFORM CONTROLS MODULE
// ============================================================================
// Notifications
import NotificationPage from './pages/employee/NotificationPage';

// Profile Settings
import ProfileSettings from './pages/employee/ProfileSettings';

// System Settings
import Settings from './pages/admin/Settings';
import ThemeBranding from './pages/admin/ThemeBranding';
import CustomFields from './pages/admin/CustomFields';
import WorkflowRules from './pages/admin/WorkflowRules';

// ============================================================================
// DOCUMENTATION PAGES
// ============================================================================
import Introduction from './docs/pages/Introduction';
import CorePurpose from './docs/pages/CorePurpose';
import FeaturesOverview from './docs/pages/FeaturesOverview';
import DetailedFeatures from './docs/pages/DetailedFeatures';
import Challenges from './docs/pages/Challenges';
import Industries from './docs/pages/Industries';
import TechnologyStack from './docs/pages/TechnologyStack';
import DeploymentOptions from './docs/pages/DeploymentOptions';
import Scalability from './docs/pages/Scalability';
import RoleBasedAccess from './docs/pages/RoleBasedAccess';
import Customization from './docs/pages/Customization';
import WhiteLabeling from './docs/pages/WhiteLabeling';
import DocsPricing from './docs/pages/Pricing';
import Security from './docs/pages/Security';
import Integrations from './docs/pages/Integrations';
import Performance from './docs/pages/Performance';
import Onboarding from './docs/pages/Onboarding';
import Comparison from './docs/pages/Comparison';
import Support from './docs/pages/Support';
import Roadmap from './docs/pages/Roadmap';
import FAQ from './docs/pages/FAQ';
import Legal from './docs/pages/Legal';
import Contact from './docs/pages/Contact';
import SolutionConfigurator from './docs/pages/SolutionConfigurator';

// ============================================================================
// FEATURE DETAIL PAGES - USER MODULES
// ============================================================================
import UserProfileManagement from './pages/features/UserProfileManagement';
import AttendanceManagement from './pages/features/AttendanceManagement';
import CommunityManagement from './pages/features/CommunityManagement';
import TaskManagerFeature from './pages/features/TaskManager';
import SalaryManagement from './pages/features/SalaryManagement';
import LeaveManagementFeature from './pages/features/LeaveManagement';
import PerformanceManagement from './pages/features/PerformanceManagement';
import WorkspaceManagement from './pages/features/WorkspaceManagement';
import ApplicationIntegrationManagement from './pages/features/ApplicationIntegrationManagement';
import PeopleManagement from './pages/features/PeopleManagement';
import TeamManagementFeature from './pages/features/TeamManagement';
import DocumentCenterManagement from './pages/features/DocumentCenterManagement';
import HelpdeskFeature from './pages/features/Helpdesk';
import TeamTaskManagement from './pages/features/TeamTaskManagement';
import NotificationManagement from './pages/features/NotificationManagement';
import MailIntegration from './pages/features/MailIntegration';
import AICopilot from './pages/features/AICopilot';

// ============================================================================
// FEATURE DETAIL PAGES - ADMIN MODULES
// ============================================================================
import AdminDashboard from './pages/features/AdminDashboard';
import AnalyticsManagement from './pages/features/AnalyticsManagement';
import MonthlyReportsManagement from './pages/features/MonthlyReportsManagement';
import UserManagement from './pages/features/UserManagement';
import UserCards from './pages/features/UserCards';
import EmployeeSchedules from './pages/features/EmployeeSchedules';
import UserPendingApprovals from './pages/features/UserPendingApprovals';
import AdminTeamManagement from './pages/features/AdminTeamManagement';
import AdminTaskManagement from './pages/features/AdminTaskManagement';
import HelpdeskSolver from './pages/features/HelpdeskSolver';
import CompanyOverallWorklogzManagement from './pages/features/CompanyOverallWorklogzManagement';
import CompanyDepartmentManagement from './pages/features/CompanyDepartmentManagement';
import ProjectWorkspaceManagement from './pages/features/ProjectWorkspaceManagement';
import CustomizedInputCrmManagement from './pages/features/CustomizedInputCrmManagement';
import HrManagement from './pages/features/HrManagement';
import AdminLeaveManagement from './pages/features/AdminLeaveManagement';
import PayrollManagement from './pages/features/PayrollManagement';
import PlanManagement from './pages/features/PlanManagement';
import AdminAccessControlManagement from './pages/features/AdminAccessControlManagement';
import DocumentManagement from './pages/features/DocumentManagement';
import CompanySettingsManagement from './pages/features/CompanySettingsManagement';
import ExpenseManagement from './pages/features/ExpenseManagement';
import AdminPerformanceManagement from './pages/features/AdminPerformanceManagement';

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
          // Only redirect if user is on login page
          if (currentPath === '/login') {
            if (decoded.role === 'master-admin') {
              navigate('/admin');
            } else if (decoded.role === 'admin') {
              navigate('/home');
            } else if (decoded.role === 'employee') {
              navigate('/home');
            }
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
      {/* ==================================================================== */}
      {/* LANDING PAGES */}
      {/* ==================================================================== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/public" element={<PublicLandingPage />} />

      {/* ==================================================================== */}
      {/* PUBLIC ROUTES */}
      {/* ==================================================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/for-business" element={<ForBusiness />} />
      <Route path="/for-enterprise" element={<ForEnterprise />} />
      <Route path="/for-education" element={<ForEducation />} />
      <Route path="/for-individuals" element={<ForIndividuals />} />
      <Route path="/product-overview" element={<ProductOverview />} />
      <Route path="/product-configurator" element={<ProductPdfConfigurator />} />

      {/* ==================================================================== */}
      {/* DOCUMENTATION ROUTES */}
      {/* ==================================================================== */}
      <Route path="/docs" element={<Introduction />} />
      <Route path="/docs/core-purpose" element={<CorePurpose />} />
      <Route path="/docs/features-overview" element={<FeaturesOverview />} />
      <Route path="/docs/detailed-features" element={<DetailedFeatures />} />
      <Route path="/docs/challenges" element={<Challenges />} />
      <Route path="/docs/industries" element={<Industries />} />
      <Route path="/docs/technology-stack" element={<TechnologyStack />} />
      <Route path="/docs/deployment-options" element={<DeploymentOptions />} />
      <Route path="/docs/scalability" element={<Scalability />} />
      <Route path="/docs/role-based-access" element={<RoleBasedAccess />} />
      <Route path="/docs/customization" element={<Customization />} />
      <Route path="/docs/white-labeling" element={<WhiteLabeling />} />
      <Route path="/docs/pricing" element={<DocsPricing />} />
      <Route path="/docs/security" element={<Security />} />
      <Route path="/docs/integrations" element={<Integrations />} />
      <Route path="/docs/performance" element={<Performance />} />
      <Route path="/docs/onboarding" element={<Onboarding />} />
      <Route path="/docs/comparison" element={<Comparison />} />
      <Route path="/docs/support" element={<Support />} />
      <Route path="/docs/roadmap" element={<Roadmap />} />
      <Route path="/docs/faq" element={<FAQ />} />
      <Route path="/docs/legal" element={<Legal />} />
      <Route path="/docs/contact" element={<Contact />} />
      <Route path="/docs/solution-configurator" element={<SolutionConfigurator />} />

      {/* ==================================================================== */}
      {/* FEATURE DETAIL PAGES - USER MODULES */}
      {/* ==================================================================== */}
      <Route path="/features/user-profile-management" element={<UserProfileManagement />} />
      <Route path="/features/attendance-management" element={<AttendanceManagement />} />
      <Route path="/features/community-management" element={<CommunityManagement />} />
      <Route path="/features/task-manager" element={<TaskManagerFeature />} />
      <Route path="/features/salary-management" element={<SalaryManagement />} />
      <Route path="/features/leave-management" element={<LeaveManagementFeature />} />
      <Route path="/features/performance-management" element={<PerformanceManagement />} />
      <Route path="/features/workspace-management" element={<WorkspaceManagement />} />
      <Route path="/features/application-integration-management" element={<ApplicationIntegrationManagement />} />
      <Route path="/features/people-management" element={<PeopleManagement />} />
      <Route path="/features/team-management" element={<TeamManagementFeature />} />
      <Route path="/features/document-center-management" element={<DocumentCenterManagement />} />
      <Route path="/features/helpdesk" element={<HelpdeskFeature />} />
      <Route path="/features/team-task-management" element={<TeamTaskManagement />} />
      <Route path="/features/notification-management" element={<NotificationManagement />} />
      <Route path="/features/mail-integration" element={<MailIntegration />} />
      <Route path="/features/ai-copilot" element={<AICopilot />} />

      {/* ==================================================================== */}
      {/* FEATURE DETAIL PAGES - ADMIN MODULES */}
      {/* ==================================================================== */}
      <Route path="/features/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/features/analytics-management" element={<AnalyticsManagement />} />
      <Route path="/features/monthly-reports-management" element={<MonthlyReportsManagement />} />
      <Route path="/features/user-management" element={<UserManagement />} />
      <Route path="/features/user-cards" element={<UserCards />} />
      <Route path="/features/employee-schedules" element={<EmployeeSchedules />} />
      <Route path="/features/user-pending-approvals" element={<UserPendingApprovals />} />
      <Route path="/features/admin-team-management" element={<AdminTeamManagement />} />
      <Route path="/features/admin-task-management" element={<AdminTaskManagement />} />
      <Route path="/features/helpdesk-solver" element={<HelpdeskSolver />} />
      <Route path="/features/company-overall-worklogz-management" element={<CompanyOverallWorklogzManagement />} />
      <Route path="/features/company-department-management" element={<CompanyDepartmentManagement />} />
      <Route path="/features/project-workspace-management" element={<ProjectWorkspaceManagement />} />
      <Route path="/features/customized-input-crm-management" element={<CustomizedInputCrmManagement />} />
      <Route path="/features/hr-management" element={<HrManagement />} />
      <Route path="/features/admin-leave-management" element={<AdminLeaveManagement />} />
      <Route path="/features/payroll-management" element={<PayrollManagement />} />
      <Route path="/features/plan-management" element={<PlanManagement />} />
      <Route path="/features/admin-access-control-management" element={<AdminAccessControlManagement />} />
      <Route path="/features/document-management" element={<DocumentManagement />} />
      <Route path="/features/company-settings-management" element={<CompanySettingsManagement />} />
      <Route path="/features/expense-management" element={<ExpenseManagement />} />
      <Route path="/features/admin-performance-management" element={<AdminPerformanceManagement />} />

      {/* ==================================================================== */}
      {/* PROTECTED ADMIN LAYOUT WRAPPER - ADMIN ONLY ROUTES */}
      {/* Based on sidebar: Dashboard, Administration, Master Control, */}
      {/* User Management, Company Settings, Platform Controls */}
      {/* ==================================================================== */}
      <Route element={<Layout />}>
        {/* Dashboard */}
        <Route path="/admin" element={<Company />} />

        {/* Administration */}
        <Route path="/administration/access-control" element={<AdministrationAccess />} />

        {/* Master Control */}
        <Route path="/master-control" element={<MasterControl />} />

        {/* User Management */}
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/pending-users" element={<PendingUsers />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/edit-user" element={<EditUser />} />

        {/* Company Settings */}
        <Route path="/theme-branding" element={<ThemeBranding />} />
        <Route path="/custom-fields" element={<CustomFields />} />
        <Route path="/workflow-rules" element={<WorkflowRules />} />

        {/* Platform Controls */}
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* ==================================================================== */}
      {/* PROTECTED EMPLOYEE LAYOUT WRAPPER - ADMIN & EMPLOYEE ROUTES */}
      {/* All other routes use EmployeeLayout - accessible by both admin and employees */}
      {/* ==================================================================== */}
      <Route element={<EmployeeLayout />}>
        {/* ==================================================================== */}
        {/* ADMIN ROUTES (using EmployeeLayout) */}
        {/* ==================================================================== */}
        {/* Home & Core - Admin Routes */}
        <Route path="/dashboard" element={<AttendanceDashboard />} />
        <Route path="/attendances" element={<Attendance />} />
        <Route path="/user-timesheet/:userId" element={<UserTimesheet />} />

        {/* HR & Administration - Admin Routes */}
        <Route path="/admin/team-management" element={<TeamManagement />} />

        {/* Time & Task Tracking - Admin Routes */}
        <Route path="/admin/task-manager" element={<TaskManager />} />

        {/* Leave Management - Admin Routes */}
        <Route path="/leave-requests" element={<LeaveRequestsAdmin />} />
        <Route path="/late-reports" element={<LateReports />} />
        <Route path="/holidays" element={<Holidays />} />

        {/* Finance & Compensation - Admin Routes */}
        <Route path="/payslip" element={<PayslipGenerator />} />
        <Route path="/salaryhistory" element={<PayslipList />} />
        <Route path="/daily-salary-credit" element={<DailySalaryCredit />} />
        <Route path="/income-expense" element={<IncomeExpense />} />
        <Route path="/income&expence" element={<IncomeExpense />} />
        <Route path="/daytoday" element={<DayToday />} />

        {/* Documents & Administration - Admin Routes */}
        <Route path="/upload-documents" element={<UploadDocuments />} />
        <Route path="/offer-letters" element={<OfferLetters />} />
        <Route path="/experience-letters" element={<ExperienceLetters />} />
        <Route path="/relieving-letters" element={<RelievingLetters />} />

        {/* Project Management - Admin Routes */}
        <Route path="/projects" element={<ProjectsWorkspace />} />
        <Route path="/company-worklogz" element={<CompanyWorklogz />} />
        <Route path="/company-departments" element={<CompanyDepartments />} />
        <Route path="/company-departments/create" element={<CreateWorkCard />} />
        <Route path="/company-departments/:department" element={<DepartmentWorkCards />} />

        {/* Sales & CRM - Admin Routes */}
        <Route path="/crm/course" element={<CourseCRM />} />
        <Route path="/crm/internship" element={<InternshipCRM />} />
        <Route path="/crm/it-projects" element={<ITProjectsCRM />} />

        {/* Payment & Billing - Admin Routes */}
        <Route path="/fee-payments" element={<FeePaymentsManagement />} />
        <Route path="/plans" element={<Plans />} />

        {/* Marketing & Analytics - Admin Routes */}
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/reports" element={<Reports />} />

        {/* Edutech & Learning - Admin Routes */}
        <Route path="/assessments" element={<Assessments />} />

        {/* Collaboration, Communication & Support - Admin Routes */}
        <Route path="/admin/helpdesk" element={<Helpdesk />} />

        {/* ==================================================================== */}
        {/* EMPLOYEE ROUTES */}
        {/* ==================================================================== */}
        {/* Home & Core */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance/:userId" element={<AttendancePage />} />

        {/* HR & Administration */}
        <Route path="/employee/people" element={<PeoplePage />} />
        <Route path="/employee/applications" element={<ApplicationsPage />} />
        <Route path="/team-management" element={<EmployeeTeamManagement />} />

        {/* Time & Task Tracking */}
        <Route path="/timesheet" element={<TimeSheet />} />
        <Route path="/task-manager" element={<TaskManager />} />
        <Route path="/calendar" element={<CalendarView />} />

        {/* Leave Management */}
        <Route path="/apply-leave" element={<LeaveManagement />} />

        {/* Finance & Compensation */}
        <Route path="/my-earnings" element={<MyEarnings />} />
        <Route path="/invoices" element={<Invoices />} />

        {/* Documents & Administration */}
        <Route path="/documents" element={<DocumentCenter />} />

        {/* Project Management */}
        <Route path="/employee/workspace" element={<WorkspacePage />} />

        {/* Payment & Billing */}
        <Route path="/employee/fee-payment" element={<FeePayment />} />

        {/* Edutech & Learning */}
        <Route path="/skill-development" element={<SkillDevelopment />} />
        <Route path="/employee/assessments" element={<EmployeeAssessments />} />
        <Route path="/employee/worklogztube" element={<WorklogzTube />} />
        <Route path="/employee/trainers" element={<Trainers />} />

        {/* Goals & Performance */}
        <Route path="/goals-achievements" element={<GoalsAchievements />} />
        <Route path="/performance" element={<PerformanceDashboard />} />

        {/* Collaboration, Communication & Support */}
        <Route path="/employee/community" element={<CommunityPage />} />
        <Route path="/helpdesk" element={<HelpdeskPage />} />

        {/* AI & Automation */}
        <Route path="/employee/ai" element={<AICopilotPage />} />

        {/* Core Navigation & Platform Controls */}
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
