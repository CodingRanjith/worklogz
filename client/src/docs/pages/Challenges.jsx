import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Challenges = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Challenges Worklogz Solves</h1>
        <p className="intro-subtitle">
          Common problems like manual tracking, inaccurate timesheets, team transparency, and more.
        </p>

        <h2 id="manual-tracking">Manual Time Tracking</h2>
        <p>
          <strong>Problem:</strong> Many organizations still rely on manual time tracking methods 
          like paper timesheets, Excel spreadsheets, or basic clock-in systems. These methods are 
          error-prone, time-consuming, and difficult to manage.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz automates time tracking with digital check-in/check-out, 
          camera verification, and location tracking. The system eliminates manual errors and saves 
          significant administrative time.
        </p>

        <div className="features-grid">
          <FeatureCard
            icon="✅"
            title="Automated Tracking"
            description="Eliminate manual time entry errors"
          />
          <FeatureCard
            icon="📱"
            title="Digital Check-In"
            description="Quick and accurate attendance tracking"
          />
          <FeatureCard
            icon="🔍"
            title="Verification"
            description="Camera and location verification for accuracy"
          />
        </div>

        <h2 id="inaccurate-timesheets">Inaccurate Timesheets</h2>
        <p>
          <strong>Problem:</strong> Inaccurate timesheets lead to incorrect payroll, billing errors, 
          and compliance issues. Manual entries can be forgotten, incorrectly calculated, or 
          deliberately manipulated.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz provides real-time tracking, automatic calculations, 
          and verification mechanisms that ensure timesheet accuracy. Project-based tracking helps 
          organizations understand exactly how time is spent.
        </p>

        <h2 id="lack-of-transparency">Lack of Team Transparency</h2>
        <p>
          <strong>Problem:</strong> Without proper visibility, managers can't understand team 
          workloads, identify bottlenecks, or make informed decisions about resource allocation.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz provides comprehensive dashboards, analytics, and 
          reports that give managers clear visibility into attendance, productivity, and work 
          patterns across the organization.
        </p>

        <h2 id="payroll-complexity">Payroll Processing Complexity</h2>
        <p>
          <strong>Problem:</strong> Manual payroll processing is complex, error-prone, and 
          time-consuming. Calculating hours, deductions, and generating payslips manually 
          requires significant administrative effort.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz automates payroll processing with daily salary 
          credits, automated payslip generation, and comprehensive salary history tracking. 
          The system handles calculations automatically and ensures accuracy.
        </p>

        <h2 id="fragmented-systems">Fragmented Systems</h2>
        <p>
          <strong>Problem:</strong> Many organizations use separate systems for attendance, 
          payroll, project management, and CRM, leading to data silos and inefficiencies.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz is an all-in-one platform that integrates attendance, 
          timesheets, payroll, projects, and CRM into a single unified system. This eliminates 
          data silos and improves efficiency.
        </p>

        <h2 id="compliance-issues">Compliance & Regulation</h2>
        <p>
          <strong>Problem:</strong> Meeting labor regulations, maintaining audit trails, and 
          ensuring data privacy compliance can be challenging with manual or basic systems.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz includes built-in compliance features, audit logs, 
          secure data storage, and reporting capabilities that help organizations meet regulatory 
          requirements.
        </p>

        <h2 id="remote-work-challenges">Remote Work Management</h2>
        <p>
          <strong>Problem:</strong> Managing remote and hybrid teams is difficult without proper 
          tools for tracking attendance, monitoring productivity, and maintaining communication.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz supports multiple work modes (Office, Remote, Hybrid) 
          and provides the tools needed to manage distributed teams effectively.
        </p>

        <h2 id="poor-reporting">Poor Reporting & Analytics</h2>
        <p>
          <strong>Problem:</strong> Without proper analytics, organizations struggle to make 
          data-driven decisions, identify trends, or optimize operations.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz provides comprehensive analytics, customizable 
          reports, and visual dashboards that help organizations make informed decisions based 
          on real data.
        </p>

        <h2 id="inefficient-leave-management">Inefficient Leave Management</h2>
        <p>
          <strong>Problem:</strong> Manual leave request processes, email approvals, and 
          balance tracking are inefficient and error-prone.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz streamlines leave management with digital 
          applications, automated approval workflows, balance tracking, and calendar integration.
        </p>

        <h2 id="limited-scalability">Limited Scalability</h2>
        <p>
          <strong>Problem:</strong> Basic systems often can't scale as organizations grow, 
          leading to performance issues and limitations.
        </p>
        <p>
          <strong>Solution:</strong> Worklogz is built to scale from small teams to large 
          enterprises, with cloud-based architecture that handles growth seamlessly.
        </p>

        <h2 id="summary">Summary</h2>
        <p>
          Worklogz addresses the fundamental challenges organizations face in workforce management. 
          By automating processes, providing visibility, ensuring accuracy, and integrating 
          essential functions, Worklogz transforms how organizations manage their workforce.
        </p>
      </div>
    </DocsLayout>
  );
};

export default Challenges;

