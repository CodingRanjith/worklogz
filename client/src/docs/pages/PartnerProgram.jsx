import React from 'react';
import { Link } from 'react-router-dom';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const PartnerProgram = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Partner Program</h1>
        <p className="intro-subtitle">
          Resell, white-label, or co-sell Worklogz. One platform for attendance, payroll, projects, CRM, and documents — reduce tool sprawl for your clients and grow recurring revenue.
        </p>

        <h2 id="partner-value">Why Partner with Worklogz?</h2>
        <p>
          Worklogz is an end-to-end business management platform (like Zoho, Monday, Fosus) for companies of all sizes. As a partner, you offer your clients one unified solution instead of fragmented tools. White-label options let you deliver Worklogz under your brand. Revenue-share and reseller models give you margin and recurring income. Ideal for IT solution providers, HR consultants, system integrators, and agencies serving SMBs.
        </p>

        <h2 id="partnership-types">Partnership Types</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🛒"
            title="Reseller"
            description="Sell Worklogz under the Worklogz brand or your own. Earn margin per seat or per deal. We handle platform; you own the relationship."
          />
          <FeatureCard
            icon="📊"
            title="Revenue Share"
            description="Earn a share of recurring revenue (per seat or % of deal). No upfront cost; grow as your clients grow."
          />
          <FeatureCard
            icon="🏷️"
            title="White-Label"
            description="Deliver Worklogz as your product. Your logo, colors, and domain. Plan-based subscription or fully integrated deployment."
          />
          <FeatureCard
            icon="🤝"
            title="Co-Selling"
            description="Joint demos and referrals. We support your sales cycle; you bring the relationship. Flexible referral terms."
          />
        </div>

        <h2 id="benefits">Partner Benefits</h2>
        <ul>
          <li><strong>One platform:</strong> Attendance, payroll, projects, CRM, documents — less complexity for your clients.</li>
          <li><strong>White-label:</strong> Brand the product as yours; build trust and differentiation.</li>
          <li><strong>Recurring revenue:</strong> Predictable margin and revenue share as clients scale.</li>
          <li><strong>Support:</strong> Partner enablement, deal support, and technical resources when you need them.</li>
        </ul>

        <h2 id="who-its-for">Who It's For</h2>
        <p>
          IT solution providers, HR consultants, system integrators, and agencies serving small and mid-market businesses (SMBs). If you sell or implement workforce management, project management, or business operations software, the Worklogz partner program can fit your model — reseller, revenue-share, white-label, or co-selling.
        </p>

        <h2 id="how-to-join">How to Join</h2>
        <p>
          Request a partner demo or schedule a partnership call. We'll walk you through options (reseller vs white-label vs revenue-share), pricing, and next steps. No commitment required to explore.
        </p>

        <h2 id="outreach-template">Sample Outreach (Email / LinkedIn)</h2>
        <p>
          Use this template when reaching out to potential partners or when replying to partnership inquiries:
        </p>
        <div style={{ background: 'var(--docs-bg-secondary)', border: '1px solid var(--docs-border)', borderRadius: '8px', padding: '20px', marginTop: '12px', fontSize: '14px', lineHeight: 1.6 }}>
          <p style={{ marginTop: 0 }}>
            <strong>Subject:</strong> Partner with Worklogz — Resell, white-label, or co-sell one platform for attendance, payroll, projects, and CRM.
          </p>
          <p>
            Hi [Name], many SMBs struggle with fragmented tools for attendance, payroll, projects, and CRM. Worklogz is an all-in-one business management platform (like Zoho / Monday) that you can resell, white-label, or co-sell. We offer revenue-share, reseller margin, and white-label options. If you serve IT, HR, or operations clients, I’d love to schedule a short partnership call or demo. No commitment — just explore fit. [Request demo / Schedule call]
          </p>
        </div>

        <div className="cta-section">
          <h3>Ready to Partner?</h3>
          <p>
            Request a partner demo or schedule a call. Choose &quot;Partner / Reseller / White-label&quot; when you request a demo for a faster response.
          </p>
          <p style={{ marginTop: '16px' }}>
            <Link to="/pricing" className="btn-link" style={{ marginRight: '12px' }}>Request Demo</Link>
            <Link to="/docs/contact" className="btn-link">Contact Sales</Link>
          </p>
        </div>
      </div>
    </DocsLayout>
  );
};

export default PartnerProgram;
