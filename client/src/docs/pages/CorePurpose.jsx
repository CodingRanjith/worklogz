import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const CorePurpose = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Core Purpose of the Platform</h1>
        <p className="intro-subtitle">
          Why time-tracking and work-logging still matter today just like they always have. 
          Discover the fundamental principles that make Worklogz essential for modern organizations.
        </p>

        <h2 id="timeless-principles">Timeless Principles</h2>
        <p>
          Time-tracking and work-logging have been fundamental to business operations for centuries. 
          From the earliest punch cards to modern digital systems, the core principle remains the same: 
          understanding how time is spent is essential for productivity, accountability, and growth.
        </p>

        <h2 id="why-it-matters">Why Time-Tracking Matters Today</h2>
        
        <h3>Accountability & Transparency</h3>
        <p>
          Accurate time-tracking creates accountability at all levels. Employees know their time 
          is being tracked fairly, managers have visibility into work patterns, and organizations 
          can ensure fair compensation based on actual work performed.
        </p>

        <h3>Productivity Optimization</h3>
        <p>
          By understanding how time is spent, organizations can identify inefficiencies, optimize 
          workflows, and improve overall productivity. Time-tracking data reveals patterns and 
          opportunities for improvement that would otherwise remain hidden.
        </p>

        <h3>Fair Compensation</h3>
        <p>
          Precise work-logging ensures that employees are compensated accurately for their time 
          and effort. This builds trust, improves morale, and ensures compliance with labor regulations.
        </p>

        <h3>Resource Planning</h3>
        <p>
          Historical time-tracking data enables better resource planning, project estimation, and 
          capacity management. Organizations can make informed decisions about staffing, project 
          timelines, and resource allocation.
        </p>

        <div className="features-grid">
          <FeatureCard
            icon="📈"
            title="Performance Insights"
            description="Understand productivity patterns and optimize performance"
          />
          <FeatureCard
            icon="⚖️"
            title="Fair Compensation"
            description="Ensure accurate and fair payment based on actual work"
          />
          <FeatureCard
            icon="🎯"
            title="Goal Alignment"
            description="Align time spent with organizational goals and objectives"
          />
          <FeatureCard
            icon="📊"
            title="Data-Driven Decisions"
            description="Make informed decisions based on accurate time data"
          />
        </div>

        <h2 id="worklogz-approach">The Worklogz Approach</h2>
        <p>
          Worklogz recognizes that while the principles of time-tracking are timeless, the methods 
          must evolve. Our platform combines classic workforce management principles with modern 
          technology to deliver:
        </p>

        <ul>
          <li><strong>Automation:</strong> Reduce manual effort while maintaining accuracy</li>
          <li><strong>Integration:</strong> Connect time-tracking with payroll, projects, and analytics</li>
          <li><strong>Flexibility:</strong> Support various work models (office, remote, hybrid)</li>
          <li><strong>Transparency:</strong> Provide clear visibility into time and work patterns</li>
          <li><strong>Compliance:</strong> Ensure adherence to labor laws and regulations</li>
          <li><strong>Scalability:</strong> Grow with your organization's needs</li>
        </ul>

        <h2 id="value-proposition">Value Proposition</h2>
        <p>
          Worklogz doesn't just track time—it transforms time data into actionable insights. 
          By combining accurate time-tracking with comprehensive workforce management features, 
          Worklogz helps organizations:
        </p>

        <ul>
          <li>Improve productivity through data-driven insights</li>
          <li>Ensure fair and accurate compensation</li>
          <li>Optimize resource allocation and planning</li>
          <li>Maintain compliance with labor regulations</li>
          <li>Build trust and transparency with employees</li>
          <li>Make informed strategic decisions</li>
        </ul>

        <h2 id="the-future">The Future of Work-Logging</h2>
        <p>
          As work models continue to evolve—from traditional office settings to remote work, 
          hybrid arrangements, and gig economy—the importance of accurate time-tracking only 
          increases. Worklogz is designed to adapt to these changes while maintaining the 
          fundamental principles that make time-tracking valuable.
        </p>

        <p>
          The platform recognizes that modern work is flexible, dynamic, and distributed. 
          Our solution accommodates these realities while providing the structure and insights 
          organizations need to succeed.
        </p>
      </div>
    </DocsLayout>
  );
};

export default CorePurpose;

