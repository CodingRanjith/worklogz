import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Introduction = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Introduction to Worklogz</h1>
        <p className="intro-subtitle">
          Worklogz is a comprehensive workforce management and business operations platform designed 
          to streamline employee management, attendance tracking, project management, customer 
          relationship management (CRM), and various administrative functions. The system is built 
          with a modern architecture supporting both employee and administrative interfaces.
        </p>

        <h2 id="what-is-worklogz">What is Worklogz?</h2>
        <p>
          Worklogz is an all-in-one workforce management solution that empowers organizations to 
          efficiently manage their employees, track attendance, process payroll, manage projects, 
          and handle customer relationships. Built with modern technology and a user-friendly interface, 
          Worklogz brings together all essential business operations into a single, integrated platform.
        </p>

        <h2 id="why-worklogz">Why Worklogz Exists</h2>
        <p>
          In today's fast-paced business environment, organizations struggle with fragmented systems, 
          manual processes, and lack of visibility into workforce operations. Worklogz was created to 
          solve these challenges by providing a unified platform that automates and streamlines 
          workforce management, making it easier for organizations to focus on growth and productivity.
        </p>

        <h2 id="core-value">Core Value Proposition</h2>
        <p>
          Worklogz delivers timeless value through accurate time-tracking, comprehensive work-logging, 
          and intelligent workforce management. The platform brings classic workforce management principles 
          into the modern digital age, ensuring organizations have the tools they need to succeed.
        </p>

        <div className="features-grid">
          <FeatureCard
            icon="⚡"
            title="All-in-One Platform"
            description="Complete workforce management solution in a single platform"
          />
          <FeatureCard
            icon="🎯"
            title="Modern Technology"
            description="Built with cutting-edge technology for reliability and performance"
          />
          <FeatureCard
            icon="🔒"
            title="Secure & Reliable"
            description="Enterprise-grade security with data protection and privacy"
          />
          <FeatureCard
            icon="📊"
            title="Data-Driven Insights"
            description="Comprehensive analytics and reporting for informed decision-making"
          />
          <FeatureCard
            icon="👥"
            title="Scalable Solution"
            description="Grows with your organization from startup to enterprise"
          />
          <FeatureCard
            icon="🌐"
            title="Accessible Anywhere"
            description="Cloud-based platform accessible from any device, anywhere"
          />
        </div>

        <h2 id="key-benefits">Key Benefits</h2>
        
        <h3>For Organizations</h3>
        <ul>
          <li>Reduced administrative overhead</li>
          <li>Improved accuracy in attendance and payroll</li>
          <li>Better employee engagement</li>
          <li>Data-driven decision making</li>
          <li>Scalable business operations</li>
          <li>Enhanced customer relationship management</li>
        </ul>

        <h3>For Administrators</h3>
        <ul>
          <li>Centralized employee management</li>
          <li>Automated attendance tracking</li>
          <li>Streamlined payroll processing</li>
          <li>Comprehensive analytics and insights</li>
          <li>Efficient task and project management</li>
          <li>CRM capabilities for business growth</li>
          <li>Document automation</li>
        </ul>

        <h3>For Employees</h3>
        <ul>
          <li>Easy attendance tracking</li>
          <li>Transparent salary and earnings visibility</li>
          <li>Simple leave application process</li>
          <li>Performance tracking</li>
          <li>Access to company resources and community</li>
        </ul>

        <h2 id="getting-started">Getting Started</h2>
        <p>
          Ready to transform your workforce management? Explore our comprehensive documentation 
          to understand how Worklogz can benefit your organization. Start with understanding the 
          core purpose of the platform, explore the features, and learn how to deploy and customize 
          Worklogz for your specific needs.
        </p>
      </div>
    </DocsLayout>
  );
};

export default Introduction;
