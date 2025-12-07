import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const PayrollManagement = () => {
  return (
    <FeatureDetailPage
      title="Payroll Management"
      description="Automated payroll processing and salary management. Process payroll, generate payslips, manage deductions, and handle all payroll-related tasks efficiently."
      icon={<FiDollarSign />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Automated Payroll Processing", description: "Automatically process payroll based on attendance and timesheet data." },
        { title: "Salary Calculation", description: "Calculate salaries with custom formulas and rules." },
        { title: "Deduction Management", description: "Manage tax deductions, loans, and other deductions." },
        { title: "Payslip Generation", description: "Automatically generate payslips in PDF format." },
        { title: "Payment Processing", description: "Track payment processing and transaction records." },
        { title: "Tax Management", description: "Manage tax calculations, TDS, and compliance." },
        { title: "Payroll Reports", description: "Generate comprehensive payroll reports and summaries." },
        { title: "Bulk Operations", description: "Process payroll for multiple employees in bulk." }
      ]}
      benefits={[
        { title: "Time Savings", description: "Save time with automated payroll processing." },
        { title: "Accuracy", description: "Ensure accuracy in salary calculations and payments." },
        { title: "Compliance", description: "Maintain compliance with tax and labor regulations." }
      ]}
      statistics={[
        { number: '100%', label: 'Automated' },
        { number: 'Instant', label: 'Processing' },
        { number: 'Accurate', label: 'Calculations' }
      ]}
      integrations={[
        {
          name: 'QuickBooks',
          description: 'Sync payroll data with QuickBooks accounting',
          icon: 'quickbooks',
          status: 'available',
          link: '/docs/integrations/quickbooks'
        },
        {
          name: 'Xero',
          description: 'Integrate with Xero for accounting',
          icon: 'api',
          status: 'available',
          link: '/docs/integrations/xero'
        },
        {
          name: 'Banking APIs',
          description: 'Direct bank integration for payments',
          icon: 'api',
          status: 'available',
          link: '/docs/integrations/banking'
        },
        {
          name: 'Tax Software',
          description: 'Export data to tax filing software',
          icon: 'documents',
          status: 'available',
          link: '/docs/integrations/tax'
        },
        {
          name: 'Excel Export',
          description: 'Export payroll data to Excel',
          icon: 'documents',
          status: 'available',
          link: '/docs/features/excel-export'
        }
      ]}
      useCases={[
        { 
          title: "Monthly Payroll", 
          description: "Process monthly payroll for all employees efficiently.",
          example: "On the 25th of each month, process payroll for 500 employees in under 10 minutes with automated calculations and payslip generation."
        },
        { 
          title: "Salary Queries", 
          description: "Handle salary queries with clear payslip breakdowns.",
          example: "An employee asks about their salary deduction. Generate and email a detailed payslip breakdown showing all components instantly."
        },
        { 
          title: "Compliance Reporting", 
          description: "Generate reports for tax and compliance requirements.",
          example: "Export all payroll data for tax filing season in the required format for your accounting software with one click."
        }
      ]}
    />
  );
};

export default PayrollManagement;

