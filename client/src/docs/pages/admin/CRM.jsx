import React from 'react';
import DocsLayout from '../DocsLayout';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const AdminCRM = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>CRM Management</h1>
        <p className="intro-subtitle">
          Manage customer relationships through specialized CRM pipelines for courses, internships, and IT projects.
        </p>

        <h2 id="overview">CRM Overview</h2>
        <p>
          Worklogz includes three specialized CRM pipelines to manage different types of business leads 
          and customer relationships.
        </p>

        <h2 id="crm-types">CRM Types</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🎓"
            title="Course CRM"
            description="Manage course enrollment leads and student information"
          />
          <FeatureCard
            icon="💼"
            title="Internship CRM"
            description="Track internship candidates and program details"
          />
          <FeatureCard
            icon="💻"
            title="IT Projects CRM"
            description="Manage client projects and delivery pipelines"
          />
        </div>

        <h2 id="features">CRM Features</h2>
        <ul>
          <li>Lead management and tracking</li>
          <li>Pipeline stages and status</li>
          <li>Payment tracking</li>
          <li>Customer communication</li>
          <li>Progress monitoring</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AdminCRM;

