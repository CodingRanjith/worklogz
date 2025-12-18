import React, { useState } from 'react';
import MetaTags from '../../components/SEO/MetaTags';
import './StaticPage.css';
import worklogzLogo from '../../assets/worklogz-logo.png';

// Sidebar modules & sub-modules based on the internal Worklogz product overview
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
        decision: '',
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

  const handleDecisionChange = (id, value) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], decision: value },
    }));
  };

  const handleBulkDecisionForGroup = (groupKey, value) => {
    setSelections((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        if (updated[id].groupKey === groupKey) {
          updated[id] = { ...updated[id], decision: value };
        }
      });
      return updated;
    });
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

  // For PDF snapshot, include all modules as they appear on the page
  const includedModules = Object.values(selections);

  return (
    <div className="static-page">
      <MetaTags
        title="Worklogz – Product PDF Configurator"
        description="Select Worklogz modules, add Yes/No decisions, remarks, and custom notes, then generate a PDF-ready product overview."
        keywords="Worklogz product PDF, module selector, proposal generator"
      />

      <header className="static-header">
        <div className="static-header-content">
          <div className="static-header-title-group">
            <div className="static-header-brand">
              <img src={worklogzLogo} alt="Worklogz logo" className="static-header-logo" />
              <div>
                <h1 className="static-header-title">Worklogz Proposal Configurator</h1>
                <p className="static-header-subtitle">
                  Configure modules for a tailored Worklogz implementation proposal.
                </p>
              </div>
            </div>
          </div>
          <button className="static-header-primary" onClick={handlePrint}>
            <span className="static-header-primary-icon">🖨️</span>
            <span>Generate Proposal PDF</span>
          </button>
        </div>
      </header>

      <section className="static-hero">
        <div className="static-hero-content">
          <img
            src={worklogzLogo}
            alt="Worklogz logo"
            className="static-hero-logo"
          />
          <h1 className="static-hero-title">
            Configure Your <span className="static-hero-title-highlight">Worklogz Product Overview</span>
          </h1>
          <p className="static-hero-description">
            Select which core modules from Worklogz you want to include and mark them as Yes or No for the client.
            Then use the print button to generate a clean, proposal-style PDF with your selected modules.
          </p>
        </div>
      </section>

      <main className="static-content">
        <div className="static-content-container">
          <section className="static-section product-config-section">
            <h2 className="static-section-title">Module selection</h2>
            <p className="static-section-lead">
              For each Worklogz module, decide whether it is part of this proposal. Only selected rows will appear in the
              summary below and in the final PDF.
            </p>

            <div className="product-config-grid">
              {MODULE_GROUPS.map((group) => {
                const rows = Object.values(selections).filter(
                  (m) => m.groupKey === group.key
                );
                return (
                  <div key={group.key} className="product-config-card">
                    <h3 className="product-config-card-title">{group.label}</h3>
                    <div className="product-config-card-controls">
                      <span className="product-config-card-label">
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
                              decision: '',
                              remarks: '',
                              custom: '',
                            },
                          }));
                          setCustomInputs((prev) => ({ ...prev, [group.key]: '' }));
                        }}
                      >
                        Add
                      </button>
                      <span className="product-config-card-label-separator">|</span>
                      <button
                        type="button"
                        className="product-config-select-all product-config-select-all-yes"
                        onClick={() => handleBulkDecisionForGroup(group.key, 'yes')}
                      >
                        Select all Yes
                      </button>
                      <button
                        type="button"
                        className="product-config-select-all product-config-select-all-no"
                        onClick={() => handleBulkDecisionForGroup(group.key, 'no')}
                      >
                        Select all No
                      </button>
                    </div>
                    <div className="product-config-table-wrapper">
                      <table className="product-config-table">
                        <thead>
                          <tr>
                            <th>Sub Module</th>
                            <th>Decision</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((module) => (
                            <tr key={module.id}>
                              <td>{module.name}</td>
                              <td>
                                <div className="product-config-decision-toggle">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={module.decision === 'yes'}
                                      onChange={() =>
                                        handleDecisionChange(module.id, 'yes')
                                      }
                                    />{' '}
                                    Yes
                                  </label>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={module.decision === 'no'}
                                      onChange={() =>
                                        handleDecisionChange(module.id, 'no')
                                      }
                                    />{' '}
                                    No
                                  </label>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="static-section pdf-summary-section">
            <h2 className="static-section-title">PDF Summary Preview</h2>
            <div className="pdf-summary-header">
              <img src={worklogzLogo} alt="Worklogz logo" className="pdf-summary-logo" />
              <div>
                <h3 className="pdf-summary-title">Worklogz Proposal Summary</h3>
                <p className="pdf-summary-subtitle">
                  Modules and capabilities selected for this client.
                </p>
              </div>
            </div>
            <p style={{ marginBottom: '16px' }}>
              This section will appear cleanly when you use <strong>Print / Save as PDF</strong>. It is based
              on the official Worklogz product feature catalog, but filtered by the modules you selected above.
            </p>

            <h3>Executive Summary</h3>
            <p>
              <strong>Worklogz</strong> is a complete business and workforce management platform that unifies
              attendance, timesheets, leave, payroll, projects, CRM, helpdesk, documents, analytics, and team
              communication into one system. It is designed for startups, SMEs, and large enterprises, built
              on a modern full-stack architecture with security, scalability, and usability at its core.
            </p>

            <h3>Selected Modules for This Client</h3>
            {includedModules.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '12px' }}>
                No modules selected. Please select at least one module above.
              </p>
            ) : (
              <div className="product-summary-grid">
                {includedModules.map((module, index) => (
                  <div key={`${module.groupKey}-${module.name}-${index}`} className="product-summary-card">
                    <p className="product-summary-main">{module.groupLabel}</p>
                    <p className="product-summary-sub">{module.name}</p>
                    <p className="product-summary-decision">
                      {module.decision === 'yes' ? 'Included' : 'Not Included'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p style={{ marginTop: '24px', fontSize: '0.85rem', color: '#6b7280' }}>
              Proposal experience crafted by <strong>C Ranjith Kumar</strong>, <strong>B Gayathri</strong> and the Worklogz
              product team.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductPdfConfigurator;


