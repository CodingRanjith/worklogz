import React from 'react';
import { FiClock } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AttendanceManagement = () => {
  return (
    <FeatureDetailPage
      title="Attendance Management"
      description="Real-time attendance tracking with camera verification, location tracking, and flexible work modes. Track your work hours accurately with automated check-in and check-out."
      icon={<FiClock />}
      image={null}
      moduleType="User"
      features={[
        {
          title: "Real-Time Check-In/Check-Out",
          description: "Instant check-in and check-out with photo capture and timestamp recording."
        },
        {
          title: "Camera Verification",
          description: "Automatic photo capture during check-in/out for verification and security."
        },
        {
          title: "Location Tracking",
          description: "GPS-based location tracking to ensure attendance from correct location."
        },
        {
          title: "Work Mode Selection",
          description: "Support for Office, Remote, and Hybrid work modes with appropriate tracking."
        },
        {
          title: "Weekly Hours Tracking",
          description: "Automatic calculation of weekly working hours and overtime."
        },
        {
          title: "Daily Earnings Calculation",
          description: "Real-time calculation of daily earnings based on hours worked."
        },
        {
          title: "Attendance Calendar",
          description: "Visual calendar view showing attendance history with color coding."
        },
        {
          title: "Leave Integration",
          description: "Seamless integration with leave management for accurate attendance records."
        }
      ]}
      benefits={[
        {
          title: "Accurate Tracking",
          description: "Eliminate manual errors with automated attendance tracking."
        },
        {
          title: "Transparency",
          description: "Clear visibility of attendance records for both employees and management."
        },
        {
          title: "Flexibility",
          description: "Support for different work modes and remote working scenarios."
        }
      ]}
      statistics={[
        { number: '99.9%', label: 'Accuracy Rate' },
        { number: 'Real-time', label: 'Tracking' },
        { number: '24/7', label: 'Monitoring' }
      ]}
      integrations={[
        {
          name: 'Slack',
          description: 'Get attendance notifications in Slack channels',
          icon: 'slack',
          status: 'available',
          link: '/docs/integrations/slack'
        },
        {
          name: 'Google Calendar',
          description: 'Sync attendance with Google Calendar events',
          icon: 'calendar',
          status: 'available',
          link: '/docs/integrations/google-calendar'
        },
        {
          name: 'Microsoft Teams',
          description: 'Integrate attendance with Microsoft Teams',
          icon: 'microsoft',
          status: 'available',
          link: '/docs/integrations/microsoft-teams'
        },
        {
          name: 'Zapier',
          description: 'Connect with 3000+ apps via Zapier',
          icon: 'zapier',
          status: 'available',
          link: '/docs/integrations/zapier'
        },
        {
          name: 'API Access',
          description: 'Custom integrations via REST API',
          icon: 'api',
          status: 'available',
          link: '/docs/api'
        }
      ]}
      useCases={[
        {
          title: "Remote Work Tracking",
          description: "Employees working from home can easily check-in and track their hours remotely.",
          example: "A remote employee in New York can check-in at 9 AM, and the system automatically records the location and time."
        },
        {
          title: "Field Work Management",
          description: "Field employees can check-in from different locations with GPS verification.",
          example: "A field service technician checks in at a client site, and the GPS coordinates are automatically captured."
        },
        {
          title: "Overtime Calculation",
          description: "Automatic calculation of overtime hours for accurate payroll processing.",
          example: "If an employee works 9 hours, the system automatically calculates 1 hour of overtime."
        }
      ]}
    />
  );
};

export default AttendanceManagement;

