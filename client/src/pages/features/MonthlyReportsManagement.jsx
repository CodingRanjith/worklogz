import React from 'react';
import { FiFile } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const MonthlyReportsManagement = () => {
  return (
    <FeatureDetailPage
      title="Monthly Reports Management"
      description="Generate and manage monthly reports and summaries. Create comprehensive monthly reports for attendance, payroll, performance, and more."
      icon={<FiFile />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Automated Report Generation", description: "Automatically generate monthly reports with predefined templates." },
        { title: "Custom Report Builder", description: "Create custom monthly reports with specific metrics and data." },
        { title: "Report Templates", description: "Use pre-built templates for common monthly reports." },
        { title: "Multiple Report Types", description: "Generate reports for attendance, payroll, performance, and more." },
        { title: "Data Aggregation", description: "Aggregate data from multiple sources for comprehensive reports." },
        { title: "PDF Export", description: "Export reports in PDF format for sharing and archiving." },
        { title: "Email Distribution", description: "Automatically email reports to stakeholders." },
        { title: "Report Scheduling", description: "Schedule automatic report generation at month-end." }
      ]}
      benefits={[
        { title: "Time Savings", description: "Save time with automated monthly report generation." },
        { title: "Consistency", description: "Ensure consistent reporting format and metrics." },
        { title: "Comprehensive Insights", description: "Get comprehensive insights from monthly data summaries." }
      ]}
      useCases={[
        { title: "Monthly Summaries", description: "Generate monthly summaries for management review." },
        { title: "Compliance Reporting", description: "Create reports for compliance and regulatory requirements." },
        { title: "Performance Reviews", description: "Use monthly reports for performance review meetings." }
      ]}
    />
  );
};

export default MonthlyReportsManagement;


