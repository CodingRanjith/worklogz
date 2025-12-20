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
import AdministrationAccess from './pages/admin/AdministrationAccess';
import MasterControl from './pages/admin/MasterControl';


import AttendancePage from './pages/employee/AttendancePage';
import Leave from './pages/employee/ApplyLeaveForm';
import LeaveManagement from './pages/employee/LeaveManagement';
import GoalsAchievements from './pages/employee/GoalsAchievements';
import CalendarView from './pages/employee/CalendarView';
import PerformanceDashboard from './pages/employee/PerformanceDashboard';
import MyEarnings from './pages/employee/MyEarnings';
import CommunityPage from './pages/employee/CommunityPage';
import WorkspacePage from './pages/employee/WorkspacePage';
import ApplicationsPage from './pages/employee/ApplicationsPage';
import PeoplePage from './pages/employee/PeoplePage';
import AICopilotPage from './pages/employee/AICopilotPage';
import DocumentCenter from './pages/employee/DocumentCenter';
import HelpdeskPage from './pages/employee/HelpdeskPage';
import HomePage from './pages/employee/HomePage';
import NotificationPage from './pages/employee/NotificationPage';
import Invoices from './pages/employee/Invoices';
import EditUser from './components/EditUser';
import PendingUsers from './pages/admin/PendingUsers';
import AllUsers from './pages/admin/AllUsers';
import Holidays from './pages/admin/Holidays';
import TimeSheet from './pages/employee/Timesheet';
import SkillDevelopment from './pages/employee/SkillDevelopment';
import EmployeeTeamManagement from './pages/employee/TeamManagement';
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
import ThemeBranding from './pages/admin/ThemeBranding';
import CourseCRM from './pages/admin/CourseCRM';
import WorkflowRules from './pages/admin/WorkflowRules';
import InternshipCRM from './pages/admin/InternshipCRM';
import ITProjectsCRM from './pages/admin/ITProjectsCRM';
import CRMDashboard from './pages/admin/CRMDashboard';
import ProjectsWorkspace from './pages/admin/ProjectsWorkspace';
import Helpdesk from './pages/admin/Helpdesk';
import Plans from './pages/admin/Plans';
import TeamManagement from './pages/admin/TeamManagement';
import Assessments from './pages/admin/Assessments';
import CustomFields from './pages/admin/CustomFields';
import EmployeeAssessments from './pages/employee/Assessments';
import WorklogzTube from './pages/employee/WorklogzTube';
import FeePayment from './pages/employee/FeePayment';
import FeePaymentsManagement from './pages/admin/FeePaymentsManagement';
import ProfileSettings from './pages/employee/ProfileSettings';
import Company from './pages/admin/Company';
// Layout
import Layout from './components/admin-dashboard/layout/Layout';
import EmployeeLayout from './components/employee-dashboard/layout/EmployeeLayout';

// Documentation Pages
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

// Feature Detail Pages - User Modules
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

// Feature Detail Pages - Admin Modules
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
            if (decoded.role === 'admin') navigate('/dashboard');
            else if (decoded.role === 'employee') navigate('/home');
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

        {/* Landing Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/public" element={<PublicLandingPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/for-business" element={<ForBusiness />} />
        <Route path="/for-enterprise" element={<ForEnterprise />} />
        <Route path="/for-education" element={<ForEducation />} />
        <Route path="/for-individuals" element={<ForIndividuals />} />
        <Route path="/product-overview" element={<ProductOverview />} />
        <Route path="/product-configurator" element={<ProductPdfConfigurator />} />
        
        {/* Feature Detail Pages - User Modules */}
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
        
        {/* Feature Detail Pages - Admin Modules */}
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
        
        {/* Protected Employee Layout Wrapper */}
        <Route element={<EmployeeLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance/:userId" element={<AttendancePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/employee/community" element={<CommunityPage />} />
          <Route path="/employee/workspace" element={<WorkspacePage />} />
          <Route path="/employee/applications" element={<ApplicationsPage />} />
          <Route path="/employee/people" element={<PeoplePage />} />
          <Route path="/employee/ai" element={<AICopilotPage />} />
          <Route path="/apply-leave" element={<LeaveManagement />} />
          <Route path="/timesheet" element={<TimeSheet />} />
          <Route path="/skill-development" element={<SkillDevelopment />} />
          <Route path="/employee/assessments" element={<EmployeeAssessments />} />
          <Route path="/goals-achievements" element={<GoalsAchievements />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/performance" element={<PerformanceDashboard />} />
          <Route path="/my-earnings" element={<MyEarnings />} />
          <Route path="/team-management" element={<EmployeeTeamManagement />} />
          <Route path="/documents" element={<DocumentCenter />} />
          <Route path="/helpdesk" element={<HelpdeskPage />} />
          <Route path="/employee/worklogztube" element={<WorklogzTube />} />
          <Route path="/employee/fee-payment" element={<FeePayment />} />
          <Route path="/task-manager" element={<TaskManager />} /> {/* Task Manager with Employee Sidebar */}
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/admin" element={<Company />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/salaryhistory" element={<PayslipList />} />
          <Route path="/attendances" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/pending-users" element={<PendingUsers />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/payslip" element={<PayslipGenerator />} />
          <Route path="/leave-requests" element={<LeaveRequestsAdmin />} />
          <Route path="/user-timesheet/:userId" element={<UserTimesheet />} />
          <Route path="/company-worklogz" element={<CompanyWorklogz />} />
          <Route path="/company-departments" element={<CompanyDepartments />} />
          <Route path="/company-departments/create" element={<CreateWorkCard />} />
          <Route path="/company-departments/:department" element={<DepartmentWorkCards />} />
          <Route path="/projects" element={<ProjectsWorkspace />} />
          <Route path="/crm/dashboard" element={<CRMDashboard />} />
          <Route path="/crm/course" element={<CourseCRM />} />
          <Route path="/crm/internship" element={<InternshipCRM />} />
          <Route path="/crm/it-projects" element={<ITProjectsCRM />} />
          <Route path="/daily-salary-credit" element={<DailySalaryCredit />} />
          <Route path="/late-reports" element={<LateReports />} />
          <Route path="/experience-letters" element={<ExperienceLetters />} />
          <Route path="/offer-letters" element={<OfferLetters />} />
          <Route path="/relieving-letters" element={<RelievingLetters />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/theme-branding" element={<ThemeBranding />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/administration/access-control" element={<AdministrationAccess />} />
          <Route path="/master-control" element={<MasterControl />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/admin/team-management" element={<TeamManagement />} />
          <Route path="/task-manager" element={<TaskManager />} /> {/* Task Manager with Admin Sidebar */}
          <Route path="/assessments" element={<Assessments />} />
        </Route>
        
        {/* Documentation Routes */}
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

        {/* Protected Admin Layout Wrapper */}
        <Route element={<Layout />}>
          <Route path="/admin" element={<Company />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/salaryhistory" element={<PayslipList />} />
          <Route path="/attendances" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/pending-users" element={<PendingUsers />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/payslip" element={<PayslipGenerator />} />
          <Route path="/leave-requests" element={<LeaveRequestsAdmin />} />
          <Route path="/user-timesheet/:userId" element={<UserTimesheet />} />
          <Route path="/company-worklogz" element={<CompanyWorklogz />} />
          <Route path="/company-departments" element={<CompanyDepartments />} />
          <Route path="/company-departments/create" element={<CreateWorkCard />} />
          <Route path="/company-departments/:department" element={<DepartmentWorkCards />} />
          <Route path="/projects" element={<ProjectsWorkspace />} />
          <Route path="/crm/dashboard" element={<CRMDashboard />} />
          <Route path="/crm/course" element={<CourseCRM />} />
          <Route path="/crm/internship" element={<InternshipCRM />} />
          <Route path="/crm/it-projects" element={<ITProjectsCRM />} />
          <Route path="/daily-salary-credit" element={<DailySalaryCredit />} />
          <Route path="/late-reports" element={<LateReports />} />
          <Route path="/experience-letters" element={<ExperienceLetters />} />
          <Route path="/offer-letters" element={<OfferLetters />} />
          <Route path="/relieving-letters" element={<RelievingLetters />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/theme-branding" element={<ThemeBranding />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/administration/access-control" element={<AdministrationAccess />} />
          <Route path="/master-control" element={<MasterControl />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/admin/team-management" element={<TeamManagement />} />
          <Route path="/task-manager" element={<TaskManager />} /> {/* Task Manager with Admin Sidebar */}
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/fee-payments" element={<FeePaymentsManagement />} />
          <Route path="/custom-fields" element={<CustomFields />} />
          <Route path="/workflow-rules" element={<WorkflowRules />} />
          {/* Add other admin routes here */}
          <Route path="/edit-user" element={<EditUser />} />
        </Route>

      </Routes>
   
  );
}

export default App;
