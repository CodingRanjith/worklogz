import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminAttendance = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Admin Attendance Management</h1>
        <p className="intro-subtitle">
          Monitor and manage employee attendance across your organization. View attendance 
          records, generate reports, and track attendance patterns.
        </p>

        <h2 id="overview">Attendance Management</h2>
        <p>
          The Admin Attendance module provides comprehensive tools to monitor employee 
          attendance, view attendance history, and generate attendance reports.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📋"
            title="Attendance Table"
            description="View all employee attendance records in a table format"
          />
          <FeatureCard
            icon="📊"
            title="Attendance Reports"
            description="Generate detailed attendance reports"
          />
          <FeatureCard
            icon="⏰"
            title="Late Tracking"
            description="Track late arrivals and patterns"
          />
          <FeatureCard
            icon="📅"
            title="Calendar View"
            description="View attendance in calendar format"
          />
        </div>

        <h2 id="attendance-table">Attendance Table</h2>
        <p>
          The attendance table displays all employee attendance records with filters for:
        </p>
        <ul>
          <li>Date range</li>
          <li>Department</li>
          <li>Employee</li>
          <li>Work mode (Office, Remote, Hybrid)</li>
        </ul>

        <h2 id="reports">Attendance Reports</h2>
        <p>Generate various attendance reports:</p>
        <ul>
          <li>Daily attendance summary</li>
          <li>Monthly attendance report</li>
          <li>Department-wise attendance</li>
          <li>Late arrival reports</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminAttendance;

