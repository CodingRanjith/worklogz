import React, { useMemo, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DocsLayout from './DocsLayout';
import SalesProposalPDF from '../components/SalesProposalPDF';
import '../styles/docs.css';
import '../styles/solutionConfigurator.css';

const buildCategories = () => [
  {
    id: 'core',
    title: 'Home & Core',
    note:
      'Core navigation and attendance features that every customer typically enables.',
    items: [
      { id: 'home', label: 'Home', description: 'Personalized launchpad for each user.', selected: true },
      { id: 'dashboard', label: 'Dashboard', description: 'High-level metrics and KPIs.', selected: true },
      { id: 'attendance', label: 'Attendance', description: 'Check-in/out with GPS & camera.', selected: true },
    ],
  },
  {
    id: 'hr',
    title: 'HR & Administration',
    note:
      'Complete employee lifecycle management including onboarding, profiles, approvals, and HR analytics.',
    items: [
      { id: 'user-employee-mgmt', label: 'User & Employee Management', selected: true },
      { id: 'people', label: 'People Directory', selected: true },
      { id: 'team-mgmt-hr', label: 'Team Management', selected: true },
      { id: 'applications', label: 'Applications', selected: false },
      { id: 'roles-permissions', label: 'Roles & Permissions', selected: true },
      { id: 'onboarding-offboarding', label: 'Onboarding & Offboarding', selected: true },
      { id: 'employee-profiles', label: 'Employee Profiles', selected: true },
      { id: 'hr-requests', label: 'HR Requests & Approvals', selected: true },
      { id: 'org-chart', label: 'Org Chart', selected: false },
      { id: 'hr-analytics', label: 'HR Analytics', selected: true },
    ],
  },
  {
    id: 'time-task',
    title: 'Time & Task Tracking',
    note:
      'Timesheets, worklogs, and productivity analytics for teams across departments and projects.',
    items: [
      { id: 'task-manager', label: 'Task Manager', selected: true },
      { id: 'admin-task-manager', label: 'Admin Task Manager', selected: false },
      { id: 'worklog-tracking', label: 'Worklog Tracking', selected: true },
      { id: 'calendar-view', label: 'Calendar View', selected: true },
      { id: 'timesheets', label: 'Timesheets', selected: true },
      { id: 'productivity-reports', label: 'Productivity Reports', selected: true },
      { id: 'shift-mgmt', label: 'Shift Management', selected: false },
      { id: 'overtime', label: 'Overtime Tracking', selected: false },
      { id: 'ai-time-insights', label: 'AI Time Insights', selected: false },
    ],
  },
  {
    id: 'leave',
    title: 'Leave Management',
    note:
      'Configurable leave policies, approvals, and analytics for all types of leave and shifts.',
    items: [
      { id: 'apply-leave', label: 'Apply Leave', selected: true },
      { id: 'leave-records', label: 'Leave Records', selected: true },
      { id: 'late-reports', label: 'Late Reports', selected: false },
      { id: 'holiday-list', label: 'Holiday List', selected: true },
      { id: 'leave-policies', label: 'Leave Policies', selected: true },
      { id: 'leave-approvals', label: 'Leave Approvals', selected: true },
      { id: 'comp-off', label: 'Comp-Off Management', selected: false },
      { id: 'shift-based-leaves', label: 'Shift-Based Leaves', selected: false },
      { id: 'leave-analytics', label: 'Leave Analytics', selected: false },
      { id: 'ai-leave-insights', label: 'AI Leave Insights', selected: false },
    ],
  },
  {
    id: 'finance',
    title: 'Finance & Compensation',
    note:
      'Daily salary credits, payroll, reimbursements, and finance analytics.',
    items: [
      { id: 'salary', label: 'Salary & Pay History', selected: true },
      { id: 'payslip-generator', label: 'Payslip Generator', selected: true },
      { id: 'daily-salary', label: 'Daily Salary Credit', selected: false },
      { id: 'expense-claims', label: 'Expense Claims & Reimbursements', selected: false },
      { id: 'payroll', label: 'Payroll Processing', selected: true },
      { id: 'bonuses', label: 'Bonuses & Incentives', selected: false },
      { id: 'tax-compliance-fin', label: 'Tax & Compliance', selected: false },
      { id: 'finance-analytics', label: 'Finance Analytics', selected: false },
    ],
  },
  {
    id: 'projects',
    title: 'Project Management',
    note:
      'End-to-end project workspace with tasks, milestones, sprints, and AI automation.',
    items: [
      { id: 'projects-workspace', label: 'Projects Workspace', selected: true },
      { id: 'my-workspace', label: 'My Workspace', selected: true },
      { id: 'company-worklogz', label: 'Company Worklogz', selected: false },
      { id: 'company-departments', label: 'Company Departments', selected: false },
      { id: 'project-reports', label: 'Project Reports & Productivity', selected: true },
      { id: 'sub-tasks', label: 'Sub Tasks & Milestones', selected: true },
      { id: 'sprints', label: 'Sprint & Agile Board', selected: false },
      { id: 'resource-allocation', label: 'Resource Allocation', selected: false },
      { id: 'gantt', label: 'Project Timeline (Gantt)', selected: false },
      { id: 'project-ai', label: 'Project Automation (AI)', selected: false },
    ],
  },
  {
    id: 'crm',
    title: 'Sales & CRM',
    note:
      'Specialized CRM pipelines for courses, internships, IT projects, and custom sales processes.',
    items: [
      { id: 'crm-dashboard', label: 'CRM Dashboard', selected: true },
      { id: 'course-crm', label: 'Course CRM', selected: false },
      { id: 'internship-crm', label: 'Internship CRM', selected: false },
      { id: 'it-projects-crm', label: 'IT Projects CRM', selected: false },
      { id: 'custom-crm', label: 'Custom CRM', selected: false },
      { id: 'leads', label: 'Leads Management', selected: true },
      { id: 'deals', label: 'Deals & Pipeline', selected: true },
      { id: 'contacts', label: 'Contacts & Accounts', selected: true },
      { id: 'activities', label: 'Follow-ups & Activities', selected: true },
      { id: 'crm-automation', label: 'CRM Automation (n8n)', selected: false },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    note:
      'AI copilot, insights, and workflow automation to reduce manual work across modules.',
    items: [
      { id: 'ai-copilot', label: 'AI Copilot & Chatbot Assistant', selected: true },
      { id: 'ai-task-suggestions', label: 'AI Task Suggestions', selected: false },
      { id: 'smart-attendance', label: 'Smart Attendance & Auto Worklogs', selected: false },
      { id: 'ai-reports', label: 'AI Reports & Predictive Analytics', selected: false },
      { id: 'workflow-automation', label: 'Workflow Automation (n8n)', selected: false },
      { id: 'ai-performance', label: 'AI Performance Insights', selected: false },
      { id: 'ai-hiring', label: 'AI Hiring & Screening', selected: false },
    ],
  },
  {
    id: 'platform',
    title: 'Platform, Security & Developer',
    note:
      'Security, role-based access, and extensibility via APIs, webhooks, and low-code tools.',
    items: [
      { id: 'rbac', label: 'Role-Based Access Control', selected: true },
      { id: 'audit-logs', label: 'Audit Logs & Login Activity', selected: true },
      { id: 'device-mgmt', label: 'Device & Session Management', selected: false },
      { id: 'sso', label: 'Single Sign-On (SSO)', selected: false },
      { id: 'api-mgmt', label: 'API Management & Webhooks', selected: false },
      { id: 'low-code', label: 'Low-Code / Workflow Builder', selected: false },
      { id: 'custom-objects', label: 'Custom Objects & Fields', selected: true },
      { id: 'integrations', label: 'Integrations & Marketplace', selected: false },
    ],
  },
];

const SolutionConfigurator = () => {
  const [clientInfo, setClientInfo] = useState({
    companyName: '',
    contactName: '',
    segments: '',
    brandName: 'Worklogz',
  });
  const [globalNotes, setGlobalNotes] = useState(
    'This configuration is prepared based on your current requirements. Modules and scope can be extended as your team grows.'
  );

  const [categories, setCategories] = useState(buildCategories);

  const hasSelections = useMemo(
    () =>
      categories.some((cat) => cat.items && cat.items.some((f) => f.selected)),
    [categories]
  );

  const toggleFeature = (categoryId, featureId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id !== categoryId
          ? cat
          : {
              ...cat,
              items: cat.items.map((f) =>
                f.id === featureId ? { ...f, selected: !f.selected } : f
              ),
            }
      )
    );
  };

  const setCategoryAll = (categoryId, value) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id !== categoryId
          ? cat
          : {
              ...cat,
              items: cat.items.map((f) => ({ ...f, selected: value })),
            }
      )
    );
  };

  const handleClientChange = (field, value) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const fileName = useMemo(() => {
    const base =
      clientInfo.companyName?.trim() ||
      clientInfo.contactName?.trim() ||
      'worklogz-solution';
    return `${base.replace(/\s+/g, '-').toLowerCase()}-overview.pdf`;
  }, [clientInfo.companyName, clientInfo.contactName]);

  return (
    <DocsLayout>
      <div className="docs-page">
        <h1>Worklogz Solution Configurator & PDF Builder</h1>
        <p className="intro-subtitle">
          Select the modules relevant for your client, add branding and notes, and download
          a one-click PDF overview that summarizes exactly what will be enabled.
        </p>

        <section className="docs-section">
          <h2>Client & Branding Details</h2>
          <div className="configurator-grid">
            <div className="configurator-field">
              <label>Client / Company Name</label>
              <input
                type="text"
                value={clientInfo.companyName}
                onChange={(e) => handleClientChange('companyName', e.target.value)}
                placeholder="e.g., ACME Technologies Pvt. Ltd."
              />
            </div>
            <div className="configurator-field">
              <label>Primary Contact Name</label>
              <input
                type="text"
                value={clientInfo.contactName}
                onChange={(e) => handleClientChange('contactName', e.target.value)}
                placeholder="e.g., Rahul Sharma – HR Head"
              />
            </div>
            <div className="configurator-field">
              <label>Target Segments / Use Cases</label>
              <input
                type="text"
                value={clientInfo.segments}
                onChange={(e) => handleClientChange('segments', e.target.value)}
                placeholder="e.g., HR, Payroll, Project Teams, Sales CRM"
              />
            </div>
            <div className="configurator-field">
              <label>Brand Name (for header)</label>
              <input
                type="text"
                value={clientInfo.brandName}
                onChange={(e) => handleClientChange('brandName', e.target.value)}
                placeholder="Defaults to Worklogz"
              />
            </div>
          </div>
        </section>

        <section className="docs-section">
          <h2>Solution Notes (Optional)</h2>
          <textarea
            className="configurator-textarea"
            rows={4}
            value={globalNotes}
            onChange={(e) => setGlobalNotes(e.target.value)}
            placeholder="Add any custom explanation, pricing assumptions, or scope notes that should appear at the top of the PDF."
          />
        </section>

        <section className="docs-section">
          <div className="configurator-header-row">
            <h2>Select Modules & Features</h2>
            {hasSelections && (
              <PDFDownloadLink
                document={
                  <SalesProposalPDF
                    clientInfo={clientInfo}
                    categories={categories}
                    globalNotes={globalNotes}
                  />
                }
                fileName={fileName}
              >
                {({ loading }) => (
                  <button
                    className="configurator-download-btn"
                    type="button"
                    disabled={loading}
                  >
                    {loading ? 'Preparing PDF…' : 'Download Selected Overview (PDF)'}
                  </button>
                )}
              </PDFDownloadLink>
            )}
          </div>
          {!hasSelections && (
            <p className="configurator-helper">
              Select at least one feature below to enable the PDF download.
            </p>
          )}

          <div className="configurator-categories">
            {categories.map((category) => {
              const allSelected =
                category.items.length > 0 &&
                category.items.every((f) => f.selected);
              const anySelected = category.items.some((f) => f.selected);

              return (
                <div key={category.id} className="configurator-category-card">
                  <div className="configurator-category-header">
                    <div>
                      <h3>{category.title}</h3>
                      {category.note && (
                        <p className="configurator-category-note">{category.note}</p>
                      )}
                    </div>
                    <div className="configurator-category-actions">
                      <button
                        type="button"
                        onClick={() => setCategoryAll(category.id, true)}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryAll(category.id, false)}
                      >
                        Clear
                      </button>
                      {anySelected && (
                        <span className="configurator-chip">
                          {category.items.filter((f) => f.selected).length} selected
                        </span>
                      )}
                      {!anySelected && (
                        <span className="configurator-chip muted">None selected</span>
                      )}
                    </div>
                  </div>

                  <div className="configurator-features-grid">
                    {category.items.map((feature) => (
                      <label
                        key={feature.id}
                        className={`configurator-feature ${
                          feature.selected ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={feature.selected}
                          onChange={() =>
                            toggleFeature(category.id, feature.id)
                          }
                        />
                        <div className="configurator-feature-text">
                          <span className="configurator-feature-label">
                            {feature.label}
                          </span>
                          {feature.description && (
                            <span className="configurator-feature-desc">
                              {feature.description}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  {allSelected && (
                    <p className="configurator-helper tiny">
                      All features enabled for this category.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default SolutionConfigurator;


