import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeAttendance = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Employee Attendance</h1>
        <p className="intro-subtitle">
          Track your attendance, check in/out, view attendance history, and monitor your work hours.
        </p>

        <h2 id="overview">Attendance Overview</h2>
        <p>
          The Employee Attendance module allows you to check in and out, view your attendance 
          history, track weekly hours, and monitor daily earnings.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="✅"
            title="Check-In/Check-Out"
            description="Check in and out with camera verification"
          />
          <FeatureCard
            icon="📅"
            title="Attendance History"
            description="View your complete attendance history"
          />
          <FeatureCard
            icon="⏰"
            title="Weekly Hours"
            description="Track your weekly working hours"
          />
          <FeatureCard
            icon="💰"
            title="Daily Earnings"
            description="Monitor your daily earnings"
          />
        </div>

        <h2 id="check-in">Check-In Process</h2>
        <ol>
          <li>Select your work mode (Office, Remote, or Hybrid)</li>
          <li>Capture a photo (optional)</li>
          <li>Verify your location</li>
          <li>Complete check-in</li>
        </ol>
      </div>
    </DocsLayout>
  );
};

export default EmployeeAttendance;

