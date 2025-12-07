import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const EmployeeSchedules = () => {
  return (
    <FeatureDetailPage
      title="Employee Schedules"
      description="Manage and track employee schedules and shifts. Create work schedules, assign shifts, and track schedule adherence across the organization."
      icon={<FiCalendar />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Schedule Creation", description: "Create and manage work schedules for employees and teams." },
        { title: "Shift Management", description: "Assign shifts, manage rotations, and handle shift changes." },
        { title: "Calendar View", description: "Visual calendar view of all employee schedules." },
        { title: "Schedule Templates", description: "Use schedule templates for recurring patterns." },
        { title: "Schedule Conflicts", description: "Identify and resolve schedule conflicts automatically." },
        { title: "Shift Swapping", description: "Enable employees to swap shifts with approval workflow." },
        { title: "Schedule Notifications", description: "Notify employees about schedule changes and updates." },
        { title: "Compliance Tracking", description: "Track schedule compliance with labor regulations." }
      ]}
      benefits={[
        { title: "Better Planning", description: "Plan schedules effectively with visual tools and templates." },
        { title: "Reduced Conflicts", description: "Minimize scheduling conflicts with automated checks." },
        { title: "Improved Coverage", description: "Ensure proper coverage with optimized schedule management." }
      ]}
      useCases={[
        { title: "Shift Planning", description: "Plan and assign shifts for different departments and teams." },
        { title: "Schedule Optimization", description: "Optimize schedules for better resource utilization." },
        { title: "Compliance Management", description: "Ensure schedule compliance with labor laws and regulations." }
      ]}
    />
  );
};

export default EmployeeSchedules;


