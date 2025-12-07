import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const LeaveManagement = () => {
  return (
    <FeatureDetailPage
      title="Leave Management"
      description="Apply, track, and manage leave requests with approval workflows. View leave balance, history, and get quick approvals for time off."
      icon={<FiCalendar />}
      image={null}
      moduleType="User"
      features={[
        { title: "Leave Application", description: "Apply for various types of leave (sick, casual, annual, etc.) with easy forms." },
        { title: "Leave Balance", description: "View available leave balance for different leave types in real-time." },
        { title: "Leave Calendar", description: "Visual calendar showing approved leaves, pending requests, and holidays." },
        { title: "Approval Tracking", description: "Track leave request status and get notifications on approval/rejection." },
        { title: "Leave History", description: "Complete history of all leave applications and approvals." },
        { title: "Multi-Level Approval", description: "Support for multiple approval levels based on leave duration." },
        { title: "Leave Cancellation", description: "Cancel approved leaves if plans change, with automatic balance update." },
        { title: "Holiday Calendar", description: "View company holidays and plan leaves accordingly." }
      ]}
      benefits={[
        { title: "Easy Application", description: "Simple and quick leave application process from anywhere." },
        { title: "Transparency", description: "Clear visibility of leave balance and request status." },
        { title: "Quick Approvals", description: "Faster approval process with automated workflows." }
      ]}
      useCases={[
        { title: "Vacation Planning", description: "Plan vacations by checking leave balance and applying in advance." },
        { title: "Emergency Leaves", description: "Quickly apply for emergency leaves with immediate notifications to managers." },
        { title: "Leave Tracking", description: "Keep track of all leaves taken throughout the year for planning." }
      ]}
    />
  );
};

export default LeaveManagement;

