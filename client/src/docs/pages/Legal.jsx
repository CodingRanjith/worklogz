import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Legal = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Legal & Licensing Info</h1>
        <p className="intro-subtitle">
          Terms of use, white-label rights, distribution rights, and licensing information.
        </p>

        <h2 id="license-types">License Types</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📄"
            title="Standard License"
            description="Single organization use license"
          />
          <FeatureCard
            icon="🏢"
            title="Enterprise License"
            description="Extended rights for large organizations"
          />
          <FeatureCard
            icon="🎨"
            title="White-Label License"
            description="Rights to rebrand and resell"
          />
          <FeatureCard
            icon="🌐"
            title="Multi-Tenant License"
            description="License for service providers"
          />
        </div>

        <h2 id="usage-rights">Usage Rights</h2>
        <h3>Standard License</h3>
        <ul>
          <li>Use within single organization</li>
          <li>Unlimited users within organization</li>
          <li>Access to all features</li>
          <li>Updates and maintenance included</li>
        </ul>

        <h3>White-Label Rights</h3>
        <ul>
          <li>Complete rebranding rights</li>
          <li>Resale rights</li>
          <li>Custom domain usage</li>
          <li>Client distribution rights</li>
        </ul>

        <h2 id="terms-of-use">Terms of Use</h2>
        <ul>
          <li>Acceptable use policies</li>
          <li>Data usage guidelines</li>
          <li>User responsibilities</li>
          <li>System access rules</li>
        </ul>

        <h2 id="distribution-rights">Distribution Rights</h2>
        <ul>
          <li>Internal distribution allowed</li>
          <li>Client distribution (white-label)</li>
          <li>Reseller agreements available</li>
          <li>Custom distribution terms</li>
        </ul>

        <h2 id="compliance">Compliance & Regulations</h2>
        <ul>
          <li>GDPR compliance</li>
          <li>Data protection regulations</li>
          <li>Privacy policy compliance</li>
          <li>Industry-specific compliance</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Legal;

