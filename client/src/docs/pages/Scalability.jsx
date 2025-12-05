import React from 'react';
import DocsLayout from './DocsLayout';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const Scalability = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>User Capacity & Scalability</h1>
        <p className="intro-subtitle">
          How many users it supports, scaling options, and infrastructure recommendations.
        </p>

        <h2 id="user-capacity">User Capacity</h2>
        <p>
          Worklogz is designed to scale with your organization, from small teams to large enterprises.
        </p>

        <h3>Recommended Capacities</h3>
        <ul>
          <li><strong>Small Teams:</strong> 1-50 users - Standard server configuration</li>
          <li><strong>Mid-Size Organizations:</strong> 50-500 users - Enhanced server setup</li>
          <li><strong>Large Enterprises:</strong> 500-5000+ users - Clustered/high-availability setup</li>
        </ul>

        <h2 id="scaling-options">Scaling Options</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📈"
            title="Vertical Scaling"
            description="Increase server resources (CPU, RAM, storage) for better performance"
          />
          <FeatureCard
            icon="🔀"
            title="Horizontal Scaling"
            description="Add more servers and distribute load across multiple instances"
          />
          <FeatureCard
            icon="☁️"
            title="Cloud Scaling"
            description="Auto-scaling capabilities on cloud platforms"
          />
          <FeatureCard
            icon="🗄️"
            title="Database Scaling"
            description="MongoDB clustering and replication for database scaling"
          />
        </div>

        <h2 id="infrastructure-recommendations">Infrastructure Recommendations</h2>
        
        <h3>Small Teams (1-50 users)</h3>
        <ul>
          <li>Single server instance</li>
          <li>4 CPU cores</li>
          <li>8GB RAM</li>
          <li>100GB storage</li>
          <li>Standard MongoDB instance</li>
        </ul>

        <h3>Mid-Size Organizations (50-500 users)</h3>
        <ul>
          <li>Load-balanced application servers</li>
          <li>8+ CPU cores per server</li>
          <li>16GB+ RAM per server</li>
          <li>500GB+ storage</li>
          <li>MongoDB replica set</li>
          <li>CDN for static assets</li>
        </ul>

        <h3>Large Enterprises (500+ users)</h3>
        <ul>
          <li>Multi-server cluster</li>
          <li>16+ CPU cores per server</li>
          <li>32GB+ RAM per server</li>
          <li>1TB+ storage with SSD</li>
          <li>MongoDB sharded cluster</li>
          <li>High-availability setup</li>
          <li>Global CDN</li>
          <li>Redis caching layer</li>
        </ul>

        <h2 id="performance-optimization">Performance Optimization</h2>
        <ul>
          <li>Database indexing for faster queries</li>
          <li>Caching strategies for frequently accessed data</li>
          <li>CDN for static asset delivery</li>
          <li>Connection pooling</li>
          <li>Load balancing</li>
          <li>Database query optimization</li>
        </ul>

        <h2 id="monitoring">Monitoring & Metrics</h2>
        <p>
          Monitor key metrics to ensure optimal performance:
        </p>
        <ul>
          <li>Response times</li>
          <li>Server resource usage (CPU, RAM, disk)</li>
          <li>Database performance</li>
          <li>Active user sessions</li>
          <li>Request throughput</li>
          <li>Error rates</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Scalability;

