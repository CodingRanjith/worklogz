import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './FAQSection.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What is Worklogz?',
      answer: 'Worklogz is a comprehensive workforce management platform that helps organizations manage attendance, timesheets, payroll, projects, and CRM in a single integrated solution.'
    },
    {
      question: 'How does Worklogz pricing work?',
      answer: 'Worklogz offers flexible pricing plans including per-user monthly subscriptions, lifetime licenses, and custom enterprise packages. All plans include a free trial period.'
    },
    {
      question: 'Can I self-host Worklogz?',
      answer: 'Yes, Worklogz can be self-hosted on your own infrastructure. We provide complete installation documentation and support for self-hosted deployments.'
    },
    {
      question: 'Does Worklogz support mobile devices?',
      answer: 'Yes, Worklogz is fully responsive and works on mobile devices. A dedicated mobile app is also coming soon.'
    },
    {
      question: 'What industries can use Worklogz?',
      answer: 'Worklogz is suitable for various industries including EdTech, IT Services, Agencies, Manufacturing, Healthcare, Construction, Remote Teams, and Freelancers.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, Worklogz implements enterprise-grade security including data encryption, secure authentication, role-based access control, and compliance with data protection regulations.'
    },
    {
      question: 'Can I customize Worklogz for my organization?',
      answer: 'Yes, Worklogz offers extensive customization options including branding, workflows, fields, reports, and white-labeling for complete rebranding.'
    },
    {
      question: 'What support options are available?',
      answer: 'Support options include email, live chat (Enterprise), documentation, community forums, and dedicated support managers for Enterprise customers.'
    }
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find answers to common questions about Worklogz
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <FiChevronUp className="faq-icon" />
                ) : (
                  <FiChevronDown className="faq-icon" />
                )}
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <p>Still have questions?</p>
          <Link to="/docs/faq" className="btn-link">
            View Full FAQ <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

