import React from 'react';
import { FiMail } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const MailIntegration = () => {
  return (
    <FeatureDetailPage
      title="Mail Integration"
      description="Integrate email services for seamless communication. Connect your email accounts, send emails from the platform, and manage communications efficiently."
      icon={<FiMail />}
      image={null}
      moduleType="User"
      features={[
        { title: "Email Integration", description: "Connect multiple email accounts (Gmail, Outlook, etc.) with the platform." },
        { title: "Inbox Management", description: "View and manage emails directly from the platform." },
        { title: "Email Composer", description: "Compose and send emails without leaving the platform." },
        { title: "Email Notifications", description: "Get notifications for important emails and messages." },
        { title: "Email Templates", description: "Use email templates for common communications." },
        { title: "Attachment Handling", description: "Attach files from platform storage to emails." },
        { title: "Email Search", description: "Search emails across integrated accounts." },
        { title: "Email Synchronization", description: "Automatic synchronization of emails across devices." }
      ]}
      benefits={[
        { title: "Unified Communication", description: "Manage all communications from one platform." },
        { title: "Improved Productivity", description: "Save time by managing emails within the platform." },
        { title: "Better Organization", description: "Organize communications with integrated email management." }
      ]}
      statistics={[
        { number: 'Unified', label: 'Inbox' },
        { number: 'Real-time', label: 'Sync' },
        { number: 'Secure', label: 'Connection' }
      ]}
      integrations={[
        {
          name: 'Gmail',
          description: 'Connect your Gmail account',
          icon: 'email',
          status: 'available',
          link: '/docs/integrations/gmail'
        },
        {
          name: 'Outlook',
          description: 'Integrate with Microsoft Outlook',
          icon: 'email',
          status: 'available',
          link: '/docs/integrations/outlook'
        },
        {
          name: 'Yahoo Mail',
          description: 'Connect Yahoo Mail account',
          icon: 'email',
          status: 'available',
          link: '/docs/integrations/yahoo'
        },
        {
          name: 'IMAP/SMTP',
          description: 'Connect any email via IMAP/SMTP',
          icon: 'api',
          status: 'available',
          link: '/docs/integrations/imap'
        },
        {
          name: 'Email Templates',
          description: 'Use pre-built email templates',
          icon: 'documents',
          status: 'available',
          link: '/docs/features/email-templates'
        }
      ]}
      useCases={[
        { 
          title: "Internal Communication", 
          description: "Send and receive internal emails directly from the platform.",
          example: "Send a team update email to 50 employees directly from Worklogz - no need to switch to your email client."
        },
        { 
          title: "Client Communication", 
          description: "Manage client communications with integrated email.",
          example: "Reply to a client email about project status without leaving the platform - all client communications in one place."
        },
        { 
          title: "Team Coordination", 
          description: "Coordinate with team members through integrated email.",
          example: "Send task reminders and updates via email templates - automatically track who opened and responded."
        }
      ]}
    />
  );
};

export default MailIntegration;

