import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const RoleBasedAccess = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Role-Based Access & Permissions</h1>
        <p className="intro-subtitle">
          Admin, manager, employee, client roles, and comprehensive permission system.
        </p>

        <h2 id="role-types">Role Types</h2>
        <div className="features-grid">
          <FeatureCard
            icon="👑"
            title="Admin"
            description="Full system access with all administrative capabilities"
          />
          <FeatureCard
            icon="👔"
            title="Manager"
            description="Department or team management with oversight capabilities"
          />
          <FeatureCard
            icon="👤"
            title="Employee"
            description="Personal features and data access for individual users"
          />
          <FeatureCard
            icon="🤝"
            title="Client"
            description="Limited access for external clients and stakeholders"
          />
        </div>

        <h2 id="admin-role">Admin Role</h2>
        <h3>Permissions</h3>
        <ul>
          <li>Full system access and configuration</li>
          <li>User management (create, edit, delete users)</li>
          <li>Department and organization management</li>
          <li>System settings and configuration</li>
          <li>All reporting and analytics</li>
          <li>Payroll and financial management</li>
          <li>CRM pipeline management</li>
          <li>Document generation and management</li>
        </ul>

        <h2 id="employee-role">Employee Role</h2>
        <h3>Permissions</h3>
        <ul>
          <li>Personal attendance tracking</li>
          <li>Timesheet logging and submission</li>
          <li>Leave application and tracking</li>
          <li>Personal profile management</li>
          <li>View personal earnings and payslips</li>
          <li>Access to assigned tasks</li>
          <li>Community hub access</li>
          <li>Helpdesk ticket creation</li>
        </ul>

        <h2 id="permission-system">Permission System</h2>
        <h3>Granular Permissions</h3>
        <ul>
          <li>Module-based access control</li>
          <li>Feature-level permissions</li>
          <li>Department-based restrictions</li>
          <li>Custom permission sets</li>
        </ul>

        <h3>Permission Categories</h3>
        <ul>
          <li><strong>View:</strong> Read-only access to data</li>
          <li><strong>Create:</strong> Ability to create new records</li>
          <li><strong>Edit:</strong> Modify existing records</li>
          <li><strong>Delete:</strong> Remove records</li>
          <li><strong>Approve:</strong> Approval workflow permissions</li>
          <li><strong>Export:</strong> Export data and reports</li>
        </ul>

        <h2 id="department-permissions">Department-Based Permissions</h2>
        <p>
          Permissions can be scoped to specific departments:
        </p>
        <ul>
          <li>Department-specific data access</li>
          <li>Cross-department restrictions</li>
          <li>Department manager privileges</li>
          <li>Isolated department workspaces</li>
        </ul>

        <h2 id="security">Security Features</h2>
        <ul>
          <li>Role-based authentication</li>
          <li>Session management</li>
          <li>Permission verification on every action</li>
          <li>Audit logging of permission changes</li>
          <li>Secure API access control</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default RoleBasedAccess;

