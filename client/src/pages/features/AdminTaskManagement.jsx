import React from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AdminTaskManagement = () => {
  return (
    <FeatureDetailPage
      title="Admin Task Management"
      description="Manage and assign tasks across the organization. Create tasks, assign to employees, track progress, and ensure timely completion of organizational tasks."
      icon={<FiCheckSquare />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Task Creation", description: "Create tasks with detailed descriptions, priorities, and deadlines." },
        { title: "Task Assignment", description: "Assign tasks to employees, teams, or departments." },
        { title: "Progress Tracking", description: "Track task progress and completion status in real-time." },
        { title: "Task Priorities", description: "Set and manage task priorities for better organization." },
        { title: "Task Dependencies", description: "Define task dependencies and relationships." },
        { title: "Bulk Task Operations", description: "Create and manage multiple tasks in bulk." },
        { title: "Task Templates", description: "Use task templates for recurring task patterns." },
        { title: "Task Reports", description: "Generate reports on task completion and performance." }
      ]}
      benefits={[
        { title: "Better Coordination", description: "Coordinate tasks across the organization effectively." },
        { title: "Clear Accountability", description: "Ensure clear accountability for task completion." },
        { title: "Improved Visibility", description: "Better visibility of organizational tasks and progress." }
      ]}
      useCases={[
        { title: "Project Management", description: "Manage project tasks and track organizational progress." },
        { title: "Work Distribution", description: "Distribute work effectively across teams and departments." },
        { title: "Performance Tracking", description: "Track task completion for performance evaluation." }
      ]}
    />
  );
};

export default AdminTaskManagement;


