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
import PayslipGenerator from './pages/admin/PayslipGenerator';
import PayslipList from './pages/admin/PayslipList';
import TaskManager from './pages/admin/TaskManager';
import UserTimesheet from './pages/admin/UserTimesheet';
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
// Layout
import Layout from './components/admin-dashboard/layout/Layout';

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
        <Route path="/goals-achievements" element={<GoalsAchievements />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/performance" element={<PerformanceDashboard />} />
        <Route path="/my-earnings" element={<MyEarnings />} />
        

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
          <Route path="/company-departments" element={<CompanyDepartments />} />
          <Route path="/company-departments/create" element={<CreateWorkCard />} />
          <Route path="/company-departments/:department" element={<DepartmentWorkCards />} />
          <Route path="/daily-salary-credit" element={<DailySalaryCredit />} />
          <Route path="/late-reports" element={<LateReports />} />
          <Route path="/experience-letters" element={<ExperienceLetters />} />
          <Route path="/offer-letters" element={<OfferLetters />} />
          <Route path="/relieving-letters" element={<RelievingLetters />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          {/* Add other admin routes here */}
          <Route path="/edit-user" element={<EditUser />} />
        </Route>

      </Routes>
   
  );
}

export default App;
