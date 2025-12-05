import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Performance = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Performance & Reliability</h1>
        <p className="intro-subtitle">
          Load handling, uptime guarantees, caching, optimization, and system reliability.
        </p>

        <h2 id="performance-overview">Performance Overview</h2>
        <p>
          Worklogz is built for performance and reliability, ensuring fast response times and 
          high availability for your workforce management needs.
        </p>

        <h2 id="load-handling">Load Handling</h2>
        <div className="features-grid">
          <FeatureCard
            icon="⚡"
            title="High Throughput"
            description="Handle thousands of concurrent users and requests"
          />
          <FeatureCard
            icon="📈"
            title="Scalable Architecture"
            description="Auto-scaling capabilities for peak load times"
          />
          <FeatureCard
            icon="🔄"
            title="Load Balancing"
            description="Distribute load across multiple servers"
          />
          <FeatureCard
            icon="💾"
            title="Efficient Caching"
            description="Intelligent caching for improved response times"
          />
        </div>

        <h2 id="uptime">Uptime Guarantees</h2>
        <ul>
          <li>99.9% uptime SLA (Enterprise plans)</li>
          <li>Redundant infrastructure</li>
          <li>Automatic failover</li>
          <li>Health monitoring</li>
          <li>Proactive issue detection</li>
        </ul>

        <h2 id="caching">Caching Strategy</h2>
        <ul>
          <li>Application-level caching</li>
          <li>Database query caching</li>
          <li>CDN for static assets</li>
          <li>Session caching</li>
          <li>Redis caching layer (Enterprise)</li>
        </ul>

        <h2 id="optimization">Performance Optimization</h2>
        <h3>Frontend Optimization</h3>
        <ul>
          <li>Code splitting and lazy loading</li>
          <li>Asset optimization</li>
          <li>CDN delivery</li>
          <li>Browser caching</li>
          <li>Minification and compression</li>
        </ul>

        <h3>Backend Optimization</h3>
        <ul>
          <li>Database indexing</li>
          <li>Query optimization</li>
          <li>Connection pooling</li>
          <li>Efficient data structures</li>
          <li>Background job processing</li>
        </ul>

        <h2 id="reliability">Reliability Features</h2>
        <ul>
          <li>Data redundancy</li>
          <li>Automated backups</li>
          <li>Disaster recovery</li>
          <li>Error handling and recovery</li>
          <li>Monitoring and alerting</li>
        </ul>

        <h2 id="monitoring">Performance Monitoring</h2>
        <ul>
          <li>Real-time performance metrics</li>
          <li>Response time tracking</li>
          <li>Error rate monitoring</li>
          <li>Resource usage tracking</li>
          <li>User experience metrics</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Performance;

