import React from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const TaskManager = () => {
  return (
    <FeatureDetailPage
      title="Task Manager"
      description="Personal task management with priorities, deadlines, and progress tracking. Organize your work efficiently and stay on top of your responsibilities."
      icon={<FiCheckSquare />}
      image={null}
      moduleType="User"
      features={[
        { title: "Task Creation", description: "Create tasks with titles, descriptions, priorities, and due dates." },
        { title: "Priority Management", description: "Set task priorities (High, Medium, Low) for better organization." },
        { title: "Deadline Tracking", description: "Set and track deadlines with reminders and notifications." },
        { title: "Progress Tracking", description: "Track task progress with status updates and completion percentages." },
        { title: "Task Categories", description: "Organize tasks into categories and projects for better management." },
        { title: "Subtasks", description: "Break down complex tasks into smaller, manageable subtasks." },
        { title: "Notes & Attachments", description: "Add notes and attach files to tasks for detailed information." },
        { title: "Task Calendar", description: "View tasks in calendar format for better time management." }
      ]}
      benefits={[
        { title: "Better Organization", description: "Keep all your tasks organized in one place with clear priorities." },
        { title: "Improved Productivity", description: "Focus on high-priority tasks and meet deadlines effectively." },
        { title: "Time Management", description: "Plan your day better with clear task visibility and deadlines." }
      ]}
      statistics={[
        { number: 'Smart', label: 'Organization' },
        { number: 'Real-time', label: 'Updates' },
        { number: 'Efficient', label: 'Tracking' }
      ]}
      integrations={[
        {
          name: 'Slack',
          description: 'Get task notifications in Slack',
          icon: 'slack',
          status: 'available',
          link: '/docs/integrations/slack'
        },
        {
          name: 'Microsoft Teams',
          description: 'Sync tasks with Teams',
          icon: 'microsoft',
          status: 'available',
          link: '/docs/integrations/microsoft-teams'
        },
        {
          name: 'Google Calendar',
          description: 'Sync task deadlines with Google Calendar',
          icon: 'calendar',
          status: 'available',
          link: '/docs/integrations/google-calendar'
        },
        {
          name: 'Zapier',
          description: 'Connect tasks with 3000+ apps',
          icon: 'zapier',
          status: 'available',
          link: '/docs/integrations/zapier'
        },
        {
          name: 'Email',
          description: 'Receive task reminders via email',
          icon: 'email',
          status: 'available',
          link: '/docs/features/email-notifications'
        }
      ]}
      useCases={[
        { 
          title: "Daily Planning", 
          description: "Plan your daily activities and track progress throughout the day.",
          example: "Start your day by reviewing 5 priority tasks. As you complete each task, mark it done and see your progress bar fill up in real-time."
        },
        { 
          title: "Project Tracking", 
          description: "Manage project-related tasks and track milestones effectively.",
          example: "Break down a project into 20 subtasks, assign them to team members, and track completion percentage as the project progresses."
        },
        { 
          title: "Personal Goals", 
          description: "Set and track personal development goals and objectives.",
          example: "Set a goal to 'Learn Python in 3 months' with weekly tasks. Track your progress and get reminders to stay on track."
        }
      ]}
    />
  );
};

export default TaskManager;

