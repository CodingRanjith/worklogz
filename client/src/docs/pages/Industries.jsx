import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Industries = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Industries That Can Use Worklogz</h1>
        <p className="intro-subtitle">
          Worklogz is versatile enough to serve various industries: EdTech, IT Services, Agencies, 
          Manufacturing, Healthcare, Construction, Remote Teams, Freelancers, and more.
        </p>

        <div className="features-grid">
          <FeatureCard
            icon="🎓"
            title="EdTech & Education"
            description="Manage students, courses, trainers, and educational programs with Course CRM and training management"
          />
          <FeatureCard
            icon="💻"
            title="IT Services"
            description="Track project time, manage clients, handle IT Projects CRM, and monitor development teams"
          />
          <FeatureCard
            icon="🏢"
            title="Agencies"
            description="Client management, project tracking, team coordination, and billing for agency operations"
          />
          <FeatureCard
            icon="🏭"
            title="Manufacturing"
            description="Shift management, attendance tracking, production hours, and workforce scheduling"
          />
          <FeatureCard
            icon="🏥"
            title="Healthcare"
            description="Staff scheduling, shift management, patient care hours, and compliance tracking"
          />
          <FeatureCard
            icon="🏗️"
            title="Construction"
            description="Site attendance, project time tracking, safety compliance, and contractor management"
          />
          <FeatureCard
            icon="🌐"
            title="Remote Teams"
            description="Virtual attendance tracking, distributed team management, and remote work monitoring"
          />
          <FeatureCard
            icon="👨‍💼"
            title="Freelancers"
            description="Time tracking, project billing, client management, and earnings tracking"
          />
          <FeatureCard
            icon="🎯"
            title="Consulting"
            description="Client project tracking, billable hours, consultant management, and performance analytics"
          />
          <FeatureCard
            icon="📞"
            title="Call Centers"
            description="Shift scheduling, attendance monitoring, agent performance, and workload management"
          />
          <FeatureCard
            icon="🏪"
            title="Retail"
            description="Staff scheduling, shift management, sales hours tracking, and payroll processing"
          />
          <FeatureCard
            icon="🏋️"
            title="Fitness & Wellness"
            description="Trainer scheduling, class attendance, session tracking, and membership management"
          />
        </div>

        <h2 id="edtech">EdTech & Education</h2>
        <p>
          Educational institutions and training companies can use Worklogz to:
        </p>
        <ul>
          <li>Manage course enrollment through Course CRM</li>
          <li>Track trainer schedules and availability</li>
          <li>Monitor student attendance and progress</li>
          <li>Handle internship programs with Internship CRM</li>
          <li>Manage payment tracking for courses</li>
          <li>Generate reports on training effectiveness</li>
        </ul>

        <h2 id="it-services">IT Services</h2>
        <p>
          IT companies and software development firms benefit from:
        </p>
        <ul>
          <li>Project-based time tracking for development work</li>
          <li>Client project management through IT Projects CRM</li>
          <li>Team productivity monitoring</li>
          <li>Billable hours tracking</li>
          <li>Project progress and milestone tracking</li>
          <li>Resource allocation and planning</li>
        </ul>

        <h2 id="agencies">Agencies</h2>
        <p>
          Marketing, advertising, and creative agencies can use Worklogz for:
        </p>
        <ul>
          <li>Client project tracking</li>
          <li>Creative team time management</li>
          <li>Campaign hours tracking</li>
          <li>Resource allocation across projects</li>
          <li>Client billing and invoicing support</li>
          <li>Team performance analytics</li>
        </ul>

        <h2 id="manufacturing">Manufacturing</h2>
        <p>
          Manufacturing companies can leverage Worklogz for:
        </p>
        <ul>
          <li>Shift-based attendance tracking</li>
          <li>Production hours monitoring</li>
          <li>Overtime management</li>
          <li>Workforce scheduling</li>
          <li>Safety compliance tracking</li>
          <li>Department-based analytics</li>
        </ul>

        <h2 id="healthcare">Healthcare</h2>
        <p>
          Healthcare facilities can use Worklogz to:
        </p>
        <ul>
          <li>Manage nurse and staff schedules</li>
          <li>Track shift attendance</li>
          <li>Monitor patient care hours</li>
          <li>Ensure compliance with labor regulations</li>
          <li>Handle overtime and on-call hours</li>
          <li>Generate payroll for healthcare staff</li>
        </ul>

        <h2 id="construction">Construction</h2>
        <p>
          Construction companies can benefit from:
        </p>
        <ul>
          <li>Site-based attendance tracking</li>
          <li>Project time allocation</li>
          <li>Contractor and subcontractor management</li>
          <li>Safety compliance documentation</li>
          <li>Project progress tracking</li>
          <li>Labor cost management</li>
        </ul>

        <h2 id="remote-teams">Remote Teams</h2>
        <p>
          Companies with remote or distributed teams can use Worklogz for:
        </p>
        <ul>
          <li>Virtual attendance tracking</li>
          <li>Remote work monitoring</li>
          <li>Time zone management</li>
          <li>Distributed team coordination</li>
          <li>Productivity tracking for remote workers</li>
          <li>Work-life balance monitoring</li>
        </ul>

        <h2 id="freelancers">Freelancers</h2>
        <p>
          Individual freelancers and consultants can use Worklogz to:
        </p>
        <ul>
          <li>Track billable hours</li>
          <li>Manage multiple clients</li>
          <li>Monitor project time</li>
          <li>Generate timesheet reports</li>
          <li>Track earnings and payments</li>
          <li>Analyze productivity patterns</li>
        </ul>

        <h2 id="why-versatile">Why Worklogz Works for Any Industry</h2>
        <p>
          Worklogz is designed to be flexible and adaptable. Key features that make it suitable 
          for various industries include:
        </p>
        <ul>
          <li><strong>Customizable Workflows:</strong> Adapt to industry-specific processes</li>
          <li><strong>Flexible Time Tracking:</strong> Support various work patterns and schedules</li>
          <li><strong>Scalable Architecture:</strong> Handle organizations of any size</li>
          <li><strong>Integration Capabilities:</strong> Connect with industry-specific tools</li>
          <li><strong>Multiple Work Modes:</strong> Support office, remote, and hybrid work</li>
          <li><strong>Comprehensive Reporting:</strong> Generate industry-relevant insights</li>
        </ul>

        <h2 id="customization">Industry-Specific Customization</h2>
        <p>
          While Worklogz works out-of-the-box for most industries, it can be customized to meet 
          specific industry requirements:
        </p>
        <ul>
          <li>Custom fields and data structures</li>
          <li>Industry-specific workflows</li>
          <li>Specialized report formats</li>
          <li>Integration with industry tools</li>
          <li>Custom branding and white-labeling</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Industries;

