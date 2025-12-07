import React from 'react';
import { FiFileText } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const DocumentManagement = () => {
  return (
    <FeatureDetailPage
      title="Document Management"
      description="Generate and manage offer letters, experience letters, and policy documents. Create professional documents, manage templates, and handle document workflows efficiently."
      icon={<FiFileText />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Document Generation", description: "Generate offer letters, experience letters, and relieving letters automatically." },
        { title: "Template Management", description: "Create and manage document templates for different purposes." },
        { title: "Policy Documents", description: "Upload and manage company policy documents." },
        { title: "Document Workflows", description: "Configure document approval and signing workflows." },
        { title: "Digital Signatures", description: "Enable digital signatures for document approval." },
        { title: "Document Versioning", description: "Track document versions and revisions." },
        { title: "Bulk Generation", description: "Generate multiple documents in bulk operations." },
        { title: "Document Storage", description: "Secure storage and organization of all generated documents." }
      ]}
      benefits={[
        { title: "Professional Documents", description: "Generate professional documents automatically." },
        { title: "Time Savings", description: "Save time with automated document generation." },
        { title: "Consistency", description: "Ensure consistency in document format and content." }
      ]}
      statistics={[
        { number: 'Auto', label: 'Generation' },
        { number: 'Secure', label: 'Storage' },
        { number: 'Digital', label: 'Signatures' }
      ]}
      integrations={[
        {
          name: 'DocuSign',
          description: 'Electronic signatures with DocuSign',
          icon: 'documents',
          status: 'available',
          link: '/docs/integrations/docusign'
        },
        {
          name: 'Google Drive',
          description: 'Store documents in Google Drive',
          icon: 'google',
          status: 'available',
          link: '/docs/integrations/google-drive'
        },
        {
          name: 'Dropbox',
          description: 'Sync documents with Dropbox',
          icon: 'dropbox',
          status: 'available',
          link: '/docs/integrations/dropbox'
        },
        {
          name: 'OneDrive',
          description: 'Save documents to OneDrive',
          icon: 'microsoft',
          status: 'available',
          link: '/docs/integrations/onedrive'
        },
        {
          name: 'Email',
          description: 'Send documents directly via email',
          icon: 'email',
          status: 'available',
          link: '/docs/features/email-integration'
        }
      ]}
      useCases={[
        { 
          title: "Employee Onboarding", 
          description: "Generate offer letters and onboarding documents automatically.",
          example: "When hiring a new employee, automatically generate offer letter, contract, and onboarding documents with their details filled in - ready to sign in minutes."
        },
        { 
          title: "Exit Process", 
          description: "Generate experience and relieving letters during exit process.",
          example: "During employee exit, generate experience certificate and relieving letter automatically with their service duration and achievements."
        },
        { 
          title: "Policy Communication", 
          description: "Share and manage company policy documents effectively.",
          example: "Update company policy document and automatically notify all employees via email with the new version attached."
        }
      ]}
    />
  );
};

export default DocumentManagement;

