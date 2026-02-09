import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const DetailedFeatures = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Detailed Feature Breakdown</h1>
        <p className="intro-subtitle">
          A deeper dive into every feature: timesheets, reports, user roles, billing, and more.
        </p>

        <h2 id="attendance-management">Attendance Management</h2>
        <h3>Real-Time Check-In/Check-Out</h3>
        <ul>
          <li>Camera verification for attendance</li>
          <li>Location tracking and verification</li>
          <li>Work mode selection (Office, Remote, Hybrid)</li>
          <li>Automatic time stamping</li>
          <li>Weekly hours tracking</li>
          <li>Daily earnings calculation</li>
        </ul>

        <h3>Attendance Tracking Features</h3>
        <ul>
          <li>Complete attendance history</li>
          <li>Calendar view with color coding</li>
          <li>Activity logs</li>
          <li>Late arrival tracking</li>
          <li>Holiday calendar integration</li>
        </ul>

        <h2 id="timesheet-management">Timesheet Management</h2>
        <h3>Daily Time Logging</h3>
        <ul>
          <li>Date-based time entry</li>
          <li>Project-based time tracking</li>
          <li>Multiple entries per day</li>
          <li>Detailed work descriptions</li>
          <li>Time submission workflow</li>
        </ul>

        <h3>Timesheet Features</h3>
        <ul>
          <li>Weekly submission</li>
          <li>Approval workflow</li>
          <li>Timesheet history</li>
          <li>Project hours summary</li>
          <li>Edit capabilities</li>
        </ul>

        <h2 id="user-roles">User Roles & Permissions</h2>
        <h3>Role Types</h3>
        <ul>
          <li><strong>Admin:</strong> Full system access and management</li>
          <li><strong>Employee:</strong> Personal features and data access</li>
        </ul>

        <h3>Permission System</h3>
        <ul>
          <li>Role-based access control</li>
          <li>Granular permissions</li>
          <li>Department-based access</li>
          <li>Custom role configuration</li>
        </ul>

        <h2 id="payroll-billing">Payroll & Billing</h2>
        <h3>Payslip Generation</h3>
        <ul>
          <li>Automated payslip creation</li>
          <li>PDF generation</li>
          <li>Email distribution</li>
          <li>Custom templates</li>
          <li>Bulk generation</li>
        </ul>

        <h3>Salary Management</h3>
        <ul>
          <li>Daily salary credit system</li>
          <li>Salary history tracking</li>
          <li>Payment records</li>
          <li>Credit history</li>
          <li>Deduction management</li>
        </ul>

        <h2 id="reports-analytics">Reports & Analytics</h2>
        <h3>Report Types</h3>
        <ul>
          <li>Attendance reports</li>
          <li>Payroll reports</li>
          <li>Performance reports</li>
          <li>Department analytics</li>
          <li>Monthly summaries</li>
          <li>Custom date range reports</li>
        </ul>

        <h3>Analytics Features</h3>
        <ul>
          <li>Dashboard analytics</li>
          <li>Trend analysis</li>
          <li>Comparative views</li>
          <li>Export capabilities</li>
        </ul>

        <h2 id="crm-features">CRM Features</h2>
        <h3>Course CRM</h3>
        <ul>
          <li>Lead management</li>
          <li>Course enrollment tracking</li>
          <li>Payment tracking</li>
          <li>Demo management</li>
          <li>Trainer assignment</li>
        </ul>

        <h3>Internship CRM</h3>
        <ul>
          <li>Candidate tracking</li>
          <li>Program management</li>
          <li>Placement tracking</li>
          <li>Progress monitoring</li>
        </ul>

        <h3>IT Projects CRM</h3>
        <ul>
          <li>Project lead management</li>
          <li>Stage tracking</li>
          <li>Client information</li>
          <li>Payment tracking</li>
          <li>Timeline management</li>
        </ul>

        <h2 id="document-management">Document Management</h2>
        <ul>
          <li>Experience letter generation</li>
          <li>Offer letter management</li>
          <li>Relieving letter creation</li>
          <li>Document upload and storage</li>
          <li>Template customization</li>
        </ul>

        <h2 id="task-project-management">Task & Project Management</h2>
        <h3>Task Management</h3>
        <ul>
          <li>Task creation and assignment</li>
          <li>Status tracking (Backlog, In Progress, Done)</li>
          <li>Department-based organization</li>
          <li>Task reporting</li>
        </ul>

        <h3>Project Management</h3>
        <ul>
          <li>Project workspace</li>
          <li>Team assignment</li>
          <li>Progress tracking</li>
          <li>Department organization</li>
        </ul>

        <h2 id="assessment-system">Assessment System</h2>
        <h3>Assessment Features</h3>
        <ul>
          <li>Assessment listing and assignment</li>
          <li>Multiple question types (single-choice, multiple-choice, text, essay)</li>
          <li>Question navigation with progress tracking</li>
          <li>Timer-based assessments with countdown</li>
          <li>Auto-save answers as you type</li>
          <li>Auto-submit when time expires</li>
          <li>Manual submission with confirmation</li>
          <li>Resume incomplete assessments</li>
          <li>Progress bar and answered questions counter</li>
        </ul>

        <h3>Security Features</h3>
        <ul>
          <li>Fullscreen mode enforcement</li>
          <li>Copy/paste prevention</li>
          <li>Tab/window switch detection</li>
          <li>Keyboard shortcut blocking (Ctrl+C, Ctrl+V, F12, DevTools)</li>
          <li>Right-click context menu prevention</li>
          <li>Question skip prevention (optional)</li>
          <li>Warning system for first violation</li>
          <li>Violation tracking and reporting</li>
          <li>Exit warning modal</li>
        </ul>

        <h3>Question Types</h3>
        <ul>
          <li><strong>Single Choice:</strong> Radio button selection (one answer)</li>
          <li><strong>Multiple Choice:</strong> Checkbox selection (multiple answers)</li>
          <li><strong>Text:</strong> Short text input</li>
          <li><strong>Essay:</strong> Long-form textarea input</li>
        </ul>

        <h3>Assessment Management</h3>
        <ul>
          <li>Assessment details display (title, description, duration, questions count, passing score)</li>
          <li>Security badge indicators</li>
          <li>Assessment status tracking</li>
          <li>Submission history</li>
          <li>Time spent tracking</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default DetailedFeatures;

