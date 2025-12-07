import React from 'react';
import { FiTarget } from 'react-icons/fi';
import FeatureDetailPage from './FeatureDetailPage';

const CustomizedInputCrmManagement = () => {
  return (
    <FeatureDetailPage
      title="Customized Input / CRM Management"
      description="Manage CRM pipelines for courses, internships, and IT projects. Track leads, manage customer relationships, and streamline business processes with specialized CRM pipelines."
      icon={<FiTarget />}
      image={null}
      moduleType="Admin"
      features={[
        { title: "Multiple CRM Pipelines", description: "Manage specialized pipelines for Courses, Internships, and IT Projects." },
        { title: "Lead Management", description: "Track leads through customized pipeline stages." },
        { title: "Customer Tracking", description: "Track customer interactions and relationship history." },
        { title: "Pipeline Customization", description: "Customize pipeline stages and workflows as per business needs." },
        { title: "Sales Analytics", description: "Analyze sales performance and pipeline metrics." },
        { title: "Follow-up Management", description: "Schedule and track follow-ups with leads and customers." },
        { title: "Document Management", description: "Attach and manage documents related to leads and customers." },
        { title: "Reporting", description: "Generate reports on pipeline performance and conversions." }
      ]}
      benefits={[
        { title: "Better Tracking", description: "Track leads and customers effectively through customized pipelines." },
        { title: "Improved Conversion", description: "Improve conversion rates with organized pipeline management." },
        { title: "Business Insights", description: "Gain insights into sales performance and opportunities." }
      ]}
      useCases={[
        { title: "Lead Management", description: "Manage leads and track them through sales pipeline." },
        { title: "Customer Relationship", description: "Maintain customer relationships and track interactions." },
        { title: "Sales Optimization", description: "Optimize sales processes with pipeline analytics." }
      ]}
    />
  );
};

export default CustomizedInputCrmManagement;

