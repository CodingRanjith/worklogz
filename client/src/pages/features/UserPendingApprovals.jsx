import React from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const UserPendingApprovals = () => {
  return (
    <FeatureDetailPage
      title="User Pending Approvals"
      description="Review and approve pending user requests and submissions. Manage leave requests, timesheets, expense claims, and other approval workflows efficiently."
      icon={<FiCheckSquare />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Unified Approval Dashboard", description: "Centralized dashboard for all pending approvals." },
        { title: "Leave Approvals", description: "Review and approve/reject leave requests with comments." },
        { title: "Timesheet Approvals", description: "Approve timesheet submissions from employees." },
        { title: "Expense Approvals", description: "Review and approve expense claims with receipts." },
        { title: "Bulk Approval", description: "Approve multiple requests in bulk for efficiency." },
        { title: "Approval Workflow", description: "Configure multi-level approval workflows as needed." },
        { title: "Approval History", description: "Track complete history of all approvals and decisions." },
        { title: "Notifications", description: "Get notified of new pending approvals requiring attention." }
      ]}
      benefits={[
        { title: "Quick Processing", description: "Process approvals quickly with unified dashboard." },
        { title: "Better Control", description: "Maintain control over all approval workflows." },
        { title: "Efficiency", description: "Improve efficiency with bulk approval capabilities." }
      ]}
      useCases={[
        { title: "Daily Approvals", description: "Review and process daily approval requests efficiently." },
        { title: "Leave Management", description: "Manage leave approvals with clear visibility of requests." },
        { title: "Workflow Automation", description: "Streamline approval workflows with automated routing." }
      ]}
    />
  );
};

export default UserPendingApprovals;


