import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const APIEndpoints = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>API Endpoints</h1>
        <p className="intro-subtitle">
          Complete reference of all API endpoints available in Worklogz.
        </p>

        <h2 id="authentication-endpoints">Authentication Endpoints</h2>
        <CodeBlock language="text">
{`POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
POST   /api/auth/logout      Logout user`}
        </CodeBlock>

        <h2 id="user-endpoints">User Endpoints</h2>
        <CodeBlock language="text">
{`GET    /api/users           Get all users
GET    /api/users/:id        Get user by ID
POST   /api/users            Create user
PUT    /api/users/:id        Update user
DELETE /api/users/:id        Delete user`}
        </CodeBlock>

        <h2 id="attendance-endpoints">Attendance Endpoints</h2>
        <CodeBlock language="text">
{`GET    /api/attendance           Get attendance records
POST   /api/attendance/checkin    Check in
POST   /api/attendance/checkout   Check out
GET    /api/attendance/:userId    Get user attendance`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default APIEndpoints;

