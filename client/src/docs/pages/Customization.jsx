import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Customization = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Customization Options</h1>
        <p className="intro-subtitle">
          Branding, modules, workflow changes, UI tweaks, custom reports, and more.
        </p>

        <h2 id="branding">Branding</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🎨"
            title="Logo Customization"
            description="Upload your company logo to replace default branding"
          />
          <FeatureCard
            icon="🌈"
            title="Color Scheme"
            description="Customize colors to match your brand identity"
          />
          <FeatureCard
            icon="📧"
            title="Email Branding"
            description="Branded email templates and notifications"
          />
          <FeatureCard
            icon="🌐"
            title="Domain Customization"
            description="Use your own domain name for the application"
          />
        </div>

        <h2 id="modules">Module Configuration</h2>
        <p>
          Enable or disable modules based on your organization's needs:
        </p>
        <ul>
          <li>Attendance Management</li>
          <li>Timesheet Module</li>
          <li>Leave Management</li>
          <li>Payroll Module</li>
          <li>CRM Pipelines (Course, Internship, IT Projects)</li>
          <li>Task Management</li>
          <li>Project Management</li>
          <li>Helpdesk System</li>
          <li>Document Management</li>
          <li>Analytics & Reporting</li>
        </ul>

        <h2 id="workflows">Workflow Customization</h2>
        <h3>Customizable Workflows</h3>
        <ul>
          <li>Leave approval workflows</li>
          <li>Task assignment workflows</li>
          <li>Ticket routing workflows</li>
          <li>User approval processes</li>
          <li>Timesheet approval chains</li>
        </ul>

        <h2 id="ui-customization">UI Customization</h2>
        <ul>
          <li>Theme customization (light/dark modes)</li>
          <li>Layout preferences</li>
          <li>Dashboard widget configuration</li>
          <li>Navigation menu customization</li>
          <li>Component styling</li>
        </ul>

        <h2 id="custom-reports">Custom Reports</h2>
        <ul>
          <li>Custom report templates</li>
          <li>Custom data fields</li>
          <li>Report scheduling</li>
          <li>Export formats (PDF, Excel, CSV)</li>
          <li>Automated report distribution</li>
        </ul>

        <h2 id="fields-forms">Custom Fields & Forms</h2>
        <ul>
          <li>Custom user fields</li>
          <li>Custom attendance fields</li>
          <li>Custom timesheet fields</li>
          <li>Custom form fields</li>
          <li>Field validation rules</li>
        </ul>

        <h2 id="integrations">Integration Customization</h2>
        <ul>
          <li>Custom API endpoints</li>
          <li>Webhook configurations</li>
          <li>Third-party integrations</li>
          <li>Custom authentication methods</li>
          <li>Data import/export formats</li>
        </ul>

        <h2 id="localization">Localization</h2>
        <ul>
          <li>Multi-language support</li>
          <li>Currency customization</li>
          <li>Date/time format preferences</li>
          <li>Regional settings</li>
          <li>Timezone configuration</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Customization;

