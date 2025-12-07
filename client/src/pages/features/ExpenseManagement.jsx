import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const ExpenseManagement = () => {
  return (
    <FeatureDetailPage
      title="Expense Management"
      description="Track and manage company expenses and reimbursements. Handle expense claims, approvals, reimbursements, and maintain comprehensive expense records."
      icon={<FiCreditCard />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Expense Claim Management", description: "Review and manage expense claims from employees." },
        { title: "Receipt Management", description: "Manage expense receipts and supporting documents." },
        { title: "Approval Workflows", description: "Configure multi-level approval workflows for expenses." },
        { title: "Expense Categories", description: "Organize expenses by categories for better tracking." },
        { title: "Budget Management", description: "Set and track expense budgets for departments and projects." },
        { title: "Reimbursement Processing", description: "Process reimbursements and track payment status." },
        { title: "Expense Reports", description: "Generate comprehensive expense reports and analytics." },
        { title: "Policy Enforcement", description: "Enforce expense policies and limits automatically." }
      ]}
      benefits={[
        { title: "Better Control", description: "Maintain better control over company expenses." },
        { title: "Compliance", description: "Ensure compliance with expense policies and regulations." },
        { title: "Cost Optimization", description: "Optimize costs with expense tracking and analytics." }
      ]}
      useCases={[
        { title: "Expense Approval", description: "Review and approve expense claims efficiently." },
        { title: "Budget Tracking", description: "Track expenses against budgets and control spending." },
        { title: "Financial Reporting", description: "Generate expense reports for financial analysis." }
      ]}
    />
  );
};

export default ExpenseManagement;


