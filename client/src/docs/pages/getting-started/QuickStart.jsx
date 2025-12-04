import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const QuickStart = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Quick Start</h1>
        <p className="intro-subtitle">
          Get up and running with Worklogz in minutes. Follow these simple steps to start managing your workforce.
        </p>

        <h2 id="prerequisites">Prerequisites</h2>
        <p>Before you begin, ensure you have:</p>
        <ul>
          <li>Node.js version 16 or higher installed</li>
          <li>npm or yarn package manager</li>
          <li>Modern web browser (Chrome, Firefox, Safari, or Edge)</li>
          <li>Git installed (for cloning the repository)</li>
        </ul>

        <h2 id="installation">Installation</h2>
        <p>Clone the repository and install dependencies:</p>
        <CodeBlock language="bash">
{`# Clone the repository
git clone https://github.com/your-org/worklogz.git
cd worklogz

# Install dependencies
npm install

# Or using yarn
yarn install`}
        </CodeBlock>

        <h2 id="configuration">Configuration</h2>
        <p>Set up your environment variables:</p>
        <CodeBlock language="bash">
{`# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Add your MongoDB connection string
# Add your JWT secret key
# Configure Cloudinary credentials`}
        </CodeBlock>

        <h2 id="running">Running the Application</h2>
        <p>Start the development server:</p>
        <CodeBlock language="bash">
{`# Start the frontend development server
cd client
npm start

# In another terminal, start the backend server
cd server
npm start`}
        </CodeBlock>

        <p>The application will be available at <code>http://localhost:3000</code></p>

        <h2 id="first-steps">First Steps</h2>
        <ol>
          <li><strong>Create an Admin Account:</strong> Register your first admin account</li>
          <li><strong>Configure Organization:</strong> Set up your company details in Settings</li>
          <li><strong>Add Departments:</strong> Create departments for your organization</li>
          <li><strong>Invite Employees:</strong> Add employees or allow them to register</li>
          <li><strong>Set Up Payroll:</strong> Configure salary structures and payment methods</li>
        </ol>

        <h2 id="next-steps">Next Steps</h2>
        <div className="features-grid">
          <FeatureCard
            icon="📚"
            title="Read Documentation"
            description="Explore comprehensive guides and API references"
          />
          <FeatureCard
            icon="🎨"
            title="Customize Theme"
            description="Learn how to customize the UI to match your brand"
          />
          <FeatureCard
            icon="🔌"
            title="API Integration"
            description="Integrate Worklogz with your existing systems"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default QuickStart;

