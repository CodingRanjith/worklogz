import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Security = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Data Security & Privacy Standards</h1>
        <p className="intro-subtitle">
          Encryption, backups, audit logs, compliance, and comprehensive security measures.
        </p>

        <h2 id="security-overview">Security Overview</h2>
        <p>
          Worklogz takes data security and privacy seriously. We implement industry-standard 
          security measures to protect your data and ensure compliance with regulations.
        </p>

        <h2 id="encryption">Encryption</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🔐"
            title="Data Encryption"
            description="All data encrypted in transit using TLS/SSL protocols"
          />
          <FeatureCard
            icon="🛡️"
            title="At-Rest Encryption"
            description="Database encryption for data at rest"
          />
          <FeatureCard
            icon="🔑"
            title="Password Security"
            description="Bcrypt hashing for secure password storage"
          />
          <FeatureCard
            icon="🎫"
            title="Token Security"
            description="Secure JWT tokens with expiration"
          />
        </div>

        <h2 id="authentication">Authentication & Access Control</h2>
        <ul>
          <li>JWT-based authentication</li>
          <li>Role-based access control (RBAC)</li>
          <li>Session management</li>
          <li>Password policies</li>
          <li>Multi-factor authentication support</li>
          <li>IP whitelisting options</li>
        </ul>

        <h2 id="data-backup">Data Backup & Recovery</h2>
        <h3>Backup Strategy</h3>
        <ul>
          <li>Automated daily backups</li>
          <li>Incremental backup system</li>
          <li>Off-site backup storage</li>
          <li>Point-in-time recovery</li>
          <li>Backup testing and verification</li>
          <li>Disaster recovery procedures</li>
        </ul>

        <h2 id="audit-logs">Audit Logs</h2>
        <p>
          Comprehensive audit logging for compliance and security:
        </p>
        <ul>
          <li>User activity logs</li>
          <li>System access logs</li>
          <li>Data modification logs</li>
          <li>Permission change logs</li>
          <li>Security event logs</li>
          <li>Export capabilities for compliance</li>
        </ul>

        <h2 id="compliance">Compliance Standards</h2>
        <ul>
          <li>GDPR compliance (General Data Protection Regulation)</li>
          <li>Data residency options</li>
          <li>Data retention policies</li>
          <li>Right to deletion</li>
          <li>Data export capabilities</li>
          <li>Privacy policy compliance</li>
        </ul>

        <h2 id="privacy">Privacy Protection</h2>
        <ul>
          <li>Minimal data collection</li>
          <li>Data anonymization options</li>
          <li>User privacy controls</li>
          <li>Data access restrictions</li>
          <li>Privacy-by-design architecture</li>
        </ul>

        <h2 id="infrastructure-security">Infrastructure Security</h2>
        <ul>
          <li>Secure server infrastructure</li>
          <li>Firewall protection</li>
          <li>DDoS protection</li>
          <li>Regular security updates</li>
          <li>Vulnerability scanning</li>
          <li>Penetration testing</li>
        </ul>

        <h2 id="security-best-practices">Security Best Practices</h2>
        <ul>
          <li>Regular security audits</li>
          <li>Employee security training</li>
          <li>Incident response procedures</li>
          <li>Security monitoring</li>
          <li>Third-party security assessments</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Security;

