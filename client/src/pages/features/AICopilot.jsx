import React from 'react';
import { FiZap } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const AICopilot = () => {
  return (
    <FeatureDetailPage
      title="AI Copilot"
      description="Get AI-powered assistance for tasks, queries, and productivity. Leverage artificial intelligence to enhance your work efficiency and get instant help."
      icon={<FiZap />}
      image={null}
      moduleType="User"
      features={[
        { title: "AI Chat Assistant", description: "Interact with AI assistant for instant answers and help." },
        { title: "Task Automation", description: "Automate repetitive tasks with AI-powered suggestions." },
        { title: "Smart Recommendations", description: "Get intelligent recommendations for tasks and decisions." },
        { title: "Document Generation", description: "Generate documents, reports, and content with AI assistance." },
        { title: "Data Analysis", description: "Analyze data and get insights with AI-powered analytics." },
        { title: "Language Translation", description: "Translate content across multiple languages instantly." },
        { title: "Code Assistance", description: "Get help with code snippets and programming queries." },
        { title: "Learning Support", description: "Learn new skills with AI-powered tutorials and guidance." }
      ]}
      benefits={[
        { title: "Increased Productivity", description: "Complete tasks faster with AI assistance." },
        { title: "Smart Solutions", description: "Get intelligent solutions and recommendations." },
        { title: "24/7 Support", description: "Access AI assistance anytime, anywhere." }
      ]}
      statistics={[
        { number: '24/7', label: 'AI Available' },
        { number: 'Instant', label: 'Response Time' },
        { number: 'Smart', label: 'Assistance' }
      ]}
      integrations={[
        {
          name: 'OpenAI',
          description: 'Powered by advanced AI models',
          icon: 'api',
          status: 'available',
          link: '/docs/integrations/ai'
        },
        {
          name: 'Slack',
          description: 'AI assistant in Slack channels',
          icon: 'slack',
          status: 'available',
          link: '/docs/integrations/slack-ai'
        },
        {
          name: 'Microsoft Teams',
          description: 'AI copilot in Teams workspace',
          icon: 'microsoft',
          status: 'available',
          link: '/docs/integrations/teams-ai'
        },
        {
          name: 'API Access',
          description: 'Integrate AI via REST API',
          icon: 'api',
          status: 'available',
          link: '/docs/api/ai'
        }
      ]}
      useCases={[
        { 
          title: "Quick Queries", 
          description: "Get instant answers to work-related queries.",
          example: "Ask 'What are my pending tasks?' and get an instant summary of all your assignments."
        },
        { 
          title: "Content Creation", 
          description: "Generate content, reports, and documents quickly.",
          example: "Request 'Create a quarterly report template' and get a professionally formatted document ready to use."
        },
        { 
          title: "Skill Development", 
          description: "Learn new skills and get guidance on tasks.",
          example: "Ask 'How do I use the attendance feature?' and receive step-by-step guidance with examples."
        }
      ]}
    />
  );
};

export default AICopilot;

