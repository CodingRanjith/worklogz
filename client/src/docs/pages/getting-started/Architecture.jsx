import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const Architecture = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Architecture Overview</h1>
        <p className="intro-subtitle">
          Understand the architecture and structure of Worklogz. Learn how different components work together.
        </p>

        <h2 id="overview">System Architecture</h2>
        <p>
          Worklogz follows a modern three-tier architecture pattern:
        </p>
        <ul>
          <li><strong>Presentation Layer:</strong> React-based frontend application</li>
          <li><strong>Application Layer:</strong> Node.js/Express REST API</li>
          <li><strong>Data Layer:</strong> MongoDB database for data persistence</li>
        </ul>

        <h2 id="frontend-architecture">Frontend Architecture</h2>
        <p>The frontend is built with React and follows a component-based architecture:</p>
        
        <div className="features-grid">
          <FeatureCard
            icon="⚛️"
            title="React Components"
            description="Modular, reusable UI components"
          />
          <FeatureCard
            icon="🔄"
            title="State Management"
            description="Context API for global state"
          />
          <FeatureCard
            icon="🛣️"
            title="React Router"
            description="Client-side routing and navigation"
          />
          <FeatureCard
            icon="🎨"
            title="Material-UI"
            description="Material Design component library"
          />
        </div>

        <h3>Frontend Structure</h3>
        <CodeBlock language="text">
{`client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React Context providers
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles
│   └── docs/          # Documentation pages
├── public/            # Static assets
└── package.json       # Dependencies`}
        </CodeBlock>

        <h2 id="backend-architecture">Backend Architecture</h2>
        <p>The backend follows RESTful API principles:</p>
        
        <div className="features-grid">
          <FeatureCard
            icon="🚀"
            title="Express.js"
            description="Fast, minimalist web framework"
          />
          <FeatureCard
            icon="🔐"
            title="JWT Authentication"
            description="Secure token-based authentication"
          />
          <FeatureCard
            icon="📊"
            title="MongoDB"
            description="NoSQL database for flexible data storage"
          />
          <FeatureCard
            icon="☁️"
            title="Cloudinary"
            description="Cloud-based media storage"
          />
        </div>

        <h3>Backend Structure</h3>
        <CodeBlock language="text">
{`server/
├── routes/            # API route handlers
├── models/            # Database models
├── middleware/        # Custom middleware
├── controllers/       # Business logic
├── utils/             # Utility functions
└── config/            # Configuration files`}
        </CodeBlock>

        <h2 id="data-flow">Data Flow</h2>
        <ol>
          <li>User interacts with React frontend</li>
          <li>Frontend makes API requests to Express backend</li>
          <li>Backend validates requests and processes business logic</li>
          <li>Backend queries MongoDB for data</li>
          <li>Response sent back to frontend</li>
          <li>Frontend updates UI based on response</li>
        </ol>

        <h2 id="authentication-flow">Authentication Flow</h2>
        <ol>
          <li>User submits login credentials</li>
          <li>Backend validates credentials</li>
          <li>JWT token generated and sent to frontend</li>
          <li>Token stored in localStorage</li>
          <li>Token included in subsequent API requests</li>
          <li>Backend validates token on each request</li>
        </ol>

        <h2 id="security">Security Features</h2>
        <ul>
          <li>JWT-based authentication</li>
          <li>Password hashing with bcrypt</li>
          <li>CORS configuration</li>
          <li>Input validation and sanitization</li>
          <li>Role-based access control (RBAC)</li>
          <li>Secure file upload handling</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Architecture;

