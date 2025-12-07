import React from 'react';
import { FiFileText } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const DocumentCenterManagement = () => {
  return (
    <FeatureDetailPage
      title="Document Center Management"
      description="Access and manage all your documents in one centralized location. Store, organize, and retrieve important documents efficiently."
      icon={<FiFileText />}
      image={null}
      moduleType="User"
      features={[
        { title: "Document Storage", description: "Centralized storage for all your documents with secure cloud backup." },
        { title: "Document Organization", description: "Organize documents into folders and categories for easy access." },
        { title: "Quick Search", description: "Powerful search functionality to find documents quickly." },
        { title: "Document Sharing", description: "Share documents with team members with permission controls." },
        { title: "Version Control", description: "Track document versions and access revision history." },
        { title: "Document Preview", description: "Preview documents without downloading them first." },
        { title: "Access Control", description: "Control document access with permissions and sharing settings." },
        { title: "Document Templates", description: "Access and use document templates for common use cases." }
      ]}
      benefits={[
        { title: "Centralized Access", description: "All your documents in one place for easy access." },
        { title: "Better Organization", description: "Organize documents efficiently for quick retrieval." },
        { title: "Secure Storage", description: "Secure cloud storage with backup and recovery options." }
      ]}
      useCases={[
        { title: "Personal Documents", description: "Store and access personal documents like certificates and IDs." },
        { title: "Project Documents", description: "Manage project-related documents and resources." },
        { title: "Shared Resources", description: "Access shared documents from teams and departments." }
      ]}
    />
  );
};

export default DocumentCenterManagement;

