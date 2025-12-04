import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const ComponentsOverview = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Components Overview</h1>
        <p className="intro-subtitle">
          Worklogz uses a comprehensive component library built on Material-UI with custom components 
          for specific features. Explore all available components.
        </p>

        <h2 id="component-categories">Component Categories</h2>
        <div className="features-grid">
          <FeatureCard
            icon="⚡"
            title="Action Components"
            description="Buttons, icon buttons, FABs, and other interactive elements"
          />
          <FeatureCard
            icon="📝"
            title="Form Components"
            description="Inputs, selects, checkboxes, switches, and form controls"
          />
          <FeatureCard
            icon="🎨"
            title="Display Components"
            description="Cards, chips, badges, avatars, and typography"
          />
          <FeatureCard
            icon="🧭"
            title="Navigation Components"
            description="Tabs, breadcrumbs, drawers, and steppers"
          />
          <FeatureCard
            icon="💬"
            title="Feedback Components"
            description="Alerts, snackbars, progress indicators, and tooltips"
          />
          <FeatureCard
            icon="🎭"
            title="Overlay Components"
            description="Dialogs, modals, and accordions"
          />
          <FeatureCard
            icon="📐"
            title="Layout Components"
            description="Grid, container, stack, paper, and divider"
          />
          <FeatureCard
            icon="🚀"
            title="Custom Components"
            description="Worklogz-specific components for attendance, payroll, and more"
          />
        </div>

        <h2 id="material-ui">Material-UI Components</h2>
        <p>
          Worklogz is built on Material-UI (MUI), providing a comprehensive set of production-ready 
          components that follow Google's Material Design guidelines.
        </p>

        <h2 id="custom-components">Custom Components</h2>
        <p>
          In addition to Material-UI components, Worklogz includes custom components specifically 
          designed for workforce management features:
        </p>
        <ul>
          <li><strong>Attendance Components:</strong> AttendanceCards, ProfileHeader, DateStrip, TodayAttendance</li>
          <li><strong>Employee Components:</strong> QuickAccessCard, EmployeeNavigation</li>
          <li><strong>Admin Components:</strong> DashboardCards, Analytics widgets, CRM components</li>
          <li><strong>Payroll Components:</strong> Salary displays, payslip components</li>
        </ul>

        <h2 id="component-showcase">Component Showcase</h2>
        <p>
          Visit the <a href="/docs/components/showcase">Component Showcase</a> page to see all 
          60+ components in action with live examples and code snippets.
        </p>

        <h2 id="usage">Usage Guidelines</h2>
        <ul>
          <li>Import components from their respective libraries</li>
          <li>Follow Material Design principles for consistency</li>
          <li>Use custom components for Worklogz-specific features</li>
          <li>Maintain accessibility standards</li>
          <li>Ensure responsive design across all components</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default ComponentsOverview;

