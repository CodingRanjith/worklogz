import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AdminLeaveManagement = () => {
  return (
    <FeatureDetailPage
      title="Leave Management"
      description="Manage employee leave requests and approvals. Monitor leave balances, approve/reject requests, track leave trends, and ensure proper leave management across the organization."
      icon={<FiCalendar />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Leave Request Management", description: "View and manage all leave requests from employees." },
        { title: "Leave Approval Workflow", description: "Approve or reject leave requests with comments and reasons." },
        { title: "Leave Balance Monitoring", description: "Monitor leave balances for all employees in real-time." },
        { title: "Leave Policy Configuration", description: "Configure leave policies, types, and accrual rules." },
        { title: "Leave Calendar", description: "Visual calendar showing all employee leaves and availability." },
        { title: "Leave Reports", description: "Generate comprehensive reports on leave utilization and trends." },
        { title: "Holiday Management", description: "Manage company holidays and calendar." },
        { title: "Bulk Operations", description: "Perform bulk approvals and leave balance updates." }
      ]}
      benefits={[
        { title: "Better Control", description: "Maintain better control over leave management." },
        { title: "Workforce Planning", description: "Plan workforce coverage based on leave calendar." },
        { title: "Compliance", description: "Ensure compliance with leave policies and regulations." }
      ]}
      useCases={[
        { title: "Leave Approvals", description: "Process leave approvals efficiently with clear visibility." },
        { title: "Coverage Planning", description: "Plan workforce coverage based on leave calendar." },
        { title: "Policy Enforcement", description: "Enforce leave policies consistently across organization." }
      ]}
    />
  );
};

export default AdminLeaveManagement;

