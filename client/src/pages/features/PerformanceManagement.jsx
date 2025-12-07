import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const PerformanceManagement = () => {
  return (
    <FeatureDetailPage
      title="Performance Management"
      description="Track performance metrics, goals, and achievements. Monitor your progress, receive feedback, and work towards continuous improvement."
      icon={<FiTrendingUp />}
      image={null}
      moduleType="User"
      features={[
        { title: "Goal Setting", description: "Set and track personal and professional goals with clear milestones." },
        { title: "Performance Metrics", description: "View key performance indicators and metrics in real-time." },
        { title: "Performance Reviews", description: "Access performance review reports and feedback from managers." },
        { title: "Achievement Tracking", description: "Track achievements, accomplishments, and career milestones." },
        { title: "Feedback System", description: "Receive and provide feedback for continuous improvement." },
        { title: "Skill Assessments", description: "Take skill assessments and track skill development over time." },
        { title: "Performance Dashboard", description: "Visual dashboard showing performance trends and insights." },
        { title: "Development Plans", description: "Create and follow personal development plans for career growth." }
      ]}
      benefits={[
        { title: "Clear Visibility", description: "Understand your performance clearly with detailed metrics and feedback." },
        { title: "Goal Achievement", description: "Stay focused on goals with tracking and milestone management." },
        { title: "Career Growth", description: "Identify areas for improvement and work towards career advancement." }
      ]}
      useCases={[
        { title: "Goal Tracking", description: "Set quarterly goals and track progress throughout the period." },
        { title: "Performance Reviews", description: "Prepare for performance reviews with complete performance history." },
        { title: "Skill Development", description: "Identify skill gaps and work on development plans for improvement." }
      ]}
    />
  );
};

export default PerformanceManagement;

