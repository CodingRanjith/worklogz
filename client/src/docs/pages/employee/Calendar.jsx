import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const EmployeeCalendar = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Calendar View</h1>
        <p className="intro-subtitle">
          View your schedule, attendance, leaves, and important dates in a calendar format.
        </p>

        <h2 id="overview">Calendar Overview</h2>
        <p>
          The Calendar View provides a visual representation of your schedule, including attendance, 
          leaves, holidays, and important dates.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📅"
            title="Monthly View"
            description="View your schedule by month"
          />
          <FeatureCard
            icon="✅"
            title="Attendance Marking"
            description="See your attendance marked on calendar"
          />
          <FeatureCard
            icon="🏖️"
            title="Leave Display"
            description="View approved and pending leaves"
          />
          <FeatureCard
            icon="🎉"
            title="Holidays"
            description="See company holidays marked"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default EmployeeCalendar;

