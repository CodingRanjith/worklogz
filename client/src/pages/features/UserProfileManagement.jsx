import React from 'react';
import { FiUser } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const UserProfileManagement = () => {
  return (
    <FeatureDetailPage
      title="User Profile Management"
      description="Complete profile management with personal information, skills, preferences, and professional details. Keep your profile updated and showcase your expertise."
      icon={<FiUser />}
      image={null}
      moduleType="User"
      features={[
        {
          title: "Personal Information",
          description: "Manage your personal details including name, email, phone, address, and emergency contacts."
        },
        {
          title: "Professional Details",
          description: "Update job title, department, reporting manager, and employment history."
        },
        {
          title: "Skills & Expertise",
          description: "Add and manage your skills, certifications, and areas of expertise."
        },
        {
          title: "Profile Photo",
          description: "Upload and manage your profile picture with image cropping and optimization."
        },
        {
          title: "Preferences & Settings",
          description: "Configure notification preferences, language settings, and privacy options."
        },
        {
          title: "Document Attachments",
          description: "Attach and manage professional documents like resumes, certificates, and ID proofs."
        }
      ]}
      benefits={[
        {
          title: "Complete Control",
          description: "Full control over your profile information and visibility settings."
        },
        {
          title: "Professional Presence",
          description: "Maintain a professional profile that represents your expertise accurately."
        },
        {
          title: "Easy Updates",
          description: "Quick and easy profile updates from anywhere, anytime."
        }
      ]}
      useCases={[
        {
          title: "Employee Onboarding",
          description: "New employees can quickly set up their profiles with all necessary information during onboarding."
        },
        {
          title: "Skill Showcase",
          description: "Employees can showcase their skills and expertise to help with project assignments and career development."
        },
        {
          title: "Team Collaboration",
          description: "Team members can view each other's profiles to understand expertise and improve collaboration."
        }
      ]}
    />
  );
};

export default UserProfileManagement;


