import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const DeploymentOptions = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Deployment Options</h1>
        <p className="intro-subtitle">
          Choose the deployment model that best fits your organization: self-hosted, cloud-hosted, or hybrid.
        </p>

        <div className="features-grid">
          <FeatureCard
            icon="🏠"
            title="Self-Hosted"
            description="Host Worklogz on your own servers with full control and data sovereignty"
          />
          <FeatureCard
            icon="☁️"
            title="Cloud-Hosted"
            description="Deploy on cloud platforms like AWS, Azure, or Google Cloud for scalability"
          />
          <FeatureCard
            icon="🔄"
            title="Hybrid"
            description="Combine self-hosted infrastructure with cloud services for optimal flexibility"
          />
        </div>

        <h2 id="self-hosted">Self-Hosted Solution</h2>
        <p>
          Host Worklogz on your own infrastructure for complete control over your data and system.
        </p>
        <h3>Benefits</h3>
        <ul>
          <li>Complete data sovereignty</li>
          <li>Full control over infrastructure</li>
          <li>Custom security configurations</li>
          <li>No recurring cloud costs</li>
          <li>Compliance with data residency requirements</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
          <li>Server infrastructure (physical or virtual)</li>
          <li>Node.js and MongoDB installation</li>
          <li>Network configuration</li>
          <li>SSL certificates for HTTPS</li>
          <li>Backup and maintenance procedures</li>
        </ul>

        <h2 id="cloud-hosted">Cloud-Hosted Solution</h2>
        <p>
          Deploy Worklogz on cloud platforms for scalability, reliability, and reduced infrastructure management.
        </p>
        <h3>Supported Platforms</h3>
        <ul>
          <li><strong>AWS:</strong> Amazon Web Services</li>
          <li><strong>Azure:</strong> Microsoft Azure</li>
          <li><strong>Google Cloud:</strong> Google Cloud Platform</li>
          <li><strong>Other:</strong> Any cloud provider supporting Node.js and MongoDB</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Scalability and auto-scaling</li>
          <li>Managed database services</li>
          <li>Built-in backup and disaster recovery</li>
          <li>Global CDN for fast access</li>
          <li>Reduced infrastructure management</li>
        </ul>

        <h2 id="hybrid">Hybrid Deployment</h2>
        <p>
          Combine self-hosted components with cloud services for optimal flexibility and control.
        </p>
        <h3>Common Hybrid Scenarios</h3>
        <ul>
          <li>Self-hosted application with cloud database</li>
          <li>Self-hosted core system with cloud file storage</li>
          <li>Private cloud with public cloud backup</li>
          <li>On-premise with cloud-based analytics</li>
        </ul>

        <h2 id="choosing">Choosing the Right Option</h2>
        <p>
          Consider the following factors when choosing your deployment option:
        </p>
        <ul>
          <li><strong>Data Requirements:</strong> Data residency and compliance needs</li>
          <li><strong>IT Resources:</strong> Available technical expertise and infrastructure</li>
          <li><strong>Scalability Needs:</strong> Expected growth and user base</li>
          <li><strong>Budget:</strong> Infrastructure and operational costs</li>
          <li><strong>Security Requirements:</strong> Regulatory and security needs</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default DeploymentOptions;

