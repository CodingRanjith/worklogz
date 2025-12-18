import React, { useState } from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import './StaticPage.css';

// Sidebar modules & sub-modules based on PRODUCT_OVERVIEW.md (lines 46–274)
const MODULE_GROUPS = [
  {
    key: 'home-core',
    label: 'Home & Core',
    items: ['Home', 'Dashboard', 'Attendance'],
  },
  {
    key: 'hr-admin',
    label: 'HR & Administration',
    items: [
      'User & Employee Management',
      'People',
      'Team Management',
      'Applications',
      'Roles & Permissions',
      'Onboarding & Offboarding',
      'Employee Profiles',
      'HR Requests & Approvals',
      'Org Chart',
      'HR Analytics',
    ],
  },
  {
    key: 'time-task',
    label: 'Time & Task Tracking',
    items: [
      'Task Manager',
      'Admin Task Manager',
      'Worklog Tracking',
      'Calendar View',
      'Timesheets',
      'Productivity Reports',
      'Shift Management',
      'Overtime Tracking',
      'AI Time Insights',
    ],
  },
  {
    key: 'leave',
    label: 'Leave Management',
    items: [
      'Apply Leave',
      'Leave Records',
      'Late Reports',
      'Holiday List',
      'Leave Policies',
      'Leave Approvals',
      'Comp-Off Management',
      'Shift-Based Leaves',
      'Leave Analytics',
      'AI Leave Insights',
    ],
  },
  {
    key: 'finance',
    label: 'Finance & Compensation',
    items: [
      'Salary',
      'Pay History',
      'Payslip Generator',
      'Daily Salary Credit',
      'Expense Claims',
      'Payroll Processing',
      'Bonuses & Incentives',
      'Tax & Compliance',
      'Reimbursements',
      'Finance Analytics',
    ],
  },
  {
    key: 'documents',
    label: 'Documents & Administration',
    items: [
      'Document Center',
      'Offer Letters',
      'Experience Letters',
      'Relieving Letters',
      'Upload Documents',
      'Document Templates',
      'E-Sign & Approvals',
      'Version Control',
      'Access & Permissions',
      'Audit Logs',
    ],
  },
  {
    key: 'projects',
    label: 'Project Management',
    items: [
      'Project Workspace / Projects Workspace',
      'My Workspace',
      'Company Worklogz',
      'Company Departments',
      'Project Reports',
      'Task Manager (Project)',
      'Admin Task Manager (Project)',
      'Sub Tasks',
      'Milestones',
      'Productivity Reports (Project)',
      'Sprint & Agile Board',
      'Resource Allocation',
      'Risk & Issue Tracking',
      'Project Timeline (Gantt)',
      'Project Automation (AI)',
    ],
  },
  {
    key: 'sales-crm',
    label: 'Sales & CRM',
    items: [
      'Customer Relationship Management',
      'CRM Dashboard',
      'Course CRM',
      'Internship CRM',
      'IT Projects CRM',
      'Custom CRM',
      'Leads Management',
      'Deals & Pipeline',
      'Contacts & Accounts',
      'Follow-ups & Activities',
      'CRM Automation (n8n)',
    ],
  },
  {
    key: 'payment-billing',
    label: 'Payment & Billing (Sales)',
    items: [
      'Fee Payments (Admin)',
      'Fee Payment (Employee)',
      'Plans',
      'Invoices',
      'Payment Reports',
      'Revenue Analytics',
      'Subscription Management',
      'Tax & Compliance (Billing)',
      'Refunds & Adjustments',
      'AI Sales Insights',
    ],
  },
  {
    key: 'marketing',
    label: 'Marketing & Analytics',
    items: [
      'Analytics & Reporting',
      'Analytics Dashboard',
      'Monthly Reports',
      'Performance Metrics',
      'Lead & Sales Analytics',
      'Custom Reports',
      'Automation Workflows (n8n)',
      'Real-Time Event Tracking',
      'Data Pipelines & ETL',
      'Predictive Analytics (AI)',
      'Attribution & Funnel Analysis',
      'Embedded BI Dashboards',
    ],
  },
  {
    key: 'edutech',
    label: 'Edutech & Learning',
    items: [
      'Learning & Development',
      'Skill Development',
      'Assessments',
      'WorklogzTube',
      'Learning Paths',
      'Certifications',
      'AI Learning Copilot',
      'Personalized Learning Engine',
      'Live Classes & Webinars',
      'Assignments & Projects',
      'Progress & Skill Analytics',
      'Content Authoring (No-Code)',
    ],
  },
  {
    key: 'goals-performance',
    label: 'Goals & Performance',
    items: [
      'Goals & Achievements',
      'Performance Dashboard',
      'KPI Tracking',
      'Feedback & Reviews',
      'OKR Management',
      '360° Feedback',
      'Review Cycles',
      'Skill Gap Analysis',
      'AI Performance Insights',
    ],
  },
  {
    key: 'collaboration',
    label: 'Collaboration, Communication & Support',
    items: [
      'Team Collaboration',
      'Community',
      'People Directory',
      'Team Management (Collaboration)',
      'Announcements',
      'Internal Chat',
      'Channels & Groups',
      'Company Polls & Surveys',
      'Knowledge Base / Wiki',
      'File Sharing',
      'Mentions & Notifications',
      'Helpdesk',
      'My Workspace',
      'Meeting Scheduler',
      'Company Calendar',
    ],
  },
  {
    key: 'performance-mgmt',
    label: 'Performance Management',
    items: [
      'Performance Tracking',
      'Performance Dashboard (PM)',
      'Goals & Achievements (PM)',
      'Calendar View (PM)',
      'Review Cycles (PM)',
      'Appraisal Reports',
      'KPI & OKR Tracking',
      '360° Feedback (PM)',
      'Skill Gap Analysis (PM)',
      'Promotion & Growth Plans',
      'AI Performance Insights (PM)',
    ],
  },
  {
    key: 'security',
    label: 'Security & IT Management',
    items: [
      'Role-Based Access Control',
      'Login Activity',
      'Device Management',
      'Audit Logs (Security)',
      'Data Backup',
      'Single Sign-On (SSO)',
      'IP & Geo Restrictions',
      'Security Policies',
      'Incident Management',
      'Compliance Reports',
    ],
  },
  {
    key: 'ai-automation',
    label: 'AI & Automation',
    items: [
      'AI Copilot',
      'AI Task Suggestions',
      'Smart Attendance',
      'Auto Worklogs',
      'AI Reports',
      'Chatbot Assistant',
      'Workflow Automation (n8n)',
      'Predictive Analytics (AI)',
      'AI Performance Insights (AI module)',
      'AI Hiring & Screening',
      'RPA Bots (No-Code)',
      'AI Alerts & Triggers',
    ],
  },
  {
    key: 'dev-platform',
    label: 'Development Platform',
    items: [
      'API Management',
      'Custom Modules',
      'Integrations',
      'Webhooks',
      'Developer Settings',
      'Low-Code Builder',
      'Workflow Builder',
      'Custom Objects & Fields',
      'Form Builder',
      'App Marketplace',
      'Environment Management',
    ],
  },
  {
    key: 'core-nav',
    label: 'Core Navigation & Platform Controls',
    items: [
      'Notifications',
      'Profile Settings',
      'System Settings',
      'Company Settings',
      'Theme & Branding',
      'Custom Fields',
      'Workflow Rules',
      'Global Settings',
      'Feature Toggles',
      'Data Import / Export',
      'Localization & Timezone',
      'System Status',
    ],
  },
];

const buildInitialSelections = () => {
  const map = {};
  MODULE_GROUPS.forEach((group) => {
    group.items.forEach((item) => {
      const id = `${group.key}:${item}`;
      map[id] = {
        id,
        groupKey: group.key,
        groupLabel: group.label,
        name: item,
        include: true,
        decision: 'yes',
        remarks: '',
        custom: '',
      };
    });
  });
  return map;
};

const ProductPdfConfigurator = () => {
  const [selections, setSelections] = useState(buildInitialSelections);
  const [customInputs, setCustomInputs] = useState({});

  const handleToggleInclude = (id) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], include: !prev[id].include },
    }));
  };

  const handleDecisionChange = (id, value) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], decision: value },
    }));
  };

  const handleFieldChange = (id, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const includedModules = Object.values(selections).filter((m) => m.include);

  return (
    <div className="static-page">
      <MetaTags
        title="Worklogz – Product PDF Configurator"
        description="Select Worklogz modules, add Yes/No decisions, remarks, and custom notes, then generate a PDF-ready product overview."
        keywords="Worklogz product PDF, module selector, proposal generator"
      />

      <header className="static-header">
        <div className="static-header-content">
          <button className="static-header-link" onClick={handlePrint}>
            <span>🖨️</span>
            <span>Generate PDF (Print / Save as PDF)</span>
          </button>
        </div>
      </header>

      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-hero-title">
            Configure Your <span className="static-hero-title-highlight">Worklogz Product Overview</span>
          </h1>
          <p className="static-hero-description">
            Select which core modules from the Worklogz Product Overview you want to include,
            mark them as Yes or No for the client, and add remarks or additional custom notes.
            Then use the print button to generate a proposal-style PDF.
          </p>
        </div>
      </section>

      <main className="static-content">
        <div className="static-content-container">
          <section className="static-section">
            <h2 className="static-section-title">Module Selection (Based on PRODUCT_OVERVIEW.md)</h2>
            <p style={{ marginBottom: '16px' }}>
              Each main module (sidebar category) from the Product Overview has its own table. For every sub-menu item,
              choose Yes/No, add remarks, and optional custom notes. Everything will be included in the PDF summary below.
            </p>

            {MODULE_GROUPS.map((group) => {
              const rows = Object.values(selections).filter(
                (m) => m.groupKey === group.key
              );
              return (
                <div key={group.key} style={{ marginBottom: '32px' }}>
                  <h3 style={{ marginBottom: '8px' }}>{group.label}</h3>
                  <div
                    style={{
                      marginBottom: '8px',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      Add custom sub module:
                    </span>
                    <input
                      type="text"
                      placeholder="Custom sub module name"
                      value={customInputs[group.key] || ''}
                      onChange={(e) =>
                        setCustomInputs((prev) => ({
                          ...prev,
                          [group.key]: e.target.value,
                        }))
                      }
                      style={{ minWidth: '220px' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const name = (customInputs[group.key] || '').trim();
                        if (!name) return;
                        const id = `${group.key}:custom:${Date.now()}:${name}`;
                        setSelections((prev) => ({
                          ...prev,
                          [id]: {
                            id,
                            groupKey: group.key,
                            groupLabel: group.label,
                            name,
                            include: true,
                            decision: 'yes',
                            remarks: '',
                            custom: '',
                          },
                        }));
                        setCustomInputs((prev) => ({ ...prev, [group.key]: '' }));
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="product-config-table-wrapper">
                    <table className="product-config-table">
                      <thead>
                        <tr>
                          <th>Include</th>
                          <th>Sub Module</th>
                          <th>Decision (Yes / No)</th>
                          <th>Remarks</th>
                          <th>Additional Custom</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((module) => (
                          <tr key={module.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={module.include}
                                onChange={() => handleToggleInclude(module.id)}
                              />
                            </td>
                            <td>{module.name}</td>
                            <td>
                              <select
                                value={module.decision}
                                onChange={(e) =>
                                  handleDecisionChange(
                                    module.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="Remarks (e.g., Phase 2, optional, etc.)"
                                value={module.remarks}
                                onChange={(e) =>
                                  handleFieldChange(
                                    module.id,
                                    'remarks',
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="Additional custom notes"
                                value={module.custom}
                                onChange={(e) =>
                                  handleFieldChange(
                                    module.id,
                                    'custom',
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="static-section">
            <h2 className="static-section-title">PDF Summary Preview</h2>
            <p style={{ marginBottom: '16px' }}>
              This section will appear cleanly when you use <strong>Print / Save as PDF</strong>. It is based
              on the official <strong>PRODUCT_OVERVIEW.md</strong> content, but filtered by the modules you selected above.
            </p>

            <h3>Executive Summary</h3>
            <p>
              <strong>Worklogz</strong> is a complete business and workforce management platform that unifies
              attendance, timesheets, leave, payroll, projects, CRM, helpdesk, documents, analytics, and team
              communication into one system. It is designed for startups, SMEs, and large enterprises, built
              on a modern full-stack architecture with security, scalability, and usability at its core.
            </p>

            <h3>Selected Modules for This Client</h3>
            <table className="product-config-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Main Module</th>
                  <th>Sub Module</th>
                  <th>Decision</th>
                  <th>Remarks</th>
                  <th>Additional Custom</th>
                </tr>
              </thead>
              <tbody>
                {includedModules.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '16px' }}>
                      No modules selected. Please select at least one module above.
                    </td>
                  </tr>
                ) : (
                  includedModules.map((module, index) => (
                    <tr key={module.name}>
                      <td>{index + 1}</td>
                      <td>{module.groupLabel}</td>
                      <td>{module.name}</td>
                      <td>{module.decision === 'yes' ? 'Yes' : 'No'}</td>
                      <td>{module.remarks || '-'}</td>
                      <td>{module.custom || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductPdfConfigurator;


