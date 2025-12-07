import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const Helpdesk = () => {
  return (
    <FeatureDetailPage
      title="Helpdesk"
      description="Submit tickets and get support for your queries and issues. Track ticket status, communicate with support, and resolve issues quickly."
      icon={<FiHelpCircle />}
      image={null}
      moduleType="User"
      features={[
        { title: "Ticket Creation", description: "Create support tickets with detailed descriptions and attachments." },
        { title: "Ticket Tracking", description: "Track ticket status and updates in real-time." },
        { title: "Priority Management", description: "Set ticket priorities for urgent issues." },
        { title: "Category Selection", description: "Categorize tickets for better routing and resolution." },
        { title: "Communication Thread", description: "Communicate with support team through ticket threads." },
        { title: "Knowledge Base", description: "Access knowledge base articles for self-service support." },
        { title: "Ticket History", description: "View complete history of all tickets and resolutions." },
        { title: "SLA Tracking", description: "Track service level agreements and response times." }
      ]}
      benefits={[
        { title: "Quick Resolution", description: "Get issues resolved quickly through organized ticketing system." },
        { title: "Clear Communication", description: "Clear communication channel with support team." },
        { title: "Self-Service", description: "Access knowledge base for quick self-service solutions." }
      ]}
      useCases={[
        { title: "Technical Issues", description: "Report technical issues and get timely support." },
        { title: "Account Queries", description: "Get help with account-related queries and settings." },
        { title: "Feature Requests", description: "Submit feature requests and suggestions for improvement." }
      ]}
    />
  );
};

export default Helpdesk;


