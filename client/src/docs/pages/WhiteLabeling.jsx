import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const WhiteLabeling = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>White-Labeling Process</h1>
        <p className="intro-subtitle">
          How clients can rebrand Worklogz with their own logo, colors, domain, and identity.
        </p>

        <h2 id="overview">What is White-Labeling?</h2>
        <p>
          White-labeling allows you to rebrand Worklogz completely with your own company identity. 
          Your clients and employees will see your branding throughout the platform, making it 
          appear as your own product.
        </p>

        <h2 id="white-label-options">White-Label Options</h2>
        <p>
          Choose how you want to run Worklogz under your brand: <strong>plan-wise subscription</strong> (SaaS, billed by plan) or <strong>fully integrated</strong> (custom deployment, higher touch). Decision-makers can self-serve with the comparison below.
        </p>

        <h3>Option A — Plan-Wise Subscription (SaaS White-Label)</h3>
        <ul>
          <li>Your branding (logo, colors, domain) on Worklogz cloud.</li>
          <li>Billed per plan (e.g. Essential, Growth, Enterprise); no custom code.</li>
          <li>Best for: SMBs, agencies, resellers who want fast go-live and predictable cost.</li>
          <li>Link to <a href="/pricing">Pricing</a> for plan details.</li>
        </ul>

        <h3>Option B — Fully Integrated</h3>
        <ul>
          <li>Deeper integration: custom domain, SSO, optional on-prem or private cloud, dedicated instance, API/integration support.</li>
          <li>Positioned as enterprise or custom tier; higher touch and typically higher commitment.</li>
          <li>Contact for custom quote or <a href="/pricing">Request demo</a> to discuss.</li>
        </ul>

        <h3>Comparison at a Glance</h3>
        <table className="intro-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', marginBottom: '24px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--docs-border)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Feature</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Plan-Wise Subscription</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fully Integrated</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--docs-border)' }}>
              <td style={{ padding: '12px' }}>Billing</td>
              <td style={{ padding: '12px' }}>Per plan (Essential / Growth / Enterprise)</td>
              <td style={{ padding: '12px' }}>Custom quote</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--docs-border)' }}>
              <td style={{ padding: '12px' }}>Branding</td>
              <td style={{ padding: '12px' }}>Logo, colors, custom domain</td>
              <td style={{ padding: '12px' }}>Full branding + SSO, dedicated instance</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--docs-border)' }}>
              <td style={{ padding: '12px' }}>Best for</td>
              <td style={{ padding: '12px' }}>SMBs, agencies, fast go-live</td>
              <td style={{ padding: '12px' }}>Enterprise, custom integrations</td>
            </tr>
          </tbody>
        </table>

        <h2 id="branding-elements">Branding Elements</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🖼️"
            title="Logo Replacement"
            description="Replace Worklogz logo with your company logo throughout the platform"
          />
          <FeatureCard
            icon="🎨"
            title="Color Customization"
            description="Apply your brand colors to the entire interface"
          />
          <FeatureCard
            icon="🌐"
            title="Custom Domain"
            description="Use your own domain name (e.g., timesheet.yourcompany.com)"
          />
          <FeatureCard
            icon="📧"
            title="Branded Communications"
            description="Email notifications and communications with your branding"
          />
        </div>

        <h2 id="white-labeling-process">White-Labeling Process</h2>
        
        <h3>Step 1: Brand Assets Collection</h3>
        <ul>
          <li>Company logo (PNG/SVG format)</li>
          <li>Brand color palette</li>
          <li>Font preferences (if applicable)</li>
          <li>Company information</li>
        </ul>

        <h3>Step 2: Configuration</h3>
        <ul>
          <li>Upload logo files</li>
          <li>Set primary and secondary colors</li>
          <li>Configure domain settings</li>
          <li>Update email templates</li>
        </ul>

        <h3>Step 3: Domain Setup</h3>
        <ul>
          <li>DNS configuration</li>
          <li>SSL certificate setup</li>
          <li>Domain verification</li>
          <li>Subdomain configuration</li>
        </ul>

        <h3>Step 4: Testing & Review</h3>
        <ul>
          <li>Review all branded elements</li>
          <li>Test email notifications</li>
          <li>Verify domain functionality</li>
          <li>Check mobile responsiveness</li>
        </ul>

        <h3>Step 5: Launch</h3>
        <ul>
          <li>Go live with white-labeled version</li>
          <li>User communication</li>
          <li>Monitor and support</li>
        </ul>

        <h2 id="customizable-elements">Fully Customizable Elements</h2>
        <ul>
          <li>Application logo (header, login page, emails)</li>
          <li>Favicon and app icons</li>
          <li>Primary brand colors</li>
          <li>Secondary accent colors</li>
          <li>Email templates</li>
          <li>Notification templates</li>
          <li>PDF documents (payslips, reports)</li>
          <li>Login page branding</li>
          <li>Welcome messages</li>
        </ul>

        <h2 id="technical-requirements">Technical Requirements</h2>
        <ul>
          <li>Domain name ownership</li>
          <li>DNS access for configuration</li>
          <li>High-quality logo files (PNG/SVG)</li>
          <li>Brand color codes (HEX/RGB)</li>
          <li>SSL certificate (can be provided)</li>
        </ul>

        <h2 id="benefits">Benefits of White-Labeling</h2>
        <ul>
          <li><strong>Brand Consistency:</strong> Maintain consistent brand experience</li>
          <li><strong>Professional Appearance:</strong> Present as your own product</li>
          <li><strong>Client Trust:</strong> Build trust with your branding</li>
          <li><strong>Market Differentiation:</strong> Stand out with your unique identity</li>
          <li><strong>Reseller Opportunity:</strong> Resell as your own solution</li>
        </ul>

        <h2 id="support">White-Labeling Support</h2>
        <p>
          We provide comprehensive support for white-labeling including:
        </p>
        <ul>
          <li>Technical setup assistance</li>
          <li>Brand asset optimization</li>
          <li>Domain configuration support</li>
          <li>Testing and quality assurance</li>
          <li>Ongoing maintenance and updates</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default WhiteLabeling;

