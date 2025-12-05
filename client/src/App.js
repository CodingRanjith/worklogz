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
import Pricing from './docs/pages/Pricing';
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

// Landing Page
import LandingPage from './pages/landing/LandingPage';

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

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Public Routes */}
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
        <Route path="/docs/pricing" element={<Pricing />} />
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
