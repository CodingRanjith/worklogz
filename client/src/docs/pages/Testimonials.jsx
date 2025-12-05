import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Testimonials = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Client Testimonials & Case Studies</h1>
        <p className="intro-subtitle">
          Real-world stories showing how teams improved productivity with Worklogz.
        </p>

        <h2 id="testimonials">Client Testimonials</h2>
        
        <div className="features-grid">
          <FeatureCard
            icon="💬"
            title="Success Story 1"
            description="See how Company X improved attendance accuracy by 95%"
          />
          <FeatureCard
            icon="📈"
            title="Success Story 2"
            description="Learn how Organization Y reduced payroll processing time by 70%"
          />
          <FeatureCard
            icon="⚡"
            title="Success Story 3"
            description="Discover how Startup Z streamlined their entire workforce management"
          />
          <FeatureCard
            icon="🎯"
            title="Success Story 4"
            description="Find out how Enterprise A scaled from 50 to 500 employees seamlessly"
          />
        </div>

        <h2 id="case-studies">Case Studies</h2>
        
        <h3>Case Study: EdTech Company</h3>
        <p>
          An educational technology company used Worklogz to manage their training programs, 
          track student enrollment, and manage trainer schedules. Results include:
        </p>
        <ul>
          <li>50% reduction in administrative time</li>
          <li>Improved course enrollment tracking</li>
          <li>Better trainer utilization</li>
          <li>Enhanced student engagement</li>
        </ul>

        <h3>Case Study: IT Services Firm</h3>
        <p>
          An IT services company implemented Worklogz for project time tracking and client 
          management. Achievements include:
        </p>
        <ul>
          <li>Accurate billable hours tracking</li>
          <li>Improved project profitability</li>
          <li>Better client communication</li>
          <li>Streamlined invoicing process</li>
        </ul>

        <h2 id="results">Measurable Results</h2>
        <ul>
          <li>95%+ attendance accuracy improvement</li>
          <li>70% reduction in payroll processing time</li>
          <li>50% reduction in administrative overhead</li>
          <li>100% employee adoption rate</li>
          <li>Significant cost savings</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Testimonials;

