import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AdminPerformanceManagement = () => {
  return (
    <FeatureDetailPage
      title="Performance Management"
      description="Track and manage employee performance metrics. Conduct performance reviews, set goals, track achievements, and drive performance improvement across the organization."
      icon={<FiTrendingUp />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Performance Reviews", description: "Conduct and manage performance review cycles." },
        { title: "Goal Setting", description: "Set and track organizational and individual goals." },
        { title: "KPI Tracking", description: "Track key performance indicators for employees and teams." },
        { title: "Performance Metrics", description: "Define and track custom performance metrics." },
        { title: "360-Degree Reviews", description: "Conduct 360-degree feedback and review processes." },
        { title: "Performance Analytics", description: "Analyze performance trends and patterns." },
        { title: "Development Plans", description: "Create and track employee development plans." },
        { title: "Performance Reports", description: "Generate comprehensive performance reports and insights." }
      ]}
      benefits={[
        { title: "Better Performance", description: "Drive better performance with structured management." },
        { title: "Employee Development", description: "Support employee development and career growth." },
        { title: "Data-Driven Decisions", description: "Make decisions based on performance data and insights." }
      ]}
      useCases={[
        { title: "Performance Reviews", description: "Conduct regular performance reviews and evaluations." },
        { title: "Goal Management", description: "Set and track goals for employees and teams." },
        { title: "Development Planning", description: "Create development plans based on performance insights." }
      ]}
    />
  );
};

export default AdminPerformanceManagement;


