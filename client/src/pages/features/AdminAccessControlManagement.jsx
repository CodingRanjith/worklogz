import React from 'react';
import { FiUnlock } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AdminAccessControlManagement = () => {
  return (
    <FeatureDetailPage
      title="Admin Access Control Management"
      description="Manage access controls and permissions across the system. Define roles, set permissions, control feature access, and ensure secure access management."
      icon={<FiUnlock />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Role Management", description: "Create and manage roles with specific permission sets." },
        { title: "Permission Configuration", description: "Configure granular permissions for different modules and features." },
        { title: "Access Policies", description: "Define access policies and rules for different user groups." },
        { title: "Feature Access Control", description: "Control access to features based on roles and permissions." },
        { title: "Data Access Control", description: "Control data access based on departments, teams, and roles." },
        { title: "Permission Templates", description: "Use permission templates for consistent role configurations." },
        { title: "Audit Logs", description: "Track all access control changes with comprehensive audit logs." },
        { title: "Multi-Level Permissions", description: "Configure multi-level permissions and hierarchies." }
      ]}
      benefits={[
        { title: "Enhanced Security", description: "Enhance security with granular access controls." },
        { title: "Compliance", description: "Maintain compliance with access control requirements." },
        { title: "Flexible Control", description: "Flexible control over system access and permissions." }
      ]}
      useCases={[
        { title: "Role Configuration", description: "Configure roles and permissions for different user types." },
        { title: "Security Management", description: "Manage security through access control policies." },
        { title: "Compliance", description: "Ensure compliance with security and access regulations." }
      ]}
    />
  );
};

export default AdminAccessControlManagement;

