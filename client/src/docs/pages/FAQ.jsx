import React from 'react';
import DocsLayout from './DocsLayout';
import CodeBlock from '../components/CodeBlock';
import './Introduction.css';

const FAQ = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>FAQ Section</h1>
        <p className="intro-subtitle">
          Common questions from buyers or white-label partners.
        </p>

        <h2 id="general-questions">General Questions</h2>
        
        <h3>What is Worklogz?</h3>
        <p>
          Worklogz is a comprehensive workforce management platform that handles attendance tracking, 
          timesheets, payroll, project management, CRM, and more in a single integrated solution.
        </p>

        <h3>Who can use Worklogz?</h3>
        <p>
          Worklogz is suitable for organizations of all sizes and industries including EdTech, IT 
          services, agencies, manufacturing, healthcare, construction, remote teams, and freelancers.
        </p>

        <h2 id="pricing-questions">Pricing Questions</h2>
        
        <h3>What pricing plans are available?</h3>
        <p>
          We offer flexible pricing including per-user plans, monthly subscriptions, lifetime licenses, 
          and custom enterprise packages. Contact us for detailed pricing information.
        </p>

        <h3>Is there a free trial?</h3>
        <p>
          Yes, we offer a free trial period. Contact our sales team to set up your trial account.
        </p>

        <h2 id="technical-questions">Technical Questions</h2>
        
        <h3>Can I self-host Worklogz?</h3>
        <p>
          Yes, Worklogz can be self-hosted on your own infrastructure. We provide complete 
          installation documentation and support for self-hosted deployments.
        </p>

        <h3>What are the system requirements?</h3>
        <p>
          Minimum requirements include Node.js 16+, MongoDB 4.4+, and a modern web server. 
          See our deployment documentation for detailed requirements.
        </p>

        <h2 id="feature-questions">Feature Questions</h2>
        
        <h3>Does Worklogz support mobile devices?</h3>
        <p>
          Yes, Worklogz is fully responsive and works on mobile devices. A dedicated mobile 
          app is coming soon.
        </p>

        <h3>Can I customize Worklogz?</h3>
        <p>
          Yes, Worklogz offers extensive customization options including branding, workflows, 
          fields, and reports. White-labeling is available for complete rebranding.
        </p>

        <h2 id="support-questions">Support Questions</h2>
        
        <h3>What support options are available?</h3>
        <p>
          Support options include email, live chat, phone support (Enterprise), documentation, 
          and community forums. Response times vary by plan.
        </p>
      </div>
    </DocsLayout>
  );
};

export default FAQ;

