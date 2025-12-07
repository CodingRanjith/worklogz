import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AdminDashboard = () => {
  return (
    <FeatureDetailPage
      title="Admin Dashboard"
      description="Comprehensive dashboard with key metrics and insights. Monitor organizational performance, track KPIs, and make data-driven decisions."
      icon={<FiBarChart2 />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Key Metrics Overview", description: "View important organizational metrics at a glance." },
        { title: "Real-Time Analytics", description: "Access real-time analytics and performance data." },
        { title: "Customizable Widgets", description: "Customize dashboard with relevant widgets and charts." },
        { title: "Performance Indicators", description: "Track key performance indicators across departments." },
        { title: "Quick Actions", description: "Quick access to common admin actions and functions." },
        { title: "Activity Feed", description: "Monitor recent activities and updates across the organization." },
        { title: "Trend Analysis", description: "Analyze trends and patterns in organizational data." },
        { title: "Export Reports", description: "Export dashboard data and reports in various formats." }
      ]}
      benefits={[
        { title: "Data-Driven Decisions", description: "Make informed decisions based on real-time data and insights." },
        { title: "Quick Overview", description: "Get quick overview of organizational performance at a glance." },
        { title: "Efficient Management", description: "Manage operations efficiently with centralized dashboard." }
      ]}
      statistics={[
        { number: 'Real-time', label: 'Data Updates' },
        { number: '360°', label: 'View' },
        { number: 'Custom', label: 'Dashboards' }
      ]}
      integrations={[
        {
          name: 'Google Analytics',
          description: 'Import data from Google Analytics',
          icon: 'analytics',
          status: 'available',
          link: '/docs/integrations/google-analytics'
        },
        {
          name: 'Power BI',
          description: 'Export data to Power BI',
          icon: 'analytics',
          status: 'available',
          link: '/docs/integrations/power-bi'
        },
        {
          name: 'Tableau',
          description: 'Connect with Tableau for advanced analytics',
          icon: 'analytics',
          status: 'available',
          link: '/docs/integrations/tableau'
        },
        {
          name: 'API Access',
          description: 'Custom integrations via REST API',
          icon: 'api',
          status: 'available',
          link: '/docs/api'
        },
        {
          name: 'Excel Export',
          description: 'Export dashboard data to Excel',
          icon: 'documents',
          status: 'available',
          link: '/docs/features/excel-export'
        }
      ]}
      useCases={[
        { 
          title: "Daily Monitoring", 
          description: "Monitor daily operations and key metrics regularly.",
          example: "View real-time employee attendance, project status, and performance metrics all in one dashboard at 9 AM daily."
        },
        { 
          title: "Performance Tracking", 
          description: "Track organizational performance against targets and goals.",
          example: "Compare this month's revenue against targets with visual charts and get alerts when metrics drop below threshold."
        },
        { 
          title: "Executive Reporting", 
          description: "Generate executive reports with dashboard insights.",
          example: "Export a comprehensive PDF report with all key metrics for the board meeting with one click."
        }
      ]}
    />
  );
};

export default AdminDashboard;

