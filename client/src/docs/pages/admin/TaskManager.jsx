import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminTaskManager = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Task Manager</h1>
        <p className="intro-subtitle">
          Create, assign, and track tasks across departments. Manage project tasks and 
          monitor task completion.
        </p>

        <h2 id="overview">Task Management</h2>
        <p>
          The Task Manager allows administrators to create tasks, assign them to employees, 
          track progress, and organize tasks by department or project.
        </p>

        <h2 id="features">Key Features</h2>
        <div className="features-grid">
          <FeatureCard
            icon="➕"
            title="Create Tasks"
            description="Create new tasks with descriptions and deadlines"
          />
          <FeatureCard
            icon="👤"
            title="Assign Tasks"
            description="Assign tasks to specific employees or departments"
          />
          <FeatureCard
            icon="📊"
            title="Track Progress"
            description="Monitor task status and completion"
          />
          <FeatureCard
            icon="🏷️"
            title="Organize Tasks"
            description="Organize tasks by status, department, or project"
          />
        </div>

        <h2 id="task-statuses">Task Statuses</h2>
        <ul>
          <li><strong>Backlog:</strong> Tasks not yet started</li>
          <li><strong>In Progress:</strong> Tasks currently being worked on</li>
          <li><strong>Done:</strong> Completed tasks</li>
        </ul>

        <h2 id="task-creation">Creating Tasks</h2>
        <p>To create a task:</p>
        <ol>
          <li>Navigate to Task Manager</li>
          <li>Click "Create Task"</li>
          <li>Enter task details (title, description, deadline)</li>
          <li>Assign to employee or department</li>
          <li>Set priority and status</li>
          <li>Save the task</li>
        </ol>
      </div>
    </DocsLayout>
  );
};

export default AdminTaskManager;

