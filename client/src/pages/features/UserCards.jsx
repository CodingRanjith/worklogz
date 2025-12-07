import React from 'react';
import { FiFileText } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const UserCards = () => {
  return (
    <FeatureDetailPage
      title="User Cards"
      description="View and manage employee cards and profiles. Access comprehensive employee information, contact details, and professional history in card format."
      icon={<FiFileText />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Employee Card View", description: "View employee information in organized card format." },
        { title: "Profile Information", description: "Access complete profile information including contact details." },
        { title: "Employment History", description: "View employment history, roles, and career progression." },
        { title: "Skills & Certifications", description: "View employee skills, certifications, and qualifications." },
        { title: "Performance Summary", description: "Quick view of performance metrics and achievements." },
        { title: "Document Access", description: "Access employee documents and attachments from cards." },
        { title: "Contact Information", description: "Quick access to contact information and communication channels." },
        { title: "Quick Actions", description: "Perform quick actions like view timesheet, attendance, etc." }
      ]}
      benefits={[
        { title: "Quick Access", description: "Quick access to employee information in organized format." },
        { title: "Better Overview", description: "Get comprehensive overview of employees at a glance." },
        { title: "Efficient Management", description: "Manage employee information efficiently from cards." }
      ]}
      useCases={[
        { title: "Employee Lookup", description: "Quickly lookup employee information and contact details." },
        { title: "Profile Review", description: "Review employee profiles for assignments and projects." },
        { title: "Quick Reference", description: "Use cards as quick reference for employee details." }
      ]}
    />
  );
};

export default UserCards;


