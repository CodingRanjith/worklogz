import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const AdminUserManagement = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>User Management</h1>
        <p className="intro-subtitle">
          Manage users, employees, and access permissions. Create, edit, and organize user accounts.
        </p>

        <h2 id="overview">User Management Overview</h2>
        <p>
          The User Management module allows administrators to manage all user accounts, 
          assign roles, set permissions, and organize employees by department.
        </p>

        <h2 id="features">Key Features</h2>
        <ul>
          <li><strong>Create Users:</strong> Add new employees and administrators</li>
          <li><strong>Edit Users:</strong> Update user information and settings</li>
          <li><strong>User Cards:</strong> View user information in card format</li>
          <li><strong>Pending Approvals:</strong> Approve or reject user registrations</li>
          <li><strong>Employee Schedules:</strong> Manage employee work schedules</li>
          <li><strong>Role Management:</strong> Assign and modify user roles</li>
        </ul>

        <h2 id="user-roles">User Roles</h2>
        <ul>
          <li><strong>Admin:</strong> Full access to all features</li>
          <li><strong>Employee:</strong> Access to employee-specific features</li>
        </ul>

        <h2 id="user-creation">Creating Users</h2>
        <p>To create a new user:</p>
        <ol>
          <li>Navigate to User Management</li>
          <li>Click "Create User"</li>
          <li>Fill in user details (name, email, department, etc.)</li>
          <li>Assign role and permissions</li>
          <li>Save the user</li>
        </ol>

        <h2 id="pending-users">Pending User Approvals</h2>
        <p>
          Review and approve users who have registered but are awaiting approval. 
          You can approve, reject, or request more information.
        </p>
      </div>
    </DocsLayout>
  );
};

export default AdminUserManagement;

