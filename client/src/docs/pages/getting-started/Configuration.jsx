import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const Configuration = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Configuration</h1>
        <p className="intro-subtitle">
          Configure Worklogz to match your organization's needs. Learn about all available configuration options.
        </p>

        <h2 id="environment-variables">Environment Variables</h2>
        <p>Configure your application using environment variables:</p>

        <h3>Backend Configuration</h3>
        <CodeBlock language="bash">
{`# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/worklogz

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password`}
        </CodeBlock>

        <h3>Frontend Configuration</h3>
        <CodeBlock language="bash">
{`# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true`}
        </CodeBlock>

        <h2 id="organization-settings">Organization Settings</h2>
        <p>Configure your organization settings through the admin panel:</p>
        <ul>
          <li><strong>Company Name:</strong> Your organization's name</li>
          <li><strong>Company Logo:</strong> Upload your company logo</li>
          <li><strong>Timezone:</strong> Set your organization's timezone</li>
          <li><strong>Working Hours:</strong> Define standard working hours</li>
          <li><strong>Holiday Calendar:</strong> Configure company holidays</li>
        </ul>

        <h2 id="department-configuration">Department Configuration</h2>
        <p>Set up departments and their specific settings:</p>
        <ul>
          <li>Create departments</li>
          <li>Assign department heads</li>
          <li>Configure department-specific working hours</li>
          <li>Set up department budgets (if applicable)</li>
        </ul>

        <h2 id="payroll-configuration">Payroll Configuration</h2>
        <p>Configure payroll settings:</p>
        <ul>
          <li><strong>Salary Structure:</strong> Define salary components</li>
          <li><strong>Payment Methods:</strong> Configure payment options</li>
          <li><strong>Tax Settings:</strong> Set up tax calculations</li>
          <li><strong>Deductions:</strong> Configure deductions and benefits</li>
        </ul>

        <h2 id="attendance-configuration">Attendance Configuration</h2>
        <p>Configure attendance tracking:</p>
        <ul>
          <li><strong>Check-in Methods:</strong> Enable/disable camera verification</li>
          <li><strong>Location Tracking:</strong> Configure location requirements</li>
          <li><strong>Work Modes:</strong> Set available work modes (Office, Remote, Hybrid)</li>
          <li><strong>Late Policies:</strong> Define late arrival policies</li>
        </ul>

        <h2 id="security-settings">Security Settings</h2>
        <p>Configure security options:</p>
        <ul>
          <li><strong>Password Policy:</strong> Set password requirements</li>
          <li><strong>Session Timeout:</strong> Configure session duration</li>
          <li><strong>Two-Factor Authentication:</strong> Enable 2FA (if available)</li>
          <li><strong>IP Whitelisting:</strong> Restrict access by IP (if needed)</li>
        </ul>

        <h2 id="notification-settings">Notification Settings</h2>
        <p>Configure how notifications are sent:</p>
        <ul>
          <li>Email notifications</li>
          <li>In-app notifications</li>
          <li>Push notifications (if enabled)</li>
          <li>Notification preferences per user role</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Configuration;

