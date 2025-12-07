import React from 'react';
import { FiUsers } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const UserManagement = () => {
  return (
    <FeatureDetailPage
      title="User Management"
      description="Complete user management with role-based access control. Create, manage, and control user accounts, permissions, and access levels across the organization."
      icon={<FiUsers />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "User Creation", description: "Create new user accounts with complete profile information." },
        { title: "Role Management", description: "Assign and manage user roles with specific permissions." },
        { title: "Access Control", description: "Control user access to different modules and features." },
        { title: "User Profiles", description: "Manage user profiles, information, and settings." },
        { title: "Bulk Operations", description: "Perform bulk operations like import, update, and activation." },
        { title: "User Status Management", description: "Activate, deactivate, or suspend user accounts." },
        { title: "Permission Templates", description: "Use permission templates for consistent role assignments." },
        { title: "Audit Trail", description: "Track all user management activities with audit logs." }
      ]}
      benefits={[
        { title: "Centralized Control", description: "Centralized control over all user accounts and access." },
        { title: "Security", description: "Enhanced security with role-based access control." },
        { title: "Efficiency", description: "Efficient user management with bulk operations and templates." }
      ]}
      statistics={[
        { number: 'Bulk', label: 'Operations' },
        { number: 'Role-based', label: 'Access' },
        { number: 'Secure', label: 'Management' }
      ]}
      integrations={[
        {
          name: 'Active Directory',
          description: 'Sync users with Active Directory',
          icon: 'api',
          status: 'available',
          link: '/docs/integrations/active-directory'
        },
        {
          name: 'LDAP',
          description: 'Integrate with LDAP directory services',
          icon: 'api',
          status: 'available',
          link: '/docs/integrations/ldap'
        },
        {
          name: 'SSO',
          description: 'Single Sign-On with SAML/OAuth',
          icon: 'security',
          status: 'available',
          link: '/docs/integrations/sso'
        },
        {
          name: 'Google Workspace',
          description: 'Sync users from Google Workspace',
          icon: 'google',
          status: 'available',
          link: '/docs/integrations/google-workspace'
        },
        {
          name: 'Microsoft 365',
          description: 'Import users from Microsoft 365',
          icon: 'microsoft',
          status: 'available',
          link: '/docs/integrations/microsoft-365'
        }
      ]}
      useCases={[
        { 
          title: "Employee Onboarding", 
          description: "Quickly create accounts for new employees during onboarding.",
          example: "When hiring 10 new employees, import their data from Excel or HR system and create all accounts with appropriate roles in bulk within minutes."
        },
        { 
          title: "Access Management", 
          description: "Manage access levels based on roles and responsibilities.",
          example: "Promote an employee to manager - the system automatically updates their access permissions based on the manager role template."
        },
        { 
          title: "User Lifecycle", 
          description: "Manage user accounts throughout their lifecycle in the organization.",
          example: "When an employee leaves, deactivate their account with one click - all access is revoked immediately and data is securely archived."
        }
      ]}
    />
  );
};

export default UserManagement;

