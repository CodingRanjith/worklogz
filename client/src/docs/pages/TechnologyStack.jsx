import React from 'react';
import DocsLayout from './DocsLayout';
import CodeBlock from '../components/CodeBlock';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const TechnologyStack = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Technology Stack Used</h1>
        <p className="intro-subtitle">
          What technology we used to build Worklogz - frontend, backend, database, and optional DevOps stack.
        </p>

        <h2 id="overview">Overview</h2>
        <p>
          Worklogz is built using modern, proven technologies that ensure reliability, scalability, 
          and performance. Our technology stack is carefully chosen to provide the best experience 
          for both administrators and employees.
        </p>

        <h2 id="frontend">Frontend Technology</h2>
        <div className="features-grid">
          <FeatureCard
            icon="⚛️"
            title="React.js"
            description="Modern UI library for building interactive user interfaces"
          />
          <FeatureCard
            icon="🎨"
            title="Material-UI"
            description="Comprehensive component library following Material Design principles"
          />
          <FeatureCard
            icon="🔄"
            title="React Router"
            description="Client-side routing for seamless navigation"
          />
          <FeatureCard
            icon="📦"
            title="Component-Based"
            description="Modular, reusable components for maintainability"
          />
        </div>

        <h3>Frontend Features</h3>
        <ul>
          <li><strong>React.js:</strong> Modern JavaScript library for building user interfaces</li>
          <li><strong>Material-UI (MUI):</strong> Comprehensive component library with Material Design</li>
          <li><strong>React Router:</strong> Declarative routing for single-page applications</li>
          <li><strong>Context API:</strong> State management for global application state</li>
          <li><strong>Responsive Design:</strong> Mobile-first approach for all devices</li>
        </ul>

        <h2 id="backend">Backend Technology</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🚀"
            title="Node.js"
            description="JavaScript runtime for scalable server applications"
          />
          <FeatureCard
            icon="🌐"
            title="Express.js"
            description="Fast, minimalist web framework for Node.js"
          />
          <FeatureCard
            icon="🔐"
            title="JWT Authentication"
            description="Secure token-based authentication system"
          />
          <FeatureCard
            icon="📡"
            title="RESTful API"
            description="Standard REST API architecture"
          />
        </div>

        <h3>Backend Features</h3>
        <ul>
          <li><strong>Node.js:</strong> JavaScript runtime built on Chrome's V8 engine</li>
          <li><strong>Express.js:</strong> Fast, unopinionated web framework</li>
          <li><strong>JWT:</strong> JSON Web Tokens for secure authentication</li>
          <li><strong>RESTful API:</strong> Standard API design for interoperability</li>
          <li><strong>Middleware:</strong> Custom middleware for request processing</li>
        </ul>

        <h2 id="database">Database</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🍃"
            title="MongoDB"
            description="NoSQL database for flexible data storage"
          />
          <FeatureCard
            icon="📊"
            title="Flexible Schema"
            description="Schema-less design for rapid development"
          />
          <FeatureCard
            icon="⚡"
            title="High Performance"
            description="Optimized for read and write operations"
          />
          <FeatureCard
            icon="🔒"
            title="Data Security"
            description="Built-in security features and encryption"
          />
        </div>

        <h3>Database Features</h3>
        <ul>
          <li><strong>MongoDB:</strong> Document-oriented NoSQL database</li>
          <li><strong>Flexible Schema:</strong> Easy to modify and extend</li>
          <li><strong>Scalability:</strong> Horizontal scaling capabilities</li>
          <li><strong>Performance:</strong> Optimized for fast queries</li>
          <li><strong>Data Integrity:</strong> ACID transactions support</li>
        </ul>

        <h2 id="storage">File Storage</h2>
        <ul>
          <li><strong>Cloudinary:</strong> Cloud-based image and document storage</li>
          <li><strong>CDN:</strong> Content delivery network for fast access</li>
          <li><strong>Image Processing:</strong> Automatic optimization and transformations</li>
          <li><strong>Secure Upload:</strong> Secure file upload handling</li>
        </ul>

        <h2 id="real-time">Real-Time Features</h2>
        <ul>
          <li><strong>WebSocket:</strong> Support for live updates and notifications</li>
          <li><strong>Real-Time Sync:</strong> Instant synchronization across devices</li>
          <li><strong>Live Notifications:</strong> Real-time notification delivery</li>
        </ul>

        <h2 id="authentication">Authentication & Security</h2>
        <ul>
          <li><strong>JWT Tokens:</strong> Secure token-based authentication</li>
          <li><strong>Password Hashing:</strong> Bcrypt for secure password storage</li>
          <li><strong>Role-Based Access:</strong> Granular permission system</li>
          <li><strong>Session Management:</strong> Secure session handling</li>
        </ul>

        <h2 id="devops">DevOps Stack (Optional)</h2>
        <p>
          For production deployments, Worklogz supports various DevOps configurations:
        </p>
        <ul>
          <li><strong>Version Control:</strong> Git for code management</li>
          <li><strong>CI/CD:</strong> Continuous integration and deployment pipelines</li>
          <li><strong>Containerization:</strong> Docker support for containerized deployments</li>
          <li><strong>Cloud Platforms:</strong> Deploy on AWS, Azure, Google Cloud, or any cloud provider</li>
          <li><strong>Monitoring:</strong> Application performance monitoring tools</li>
          <li><strong>Backup:</strong> Automated backup solutions</li>
        </ul>

        <h2 id="why-this-stack">Why This Technology Stack?</h2>
        <ul>
          <li><strong>Proven & Reliable:</strong> Technologies used by millions of applications</li>
          <li><strong>Scalable:</strong> Can handle growth from small teams to large enterprises</li>
          <li><strong>Maintainable:</strong> Modern codebase that's easy to update and maintain</li>
          <li><strong>Developer-Friendly:</strong> Widely known technologies with excellent documentation</li>
          <li><strong>Performance:</strong> Optimized for speed and efficiency</li>
          <li><strong>Security:</strong> Built-in security features and best practices</li>
        </ul>

        <h2 id="system-requirements">System Requirements</h2>
        <ul>
          <li><strong>Frontend:</strong> Modern web browser (Chrome, Firefox, Safari, Edge)</li>
          <li><strong>Backend:</strong> Node.js 16+ and npm/yarn</li>
          <li><strong>Database:</strong> MongoDB 4.4+</li>
          <li><strong>Storage:</strong> Cloudinary account (or self-hosted storage)</li>
          <li><strong>Network:</strong> Internet connection for cloud features</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default TechnologyStack;

