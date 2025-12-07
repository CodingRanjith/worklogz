import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const SalaryManagement = () => {
  return (
    <FeatureDetailPage
      title="Salary Management"
      description="View salary details, history, and daily earnings tracking. Access payslips, salary breakdowns, and payment history in one place."
      icon={<FiDollarSign />}
      image={null}
      moduleType="User"
      features={[
        { title: "Salary Details", description: "View complete salary breakdown including basic pay, allowances, and deductions." },
        { title: "Payslip Access", description: "Download and view payslips in PDF format for all payment periods." },
        { title: "Payment History", description: "Access complete payment history with transaction details and dates." },
        { title: "Daily Earnings", description: "Track daily earnings based on attendance and hours worked." },
        { title: "Salary Components", description: "View detailed breakdown of all salary components and calculations." },
        { title: "Tax Information", description: "Access tax deductions, TDS information, and tax certificates." },
        { title: "Bonus & Incentives", description: "View bonus payments, incentives, and performance rewards." },
        { title: "Yearly Summary", description: "Annual salary summary with total earnings and deductions." }
      ]}
      benefits={[
        { title: "Transparency", description: "Complete transparency in salary calculations and payments." },
        { title: "Easy Access", description: "Access salary information and payslips anytime, anywhere." },
        { title: "Financial Planning", description: "Better financial planning with clear visibility of earnings." }
      ]}
      useCases={[
        { title: "Payslip Download", description: "Employees can download payslips for loan applications and tax filing." },
        { title: "Salary Queries", description: "Clear visibility helps resolve salary-related queries quickly." },
        { title: "Financial Tracking", description: "Track earnings and plan finances with accurate salary information." }
      ]}
    />
  );
};

export default SalaryManagement;


