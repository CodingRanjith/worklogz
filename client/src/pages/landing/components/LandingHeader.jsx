import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiUser,
  FiClock,
  FiUsers,
  FiCheckSquare,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiBriefcase,
  FiGrid,
  FiFolder,
  FiHelpCircle,
  FiFileText,
  FiBell,
  FiMail,
  FiZap,
  FiBarChart2,
  FiFile,
  FiShield,
  FiSettings,
  FiCreditCard,
  FiTarget,
  FiClipboard,
  FiSearch,
  FiShoppingCart,
  FiPieChart,
  FiBookOpen,
  FiMessageCircle,
  FiActivity,
  FiCode
} from 'react-icons/fi';
import './LandingHeader.css';
import worklogzLogo from '../../../assets/worklogz-logo.png';

// Static feature categories and modules - Based on PRODUCT_OVERVIEW.md
const STATIC_FEATURE_CATEGORIES = [
  {
    id: 'home-core',
    name: 'Home & Core',
    icon: <FiUser />,
    modules: [
      { icon: <FiUser />, title: 'Home', description: 'Dashboard home and overview', route: '/features/user-profile-management' },
      { icon: <FiBarChart2 />, title: 'Dashboard', description: 'Main dashboard with key metrics', route: '/features/user-profile-management' },
      { icon: <FiClock />, title: 'Attendance', description: 'Track and manage attendance', route: '/features/attendance-management' },
    ],
  },
  {
    id: 'hr-administration',
    name: 'HR & Administration',
    icon: <FiUsers />,
    modules: [
      { icon: <FiUsers />, title: 'User & Employee Management', description: 'Manage users and employees', route: '/features/user-management' },
      { icon: <FiUsers />, title: 'People', description: 'People directory and profiles', route: '/features/people-management' },
      { icon: <FiUsers />, title: 'Team Management', description: 'Manage teams and departments', route: '/features/team-management' },
      { icon: <FiCode />, title: 'Applications', description: 'Application integration management', route: '/features/application-integration-management' },
      { icon: <FiShield />, title: 'Roles & Permissions', description: 'Manage roles and access control', route: '/features/admin-access-control-management' },
      { icon: <FiUser />, title: 'Onboarding & Offboarding', description: 'Employee onboarding process', route: '/features/user-pending-approvals' },
      { icon: <FiUser />, title: 'Employee Profiles', description: 'Manage employee profiles', route: '/features/user-profile-management' },
      { icon: <FiCheckSquare />, title: 'HR Requests & Approvals', description: 'HR request management', route: '/features/user-pending-approvals' },
      { icon: <FiUsers />, title: 'Org Chart', description: 'Organizational structure', route: '/features/company-department-management' },
      { icon: <FiPieChart />, title: 'HR Analytics', description: 'HR metrics and insights', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'time-task-tracking',
    name: 'Time & Task Tracking',
    icon: <FiClock />,
    modules: [
      { icon: <FiCheckSquare />, title: 'Task Manager', description: 'Manage and track tasks', route: '/features/task-manager' },
      { icon: <FiCheckSquare />, title: 'Admin Task Manager', description: 'Admin task management', route: '/features/admin-task-management' },
      { icon: <FiActivity />, title: 'Worklog Tracking', description: 'Track work logs and activities', route: '/features/company-overall-worklogz-management' },
      { icon: <FiCalendar />, title: 'Calendar View', description: 'Calendar-based task view', route: '/features/task-manager' },
      { icon: <FiClock />, title: 'Timesheets', description: 'Timesheet management', route: '/features/task-manager' },
      { icon: <FiBarChart2 />, title: 'Productivity Reports', description: 'Productivity analytics', route: '/features/analytics-management' },
      { icon: <FiCalendar />, title: 'Shift Management', description: 'Manage shifts and schedules', route: '/features/employee-schedules' },
      { icon: <FiClock />, title: 'Overtime Tracking', description: 'Track overtime hours', route: '/features/attendance-management' },
      { icon: <FiZap />, title: 'AI Time Insights', description: 'AI-powered time analytics', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'leave-management',
    name: 'Leave Management',
    icon: <FiCalendar />,
    modules: [
      { icon: <FiCalendar />, title: 'Apply Leave', description: 'Submit leave requests', route: '/features/leave-management' },
      { icon: <FiFileText />, title: 'Leave Records', description: 'View leave history', route: '/features/leave-management' },
      { icon: <FiClock />, title: 'Late Reports', description: 'Track late arrivals', route: '/features/attendance-management' },
      { icon: <FiCalendar />, title: 'Holiday List', description: 'Company holidays', route: '/features/leave-management' },
      { icon: <FiSettings />, title: 'Leave Policies', description: 'Manage leave policies', route: '/features/leave-management' },
      { icon: <FiCheckSquare />, title: 'Leave Approvals', description: 'Approve leave requests', route: '/features/admin-leave-management' },
      { icon: <FiCalendar />, title: 'Comp-Off Management', description: 'Compensatory off management', route: '/features/leave-management' },
      { icon: <FiCalendar />, title: 'Shift-Based Leaves', description: 'Shift-based leave tracking', route: '/features/leave-management' },
      { icon: <FiBarChart2 />, title: 'Leave Analytics', description: 'Leave metrics and reports', route: '/features/analytics-management' },
      { icon: <FiZap />, title: 'AI Leave Insights', description: 'AI-powered leave analytics', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'finance-compensation',
    name: 'Finance & Compensation',
    icon: <FiDollarSign />,
    modules: [
      { icon: <FiDollarSign />, title: 'Salary', description: 'Salary management', route: '/features/salary-management' },
      { icon: <FiFileText />, title: 'Pay History', description: 'Payment history records', route: '/features/salary-management' },
      { icon: <FiFile />, title: 'Payslip Generator', description: 'Generate payslips', route: '/features/salary-management' },
      { icon: <FiDollarSign />, title: 'Daily Salary Credit', description: 'Daily salary processing', route: '/features/salary-management' },
      { icon: <FiCreditCard />, title: 'Expense Claims', description: 'Manage expense claims', route: '/features/expense-management' },
      { icon: <FiDollarSign />, title: 'Payroll Processing', description: 'Process payroll', route: '/features/payroll-management' },
      { icon: <FiDollarSign />, title: 'Bonuses & Incentives', description: 'Manage bonuses', route: '/features/salary-management' },
      { icon: <FiFileText />, title: 'Tax & Compliance', description: 'Tax management', route: '/features/payroll-management' },
      { icon: <FiCreditCard />, title: 'Reimbursements', description: 'Reimbursement processing', route: '/features/expense-management' },
      { icon: <FiBarChart2 />, title: 'Finance Analytics', description: 'Financial insights', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'documents-administration',
    name: 'Documents & Administration',
    icon: <FiFolder />,
    modules: [
      { icon: <FiFolder />, title: 'Document Center', description: 'Central document repository', route: '/features/document-center-management' },
      { icon: <FiFile />, title: 'Offer Letters', description: 'Generate offer letters', route: '/features/document-management' },
      { icon: <FiFile />, title: 'Experience Letters', description: 'Create experience letters', route: '/features/document-management' },
      { icon: <FiFile />, title: 'Relieving Letters', description: 'Generate relieving letters', route: '/features/document-management' },
      { icon: <FiFile />, title: 'Upload Documents', description: 'Upload and manage documents', route: '/features/document-center-management' },
      { icon: <FiFileText />, title: 'Document Templates', description: 'Document templates library', route: '/features/document-management' },
      { icon: <FiCheckSquare />, title: 'E-Sign & Approvals', description: 'Electronic signatures', route: '/features/document-management' },
      { icon: <FiFile />, title: 'Version Control', description: 'Document versioning', route: '/features/document-center-management' },
      { icon: <FiShield />, title: 'Access & Permissions', description: 'Document access control', route: '/features/document-center-management' },
      { icon: <FiFileText />, title: 'Audit Logs', description: 'Document audit trails', route: '/features/document-management' },
    ],
  },
  {
    id: 'project-management',
    name: 'Project Management',
    icon: <FiBriefcase />,
    modules: [
      { icon: <FiBriefcase />, title: 'Project Workspace', description: 'Project workspace management', route: '/features/project-workspace-management' },
      { icon: <FiBriefcase />, title: 'My Workspace', description: 'Personal workspace', route: '/features/workspace-management' },
      { icon: <FiActivity />, title: 'Company Worklogz', description: 'Company-wide work tracking', route: '/features/company-overall-worklogz-management' },
      { icon: <FiUsers />, title: 'Company Departments', description: 'Department management', route: '/features/company-department-management' },
      { icon: <FiFileText />, title: 'Project Reports', description: 'Project analytics', route: '/features/analytics-management' },
      { icon: <FiCheckSquare />, title: 'Task Manager (Project)', description: 'Project task management', route: '/features/task-manager' },
      { icon: <FiCheckSquare />, title: 'Admin Task Manager (Project)', description: 'Admin project tasks', route: '/features/admin-task-management' },
      { icon: <FiClipboard />, title: 'Sub Tasks', description: 'Manage subtasks', route: '/features/task-manager' },
      { icon: <FiTarget />, title: 'Milestones', description: 'Project milestones', route: '/features/project-workspace-management' },
      { icon: <FiBarChart2 />, title: 'Productivity Reports (Project)', description: 'Project productivity', route: '/features/analytics-management' },
      { icon: <FiGrid />, title: 'Sprint & Agile Board', description: 'Agile project management', route: '/features/project-workspace-management' },
      { icon: <FiUsers />, title: 'Resource Allocation', description: 'Resource management', route: '/features/project-workspace-management' },
      { icon: <FiHelpCircle />, title: 'Risk & Issue Tracking', description: 'Risk management', route: '/features/project-workspace-management' },
      { icon: <FiCalendar />, title: 'Project Timeline (Gantt)', description: 'Gantt chart view', route: '/features/project-workspace-management' },
      { icon: <FiZap />, title: 'Project Automation (AI)', description: 'AI project automation', route: '/features/project-workspace-management' },
    ],
  },
  {
    id: 'sales-crm',
    name: 'Sales & CRM',
    icon: <FiShoppingCart />,
    modules: [
      { icon: <FiShoppingCart />, title: 'Customer Relationship Management', description: 'CRM system', route: '/features/customized-input-crm-management' },
      { icon: <FiBarChart2 />, title: 'CRM Dashboard', description: 'CRM analytics dashboard', route: '/features/customized-input-crm-management' },
      { icon: <FiBookOpen />, title: 'Course CRM', description: 'Education CRM', route: '/features/customized-input-crm-management' },
      { icon: <FiUsers />, title: 'Internship CRM', description: 'Internship management', route: '/features/customized-input-crm-management' },
      { icon: <FiCode />, title: 'IT Projects CRM', description: 'IT project CRM', route: '/features/customized-input-crm-management' },
      { icon: <FiSettings />, title: 'Custom CRM', description: 'Customizable CRM', route: '/features/customized-input-crm-management' },
      { icon: <FiTarget />, title: 'Leads Management', description: 'Lead tracking', route: '/features/customized-input-crm-management' },
      { icon: <FiTrendingUp />, title: 'Deals & Pipeline', description: 'Sales pipeline', route: '/features/customized-input-crm-management' },
      { icon: <FiUsers />, title: 'Contacts & Accounts', description: 'Contact management', route: '/features/customized-input-crm-management' },
      { icon: <FiBell />, title: 'Follow-ups & Activities', description: 'Activity tracking', route: '/features/customized-input-crm-management' },
      { icon: <FiZap />, title: 'CRM Automation (n8n)', description: 'CRM workflow automation', route: '/features/customized-input-crm-management' },
    ],
  },
  {
    id: 'payment-billing',
    name: 'Payment & Billing',
    icon: <FiCreditCard />,
    modules: [
      { icon: <FiCreditCard />, title: 'Fee Payments (Admin)', description: 'Admin fee management', route: '/features/expense-management' },
      { icon: <FiCreditCard />, title: 'Fee Payment (Employee)', description: 'Employee payments', route: '/features/expense-management' },
      { icon: <FiCreditCard />, title: 'Plans', description: 'Subscription plans', route: '/features/plan-management' },
      { icon: <FiFileText />, title: 'Invoices', description: 'Invoice management', route: '/features/expense-management' },
      { icon: <FiFileText />, title: 'Payment Reports', description: 'Payment analytics', route: '/features/analytics-management' },
      { icon: <FiBarChart2 />, title: 'Revenue Analytics', description: 'Revenue insights', route: '/features/analytics-management' },
      { icon: <FiCreditCard />, title: 'Subscription Management', description: 'Manage subscriptions', route: '/features/plan-management' },
      { icon: <FiFileText />, title: 'Tax & Compliance (Billing)', description: 'Billing compliance', route: '/features/expense-management' },
      { icon: <FiCreditCard />, title: 'Refunds & Adjustments', description: 'Payment adjustments', route: '/features/expense-management' },
      { icon: <FiZap />, title: 'AI Sales Insights', description: 'AI sales analytics', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'marketing-analytics',
    name: 'Marketing & Analytics',
    icon: <FiBarChart2 />,
    modules: [
      { icon: <FiBarChart2 />, title: 'Analytics & Reporting', description: 'Business analytics', route: '/features/analytics-management' },
      { icon: <FiPieChart />, title: 'Analytics Dashboard', description: 'Analytics overview', route: '/features/analytics-management' },
      { icon: <FiFileText />, title: 'Monthly Reports', description: 'Monthly summaries', route: '/features/monthly-reports-management' },
      { icon: <FiTrendingUp />, title: 'Performance Metrics', description: 'Performance tracking', route: '/features/analytics-management' },
      { icon: <FiShoppingCart />, title: 'Lead & Sales Analytics', description: 'Sales analytics', route: '/features/analytics-management' },
      { icon: <FiFileText />, title: 'Custom Reports', description: 'Custom report builder', route: '/features/analytics-management' },
      { icon: <FiZap />, title: 'Automation Workflows (n8n)', description: 'Workflow automation', route: '/features/analytics-management' },
      { icon: <FiActivity />, title: 'Real-Time Event Tracking', description: 'Event monitoring', route: '/features/analytics-management' },
      { icon: <FiCode />, title: 'Data Pipelines & ETL', description: 'Data processing', route: '/features/analytics-management' },
      { icon: <FiZap />, title: 'Predictive Analytics (AI)', description: 'AI predictions', route: '/features/analytics-management' },
      { icon: <FiBarChart2 />, title: 'Attribution & Funnel Analysis', description: 'Funnel analytics', route: '/features/analytics-management' },
      { icon: <FiPieChart />, title: 'Embedded BI Dashboards', description: 'BI dashboards', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'edutech-learning',
    name: 'Edutech & Learning',
    icon: <FiBookOpen />,
    modules: [
      { icon: <FiBookOpen />, title: 'Learning & Development', description: 'L&D programs', route: '/features/assessment-management' },
      { icon: <FiTrendingUp />, title: 'Skill Development', description: 'Skill building', route: '/features/assessment-management' },
      { icon: <FiCheckSquare />, title: 'Assessments', description: 'Assessment management', route: '/features/assessment-management' },
      { icon: <FiActivity />, title: 'WorklogzTube', description: 'Learning videos', route: '/features/assessment-management' },
      { icon: <FiTarget />, title: 'Learning Paths', description: 'Learning journeys', route: '/features/assessment-management' },
      { icon: <FiFile />, title: 'Certifications', description: 'Certificate management', route: '/features/assessment-management' },
      { icon: <FiZap />, title: 'AI Learning Copilot', description: 'AI learning assistant', route: '/features/assessment-management' },
      { icon: <FiZap />, title: 'Personalized Learning Engine', description: 'Adaptive learning', route: '/features/assessment-management' },
      { icon: <FiMessageCircle />, title: 'Live Classes & Webinars', description: 'Live sessions', route: '/features/assessment-management' },
      { icon: <FiClipboard />, title: 'Assignments & Projects', description: 'Learning projects', route: '/features/assessment-management' },
      { icon: <FiBarChart2 />, title: 'Progress & Skill Analytics', description: 'Learning analytics', route: '/features/analytics-management' },
      { icon: <FiCode />, title: 'Content Authoring (No-Code)', description: 'Content creation', route: '/features/assessment-management' },
    ],
  },
  {
    id: 'goals-performance',
    name: 'Goals & Performance',
    icon: <FiTarget />,
    modules: [
      { icon: <FiTarget />, title: 'Goals & Achievements', description: 'Goal tracking', route: '/features/performance-management' },
      { icon: <FiBarChart2 />, title: 'Performance Dashboard', description: 'Performance overview', route: '/features/analytics-management' },
      { icon: <FiTrendingUp />, title: 'KPI Tracking', description: 'KPI monitoring', route: '/features/performance-management' },
      { icon: <FiMessageCircle />, title: 'Feedback & Reviews', description: 'Performance reviews', route: '/features/performance-management' },
      { icon: <FiTarget />, title: 'OKR Management', description: 'OKR tracking', route: '/features/performance-management' },
      { icon: <FiUsers />, title: '360° Feedback', description: '360 feedback system', route: '/features/performance-management' },
      { icon: <FiCalendar />, title: 'Review Cycles', description: 'Review management', route: '/features/performance-management' },
      { icon: <FiTrendingUp />, title: 'Skill Gap Analysis', description: 'Skill assessment', route: '/features/performance-management' },
      { icon: <FiZap />, title: 'AI Performance Insights', description: 'AI performance analytics', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'collaboration-communication',
    name: 'Collaboration & Communication',
    icon: <FiMessageCircle />,
    modules: [
      { icon: <FiUsers />, title: 'Team Collaboration', description: 'Team collaboration tools', route: '/features/team-management' },
      { icon: <FiMessageCircle />, title: 'Community', description: 'Community hub', route: '/features/community-management' },
      { icon: <FiUsers />, title: 'People Directory', description: 'Employee directory', route: '/features/people-management' },
      { icon: <FiUsers />, title: 'Team Management (Collaboration)', description: 'Collaborative teams', route: '/features/team-management' },
      { icon: <FiBell />, title: 'Announcements', description: 'Company announcements', route: '/features/community-management' },
      { icon: <FiMessageCircle />, title: 'Internal Chat', description: 'Internal messaging', route: '/features/community-management' },
      { icon: <FiUsers />, title: 'Channels & Groups', description: 'Communication channels', route: '/features/community-management' },
      { icon: <FiCheckSquare />, title: 'Company Polls & Surveys', description: 'Surveys and polls', route: '/features/community-management' },
      { icon: <FiBookOpen />, title: 'Knowledge Base / Wiki', description: 'Knowledge repository', route: '/features/document-center-management' },
      { icon: <FiFolder />, title: 'File Sharing', description: 'File sharing system', route: '/features/document-center-management' },
      { icon: <FiBell />, title: 'Mentions & Notifications', description: 'Notification system', route: '/features/community-management' },
      { icon: <FiHelpCircle />, title: 'Helpdesk', description: 'Support ticketing', route: '/features/helpdesk' },
      { icon: <FiBriefcase />, title: 'My Workspace', description: 'Personal workspace', route: '/features/workspace-management' },
      { icon: <FiCalendar />, title: 'Meeting Scheduler', description: 'Schedule meetings', route: '/features/workspace-management' },
      { icon: <FiCalendar />, title: 'Company Calendar', description: 'Company calendar', route: '/features/workspace-management' },
    ],
  },
  {
    id: 'performance-management',
    name: 'Performance Management',
    icon: <FiTrendingUp />,
    modules: [
      { icon: <FiTrendingUp />, title: 'Performance Tracking', description: 'Track performance', route: '/features/performance-management' },
      { icon: <FiBarChart2 />, title: 'Performance Dashboard (PM)', description: 'PM dashboard', route: '/features/analytics-management' },
      { icon: <FiTarget />, title: 'Goals & Achievements (PM)', description: 'PM goals', route: '/features/performance-management' },
      { icon: <FiCalendar />, title: 'Calendar View (PM)', description: 'PM calendar', route: '/features/performance-management' },
      { icon: <FiCalendar />, title: 'Review Cycles (PM)', description: 'PM reviews', route: '/features/performance-management' },
      { icon: <FiFileText />, title: 'Appraisal Reports', description: 'Appraisal documents', route: '/features/performance-management' },
      { icon: <FiTrendingUp />, title: 'KPI & OKR Tracking', description: 'KPI/OKR system', route: '/features/performance-management' },
      { icon: <FiUsers />, title: '360° Feedback (PM)', description: 'PM feedback', route: '/features/performance-management' },
      { icon: <FiTrendingUp />, title: 'Skill Gap Analysis (PM)', description: 'PM skill analysis', route: '/features/performance-management' },
      { icon: <FiTarget />, title: 'Promotion & Growth Plans', description: 'Career planning', route: '/features/performance-management' },
      { icon: <FiZap />, title: 'AI Performance Insights (PM)', description: 'AI PM analytics', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'security-it',
    name: 'Security & IT Management',
    icon: <FiShield />,
    modules: [
      { icon: <FiShield />, title: 'Role-Based Access Control', description: 'RBAC system', route: '/features/admin-access-control-management' },
      { icon: <FiActivity />, title: 'Login Activity', description: 'Login tracking', route: '/features/admin-access-control-management' },
      { icon: <FiSettings />, title: 'Device Management', description: 'Device tracking', route: '/features/admin-access-control-management' },
      { icon: <FiFileText />, title: 'Audit Logs (Security)', description: 'Security logs', route: '/features/admin-access-control-management' },
      { icon: <FiFolder />, title: 'Data Backup', description: 'Backup management', route: '/features/company-settings-management' },
      { icon: <FiShield />, title: 'Single Sign-On (SSO)', description: 'SSO integration', route: '/features/company-settings-management' },
      { icon: <FiShield />, title: 'IP & Geo Restrictions', description: 'Access restrictions', route: '/features/admin-access-control-management' },
      { icon: <FiFileText />, title: 'Security Policies', description: 'Policy management', route: '/features/company-settings-management' },
      { icon: <FiHelpCircle />, title: 'Incident Management', description: 'Security incidents', route: '/features/helpdesk' },
      { icon: <FiFileText />, title: 'Compliance Reports', description: 'Compliance tracking', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    icon: <FiZap />,
    modules: [
      { icon: <FiZap />, title: 'AI Copilot', description: 'AI assistant', route: '/features/ai-copilot' },
      { icon: <FiCheckSquare />, title: 'AI Task Suggestions', description: 'Smart task suggestions', route: '/features/task-manager' },
      { icon: <FiClock />, title: 'Smart Attendance', description: 'AI attendance', route: '/features/attendance-management' },
      { icon: <FiActivity />, title: 'Auto Worklogs', description: 'Automated worklogs', route: '/features/company-overall-worklogz-management' },
      { icon: <FiFileText />, title: 'AI Reports', description: 'AI-generated reports', route: '/features/analytics-management' },
      { icon: <FiMessageCircle />, title: 'Chatbot Assistant', description: 'AI chatbot', route: '/features/ai-copilot' },
      { icon: <FiZap />, title: 'Workflow Automation (n8n)', description: 'Process automation', route: '/features/analytics-management' },
      { icon: <FiBarChart2 />, title: 'Predictive Analytics (AI)', description: 'AI predictions', route: '/features/analytics-management' },
      { icon: <FiTrendingUp />, title: 'AI Performance Insights', description: 'AI performance', route: '/features/analytics-management' },
      { icon: <FiUsers />, title: 'AI Hiring & Screening', description: 'AI recruitment', route: '/features/user-management' },
      { icon: <FiCode />, title: 'RPA Bots (No-Code)', description: 'RPA automation', route: '/features/analytics-management' },
      { icon: <FiBell />, title: 'AI Alerts & Triggers', description: 'Smart alerts', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'development-platform',
    name: 'Development Platform',
    icon: <FiCode />,
    modules: [
      { icon: <FiCode />, title: 'API Management', description: 'API administration', route: '/features/company-settings-management' },
      { icon: <FiCode />, title: 'Custom Modules', description: 'Module customization', route: '/features/company-settings-management' },
      { icon: <FiCode />, title: 'Integrations', description: 'Third-party integrations', route: '/features/application-integration-management' },
      { icon: <FiCode />, title: 'Webhooks', description: 'Webhook management', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Developer Settings', description: 'Dev configuration', route: '/features/company-settings-management' },
      { icon: <FiCode />, title: 'Low-Code Builder', description: 'Visual builder', route: '/features/company-settings-management' },
      { icon: <FiZap />, title: 'Workflow Builder', description: 'Workflow designer', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Custom Objects & Fields', description: 'Customization', route: '/features/company-settings-management' },
      { icon: <FiFileText />, title: 'Form Builder', description: 'Form creation', route: '/features/company-settings-management' },
      { icon: <FiGrid />, title: 'App Marketplace', description: 'App store', route: '/features/application-integration-management' },
      { icon: <FiSettings />, title: 'Environment Management', description: 'Environment config', route: '/features/company-settings-management' },
    ],
  },
  {
    id: 'core-navigation',
    name: 'Core Navigation & Platform',
    icon: <FiSettings />,
    modules: [
      { icon: <FiBell />, title: 'Notifications', description: 'Notification center', route: '/features/community-management' },
      { icon: <FiUser />, title: 'Profile Settings', description: 'User profile', route: '/features/user-profile-management' },
      { icon: <FiSettings />, title: 'System Settings', description: 'System configuration', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Company Settings', description: 'Company config', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Theme & Branding', description: 'Customization', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Custom Fields', description: 'Field customization', route: '/features/company-settings-management' },
      { icon: <FiZap />, title: 'Workflow Rules', description: 'Business rules', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Global Settings', description: 'Global config', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Feature Toggles', description: 'Feature flags', route: '/features/company-settings-management' },
      { icon: <FiFile />, title: 'Data Import / Export', description: 'Data management', route: '/features/company-settings-management' },
      { icon: <FiSettings />, title: 'Localization & Timezone', description: 'Localization', route: '/features/company-settings-management' },
      { icon: <FiActivity />, title: 'System Status', description: 'System health', route: '/features/company-settings-management' },
    ],
  },
];

// Worklogz Products by Category (Monday.com style)
const WORKLOGZ_PRODUCTS = [
  {
    id: 'hrms',
    name: 'HRMS',
    icon: <FiUsers />,
    color: '#6366f1',
    products: [
      { icon: <FiClock />, title: 'Attendance', route: '/features/attendance-management' },
      { icon: <FiCalendar />, title: 'Leave Management', route: '/features/leave-management' },
      { icon: <FiDollarSign />, title: 'Payroll', route: '/features/payroll-management' },
      { icon: <FiUser />, title: 'Employee Management', route: '/features/user-management' },
      { icon: <FiTrendingUp />, title: 'Performance', route: '/features/performance-management' },
      { icon: <FiFile />, title: 'Documents', route: '/features/document-management' },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: <FiBriefcase />,
    color: '#10b981',
    products: [
      { icon: <FiBriefcase />, title: 'Project Workspace', route: '/features/project-workspace-management' },
      { icon: <FiCheckSquare />, title: 'Task Manager', route: '/features/task-manager' },
      { icon: <FiActivity />, title: 'Worklogz', route: '/features/company-overall-worklogz-management' },
      { icon: <FiUsers />, title: 'Team Management', route: '/features/team-management' },
      { icon: <FiBarChart2 />, title: 'Project Analytics', route: '/features/analytics-management' },
      { icon: <FiClock />, title: 'Timesheets', route: '/features/task-manager' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: <FiShoppingCart />,
    color: '#3b82f6',
    products: [
      { icon: <FiShoppingCart />, title: 'CRM', route: '/features/customized-input-crm-management' },
      { icon: <FiTarget />, title: 'Leads', route: '/features/customized-input-crm-management' },
      { icon: <FiTrendingUp />, title: 'Pipeline', route: '/features/customized-input-crm-management' },
      { icon: <FiCreditCard />, title: 'Payments', route: '/features/expense-management' },
      { icon: <FiBarChart2 />, title: 'Sales Analytics', route: '/features/analytics-management' },
      { icon: <FiFileText />, title: 'Invoices', route: '/features/expense-management' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <FiBarChart2 />,
    color: '#f59e0b',
    products: [
      { icon: <FiBarChart2 />, title: 'Analytics', route: '/features/analytics-management' },
      { icon: <FiPieChart />, title: 'Reports', route: '/features/monthly-reports-management' },
      { icon: <FiTrendingUp />, title: 'Campaigns', route: '/features/analytics-management' },
      { icon: <FiTarget />, title: 'Lead Tracking', route: '/features/customized-input-crm-management' },
      { icon: <FiActivity />, title: 'Event Tracking', route: '/features/analytics-management' },
      { icon: <FiZap />, title: 'Automation', route: '/features/analytics-management' },
    ],
  },
  {
    id: 'it-ops',
    name: 'IT & Ops',
    icon: <FiSettings />,
    color: '#ef4444',
    products: [
      { icon: <FiHelpCircle />, title: 'Helpdesk', route: '/features/helpdesk' },
      { icon: <FiShield />, title: 'Security', route: '/features/admin-access-control-management' },
      { icon: <FiCode />, title: 'Integrations', route: '/features/application-integration-management' },
      { icon: <FiSettings />, title: 'System Settings', route: '/features/company-settings-management' },
      { icon: <FiActivity />, title: 'Monitoring', route: '/features/analytics-management' },
      { icon: <FiFile />, title: 'Backup', route: '/features/company-settings-management' },
    ],
  },
  {
    id: 'product-engineering',
    name: 'Product & Engineering',
    icon: <FiCode />,
    color: '#8b5cf6',
    products: [
      { icon: <FiCode />, title: 'API Management', route: '/features/company-settings-management' },
      { icon: <FiCode />, title: 'Custom Modules', route: '/features/company-settings-management' },
      { icon: <FiZap />, title: 'Workflow Builder', route: '/features/company-settings-management' },
      { icon: <FiFileText />, title: 'Form Builder', route: '/features/company-settings-management' },
      { icon: <FiGrid />, title: 'App Marketplace', route: '/features/application-integration-management' },
      { icon: <FiSettings />, title: 'Developer Tools', route: '/features/company-settings-management' },
    ],
  },
  {
    id: 'leadership',
    name: 'Leadership',
    icon: <FiTrendingUp />,
    color: '#ec4899',
    products: [
      { icon: <FiBarChart2 />, title: 'Dashboard', route: '/features/admin-dashboard' },
      { icon: <FiPieChart />, title: 'Analytics', route: '/features/analytics-management' },
      { icon: <FiFileText />, title: 'Reports', route: '/features/monthly-reports-management' },
      { icon: <FiTrendingUp />, title: 'KPIs', route: '/features/performance-management' },
      { icon: <FiUsers />, title: 'Team Insights', route: '/features/analytics-management' },
      { icon: <FiTarget />, title: 'Goals', route: '/features/performance-management' },
    ],
  },
];

const LandingHeader = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  
  // Static module categories
  const allModuleCategories = STATIC_FEATURE_CATEGORIES;
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllModules, setShowAllModules] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('home-core');

  // Icon colors array for variety
  const iconColors = [
    { bg: '#E3F2FD', color: '#1976D2' }, // Light blue
    { bg: '#E8F5E9', color: '#388E3C' }, // Light green
    { bg: '#FCE4EC', color: '#C2185B' }, // Pink
    { bg: '#FFF3E0', color: '#F57C00' }, // Orange
    { bg: '#F3E5F5', color: '#7B1FA2' }, // Light purple
    { bg: '#EFEBE9', color: '#5D4037' }, // Brown/beige
    { bg: '#FFF9C4', color: '#F9A825' }, // Yellow
    { bg: '#E1F5FE', color: '#0277BD' }, // Light blue 2
  ];

  const getIconColor = (index) => {
    return iconColors[index % iconColors.length];
  };

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMenuEnter = (menu) => {
    clearCloseTimeout();
    if (menu === 'features') setFeaturesOpen(true);
    if (menu === 'solutions') setSolutionsOpen(true);
    if (menu === 'resources') setResourcesOpen(true);
    if (menu === 'products') setProductsMenuOpen(true);
  };

  const handleMenuLeave = (menu) => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      if (menu === 'features') setFeaturesOpen(false);
      if (menu === 'solutions') setSolutionsOpen(false);
      if (menu === 'resources') setResourcesOpen(false);
      if (menu === 'products') setProductsMenuOpen(false);
    }, 150);
  };


  // Filter modules based on search query
  const filterModules = (modules, query) => {
    if (!query) return modules;
    const lowerQuery = query.toLowerCase();
    return modules.filter(module => 
      module.title.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery)
    );
  };

  // Get all modules from all categories
  const getAllModules = () => {
    return allModuleCategories.flatMap(cat => cat.modules || []);
  };

  // Close dropdowns when route changes
  useEffect(() => {
    setFeaturesOpen(false);
    setSolutionsOpen(false);
    setResourcesOpen(false);
    setProductsMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!featuresOpen) {
      setSearchQuery('');
      setShowAllModules(false);
    }
  }, [featuresOpen]);

  return (
    <>
      {featuresOpen && (
        <div 
          className="dropdown-backdrop"
          onClick={() => setFeaturesOpen(false)}
          onMouseEnter={() => setFeaturesOpen(false)}
        />
      )}
      <header className="landing-header">
        <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={worklogzLogo} alt="Worklogz logo" className="logo-image" />
            <span className="logo-text">Worklogz</span>
          </Link>
        </div>

        <nav className="header-nav desktop-nav">
          <div 
            className="nav-item dropdown features-dropdown-wrapper"
            onMouseEnter={() => handleMenuEnter('features')}
            onMouseLeave={() => handleMenuLeave('features')}
          >
            <span className="nav-link">
              Features <FiChevronDown className="dropdown-icon" />
            </span>
            {featuresOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div 
                  className="dropdown-menu features-dropdown zoho-style-dropdown" 
                  onMouseEnter={() => handleMenuEnter('features')} 
                  onMouseLeave={() => handleMenuLeave('features')}
                >
                  <div className="zoho-dropdown-container">
                    {/* Search Bar */}
                    <div className="zoho-search-container">
                      <div className="zoho-search-wrapper">
                        <FiSearch className="zoho-search-icon" />
                        <input
                          type="text"
                          placeholder="I'm looking for..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="zoho-search-input"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="zoho-search-clear"
                            aria-label="Clear search"
                          >
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* All Modules Section - Unified */}
                    <div className="zoho-module-section">
                      <div className="zoho-section-header">
                        <div className="zoho-section-header-left">
                          <FiGrid className="zoho-section-header-icon" />
                          <h3 className="zoho-section-title">All Modules</h3>
                        </div>
                        <button
                          onClick={() => setShowAllModules(!showAllModules)}
                          className="zoho-show-all-btn"
                        >
                          {showAllModules ? 'Show by Category' : 'Show All Modules'}
                        </button>
                      </div>
                      {showAllModules ? (
                        <div className="zoho-content-panel">
                          <div className="features-grid-container">
                            {filterModules(getAllModules(), searchQuery).map((feature, index) => {
                              const iconStyle = getIconColor(index);
                              return (
                                <Link 
                                  key={index}
                                  to={feature.route} 
                                  className={`feature-card ${location.pathname === feature.route ? 'active' : ''}`}
                                  onClick={() => setFeaturesOpen(false)}
                                >
                                  <div className="feature-card-icon" style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}>
                                    {feature.icon}
                                  </div>
                                  <div className="feature-card-content">
                                    <h4 className="feature-card-title">{feature.title}</h4>
                                    <p className="feature-card-description">{feature.description}</p>
                                    <span className="feature-card-cta">View module →</span>
                                  </div>
                                </Link>
                              );
                            })}
                            {filterModules(getAllModules(), searchQuery).length === 0 && (
                              <div style={{ padding: '20px', color: '#6b7280', gridColumn: '1 / -1' }}>
                                {searchQuery ? `No modules found matching "${searchQuery}"` : 'No modules available'}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="zoho-sidebar-layout">
                          <div className="zoho-sidebar">
                            {allModuleCategories.map((category) => (
                              <button
                                key={category.id}
                                className={`zoho-sidebar-item ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                              >
                                <span className="zoho-sidebar-icon">{category.icon}</span>
                                <span className="zoho-sidebar-label">{category.name}</span>
                              </button>
                            ))}
                          </div>
                          <div className="zoho-content-panel">
                            <div className="features-grid-container">
                              {filterModules(
                                allModuleCategories.find(cat => cat.id === selectedCategory)?.modules || [],
                                searchQuery
                              ).map((feature, index) => {
                                const iconStyle = getIconColor(index);
                                return (
                                  <Link 
                                    key={index}
                                    to={feature.route} 
                                    className={`feature-card ${location.pathname === feature.route ? 'active' : ''}`}
                                    onClick={() => setFeaturesOpen(false)}
                                  >
                                    <div className="feature-card-icon" style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}>
                                      {feature.icon}
                                    </div>
                                    <div className="feature-card-content">
                                      <h4 className="feature-card-title">{feature.title}</h4>
                                      <p className="feature-card-description">{feature.description}</p>
                                      <span className="feature-card-cta">View module →</span>
                                    </div>
                                  </Link>
                                );
                              })}
                              {filterModules(
                                allModuleCategories.find(cat => cat.id === selectedCategory)?.modules || [],
                                searchQuery
                              ).length === 0 && (
                                <div style={{ padding: '20px', color: '#6b7280', gridColumn: '1 / -1' }}>
                                  {searchQuery ? `No modules found matching "${searchQuery}"` : 'No modules available'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMenuEnter('solutions')}
            onMouseLeave={() => handleMenuLeave('solutions')}
          >
            <span className="nav-link">
              Solutions <FiChevronDown className="dropdown-icon" />
            </span>
            {solutionsOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div 
                  className="dropdown-menu"
                  onMouseEnter={() => handleMenuEnter('solutions')}
                  onMouseLeave={() => handleMenuLeave('solutions')}
                >
                  <Link to="/for-business">For Business</Link>
                  <Link to="/for-enterprise">For Enterprise</Link>
                  <Link to="/for-education">For Education</Link>
                  <Link to="/for-individuals">For Individuals</Link>
                </div>
              </>
            )}
          </div>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/docs" className="nav-link">Documentation</Link>

          <div 
            className="nav-item dropdown"
            onMouseEnter={() => handleMenuEnter('resources')}
            onMouseLeave={() => handleMenuLeave('resources')}
          >
            <span className="nav-link">
              Resources <FiChevronDown className="dropdown-icon" />
            </span>
            {resourcesOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div 
                  className="dropdown-menu"
                  onMouseEnter={() => handleMenuEnter('resources')}
                  onMouseLeave={() => handleMenuLeave('resources')}
                >
                  <Link to="/product-overview">Product Overview</Link>
                  <Link to="/product-configurator">Product PDF Configurator</Link>
    
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="header-right desktop-nav">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
          
          {/* 9-Dot Grid Menu Button */}
          <div 
            className="products-menu-wrapper"
            onMouseEnter={() => handleMenuEnter('products')}
            onMouseLeave={() => handleMenuLeave('products')}
          >
            <button 
              className="products-menu-toggle"
              onClick={() => setProductsMenuOpen(!productsMenuOpen)}
              aria-label="Products menu"
            >
              <div className="grid-icon">
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
                <div className="grid-dot"></div>
              </div>
            </button>
            
            {productsMenuOpen && (
              <>
                <div className="dropdown-bridge"></div>
                <div 
                  className="products-dropdown monday-style-dropdown"
                  onMouseEnter={() => handleMenuEnter('products')}
                  onMouseLeave={() => handleMenuLeave('products')}
                >
                  <div className="products-dropdown-content">
                    <div className="products-section">
                      <h3 className="products-section-title">Explore Worklogz Products</h3>
                      <div className="products-grid">
                        {WORKLOGZ_PRODUCTS.map((category) => (
                          <div key={category.id} className="product-category">
                            <div className="product-category-header">
                              <div 
                                className="product-category-icon" 
                                style={{ backgroundColor: `${category.color}15`, color: category.color }}
                              >
                                {category.icon}
                              </div>
                              <h4 className="product-category-name">{category.name}</h4>
                            </div>
                            <div className="product-cards">
                              {category.products.map((product, index) => (
                                <Link
                                  key={index}
                                  to={product.route}
                                  className="product-card"
                                  onClick={() => setProductsMenuOpen(false)}
                                >
                                  <div 
                                    className="product-card-icon"
                                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                                  >
                                    {product.icon}
                                  </div>
                                  <span className="product-card-title">{product.title}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-features-section">
            <h3 className="mobile-section-title">
              <FiUser className="mobile-icon" />
              User Modules
            </h3>
            <Link to="/docs/detailed-features#user-profile" onClick={() => setMobileMenuOpen(false)}>User Profile Management</Link>
            <Link to="/docs/detailed-features#attendance" onClick={() => setMobileMenuOpen(false)}>Attendance Management</Link>
            <Link to="/docs/detailed-features#community" onClick={() => setMobileMenuOpen(false)}>Community Management</Link>
            <Link to="/docs/detailed-features#task-manager" onClick={() => setMobileMenuOpen(false)}>Task Manager</Link>
            <Link to="/docs/detailed-features#salary" onClick={() => setMobileMenuOpen(false)}>Salary Management</Link>
            <Link to="/docs/detailed-features#leave" onClick={() => setMobileMenuOpen(false)}>Leave Management</Link>
            <Link to="/docs/detailed-features#performance" onClick={() => setMobileMenuOpen(false)}>Performance Management</Link>
            <Link to="/docs/detailed-features#workspace" onClick={() => setMobileMenuOpen(false)}>Workspace Management</Link>
            <Link to="/docs/detailed-features#applications" onClick={() => setMobileMenuOpen(false)}>Application Integration</Link>
            <Link to="/docs/detailed-features#people" onClick={() => setMobileMenuOpen(false)}>People Management</Link>
            <Link to="/docs/detailed-features#team" onClick={() => setMobileMenuOpen(false)}>Team Management</Link>
            <Link to="/docs/detailed-features#documents" onClick={() => setMobileMenuOpen(false)}>Document Center Management</Link>
            <Link to="/docs/detailed-features#helpdesk" onClick={() => setMobileMenuOpen(false)}>Helpdesk</Link>
            <Link to="/docs/detailed-features#team-tasks" onClick={() => setMobileMenuOpen(false)}>Team Task Management</Link>
            <Link to="/docs/detailed-features#notifications" onClick={() => setMobileMenuOpen(false)}>Notification Management</Link>
            <Link to="/docs/detailed-features#mail" onClick={() => setMobileMenuOpen(false)}>Mail Integration</Link>
            <Link to="/docs/detailed-features#ai-copilot" onClick={() => setMobileMenuOpen(false)}>AI Copilot</Link>
          </div>
          
          <div className="mobile-features-section">
            <h3 className="mobile-section-title">
              <FiShield className="mobile-icon" />
              Admin Modules
            </h3>
            <Link to="/features/admin-dashboard" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
            <Link to="/features/analytics-management" onClick={() => setMobileMenuOpen(false)}>Analytics Management</Link>
            <Link to="/features/monthly-reports-management" onClick={() => setMobileMenuOpen(false)}>Monthly Reports Management</Link>
            <Link to="/features/user-management" onClick={() => setMobileMenuOpen(false)}>User Management</Link>
            <Link to="/features/user-cards" onClick={() => setMobileMenuOpen(false)}>User Cards</Link>
            <Link to="/features/employee-schedules" onClick={() => setMobileMenuOpen(false)}>Employee Schedules</Link>
            <Link to="/features/user-pending-approvals" onClick={() => setMobileMenuOpen(false)}>User Pending Approvals</Link>
            <Link to="/features/admin-team-management" onClick={() => setMobileMenuOpen(false)}>Team Management</Link>
            <Link to="/features/admin-task-management" onClick={() => setMobileMenuOpen(false)}>Admin Task Management</Link>
            <Link to="/features/helpdesk-solver" onClick={() => setMobileMenuOpen(false)}>Helpdesk Solver</Link>
            <Link to="/features/company-overall-worklogz-management" onClick={() => setMobileMenuOpen(false)}>Company Overall Worklogz Management</Link>
            <Link to="/features/company-department-management" onClick={() => setMobileMenuOpen(false)}>Company Department Management</Link>
            <Link to="/features/project-workspace-management" onClick={() => setMobileMenuOpen(false)}>Project Workspace Management</Link>
            <Link to="/features/customized-input-crm-management" onClick={() => setMobileMenuOpen(false)}>Customized Input / CRM Management</Link>
            <Link to="/features/hr-management" onClick={() => setMobileMenuOpen(false)}>HR Management</Link>
            <Link to="/features/admin-leave-management" onClick={() => setMobileMenuOpen(false)}>Leave Management</Link>
            <Link to="/features/payroll-management" onClick={() => setMobileMenuOpen(false)}>Payroll Management</Link>
            <Link to="/features/plan-management" onClick={() => setMobileMenuOpen(false)}>Plan Management</Link>
            <Link to="/features/admin-access-control-management" onClick={() => setMobileMenuOpen(false)}>Admin Access Control Management</Link>
            <Link to="/features/document-management" onClick={() => setMobileMenuOpen(false)}>Document Management</Link>
            <Link to="/features/company-settings-management" onClick={() => setMobileMenuOpen(false)}>Company Settings Management</Link>
            <Link to="/features/expense-management" onClick={() => setMobileMenuOpen(false)}>Expense Management</Link>
            <Link to="/features/admin-performance-management" onClick={() => setMobileMenuOpen(false)}>Performance Management</Link>
          </div>

          <Link to="/for-business" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
          <Link to="/docs/industries" onClick={() => setMobileMenuOpen(false)}>Industries</Link>
          <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>Documentation</Link>
          <Link to="/product-overview" onClick={() => setMobileMenuOpen(false)}>Product Overview</Link>
          <Link to="/product-configurator" onClick={() => setMobileMenuOpen(false)}>Product PDF Configurator</Link>
          <Link to="/docs/faq" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary">Get Started</Link>
        </div>
      )}
      </header>
    </>
  );
};

export default LandingHeader;

