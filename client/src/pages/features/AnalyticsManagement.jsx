import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AnalyticsManagement = () => {
  return (
    <FeatureDetailPage
      title="Analytics Management"
      description="Advanced analytics and data visualization tools. Gain deep insights into organizational performance, trends, and patterns with comprehensive analytics."
      icon={<FiTrendingUp />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Advanced Reporting", description: "Create detailed reports with custom metrics and dimensions." },
        { title: "Data Visualization", description: "Visualize data with charts, graphs, and interactive dashboards." },
        { title: "Trend Analysis", description: "Analyze trends and patterns over time periods." },
        { title: "Comparative Analytics", description: "Compare performance across departments, teams, and periods." },
        { title: "Predictive Analytics", description: "Get predictive insights and forecasting capabilities." },
        { title: "Custom Metrics", description: "Define and track custom metrics and KPIs." },
        { title: "Data Export", description: "Export analytics data in various formats for external analysis." },
        { title: "Scheduled Reports", description: "Schedule automatic report generation and distribution." }
      ]}
      benefits={[
        { title: "Deep Insights", description: "Gain deep insights into organizational performance and trends." },
        { title: "Informed Decisions", description: "Make data-driven decisions with comprehensive analytics." },
        { title: "Performance Optimization", description: "Identify areas for improvement and optimization." }
      ]}
      statistics={[
        { number: 'Real-time', label: 'Analytics' },
        { number: 'Custom', label: 'Reports' },
        { number: 'Deep', label: 'Insights' }
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
          description: 'Export data to Power BI for advanced visualization',
          icon: 'analytics',
          status: 'available',
          link: '/docs/integrations/power-bi'
        },
        {
          name: 'Tableau',
          description: 'Connect with Tableau for business intelligence',
          icon: 'analytics',
          status: 'available',
          link: '/docs/integrations/tableau'
        },
        {
          name: 'Excel Export',
          description: 'Export analytics data to Excel',
          icon: 'documents',
          status: 'available',
          link: '/docs/features/excel-export'
        },
        {
          name: 'API Access',
          description: 'Access analytics data via REST API',
          icon: 'api',
          status: 'available',
          link: '/docs/api/analytics'
        }
      ]}
      useCases={[
        { 
          title: "Performance Analysis", 
          description: "Analyze performance metrics across different dimensions.",
          example: "Compare department performance over the last quarter using interactive charts - identify top performers and areas needing improvement."
        },
        { 
          title: "Trend Forecasting", 
          description: "Forecast future trends based on historical data.",
          example: "Predict next month's attendance patterns based on last 6 months of data to optimize workforce planning."
        },
        { 
          title: "Strategic Planning", 
          description: "Use analytics for strategic planning and goal setting.",
          example: "Use analytics insights to set realistic quarterly goals based on historical performance trends and capacity."
        }
      ]}
    />
  );
};

export default AnalyticsManagement;

