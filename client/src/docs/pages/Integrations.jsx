import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Integrations = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Integration Capabilities</h1>
        <p className="intro-subtitle">
          APIs, webhooks, and compatibility with payroll, HRMS, or project-management tools.
        </p>

        <h2 id="overview">Integration Overview</h2>
        <p>
          Worklogz provides comprehensive integration capabilities to connect with your existing 
          business tools and workflows, ensuring seamless data flow and enhanced productivity.
        </p>

        <h2 id="api-access">RESTful API</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🔌"
            title="RESTful API"
            description="Standard REST API for custom integrations"
          />
          <FeatureCard
            icon="🔐"
            title="API Authentication"
            description="Secure API access with JWT tokens"
          />
          <FeatureCard
            icon="📚"
            title="Comprehensive Documentation"
            description="Complete API documentation and examples"
          />
          <FeatureCard
            icon="⚡"
            title="Real-Time Updates"
            description="WebSocket support for real-time data sync"
          />
        </div>

        <h2 id="webhooks">Webhooks</h2>
        <p>
          Configure webhooks to receive real-time notifications:
        </p>
        <ul>
          <li>User events (creation, updates)</li>
          <li>Attendance events (check-in, check-out)</li>
          <li>Leave request events</li>
          <li>Payroll events</li>
          <li>Task and project updates</li>
          <li>Custom event triggers</li>
        </ul>

        <h2 id="payroll-integrations">Payroll Integrations</h2>
        <ul>
          <li>Export timesheet data to payroll systems</li>
          <li>Sync employee information</li>
          <li>Transfer salary data</li>
          <li>Payslip generation triggers</li>
          <li>Payment status updates</li>
        </ul>

        <h2 id="hrms-integrations">HRMS Integrations</h2>
        <ul>
          <li>Employee data synchronization</li>
          <li>Leave balance sync</li>
          <li>Attendance data export</li>
          <li>Performance data integration</li>
          <li>Bi-directional data flow</li>
        </ul>

        <h2 id="project-management">Project Management Tools</h2>
        <ul>
          <li>Jira integration</li>
          <li>Trello integration</li>
          <li>Asana integration</li>
          <li>Time tracking sync</li>
          <li>Project data import/export</li>
        </ul>

        <h2 id="communication-tools">Communication Tools</h2>
        <ul>
          <li>Slack notifications</li>
          <li>Microsoft Teams integration</li>
          <li>Email notifications</li>
          <li>SMS notifications</li>
          <li>Push notifications</li>
        </ul>

        <h2 id="storage-integrations">Storage & File Management</h2>
        <ul>
          <li>Cloudinary for media storage</li>
          <li>Google Drive integration</li>
          <li>Dropbox integration</li>
          <li>OneDrive integration</li>
          <li>Custom storage providers</li>
        </ul>

        <h2 id="custom-integrations">Custom Integrations</h2>
        <p>
          Build custom integrations using:
        </p>
        <ul>
          <li>RESTful API endpoints</li>
          <li>Webhook subscriptions</li>
          <li>WebSocket connections</li>
          <li>Data import/export formats</li>
          <li>Custom authentication methods</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Integrations;

