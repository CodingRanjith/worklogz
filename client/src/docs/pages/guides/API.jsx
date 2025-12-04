import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const APIGuide = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>API Integration Guide</h1>
        <p className="intro-subtitle">
          Learn how to integrate Worklogz APIs into your applications and make API requests.
        </p>

        <h2 id="overview">API Overview</h2>
        <p>
          Worklogz provides a RESTful API for accessing and managing data. All API requests 
          require authentication via JWT tokens.
        </p>

        <h2 id="base-url">Base URL</h2>
        <CodeBlock language="bash">
{`# Development
http://localhost:5000/api

# Production
https://your-domain.com/api`}
        </CodeBlock>

        <h2 id="authentication">Authentication</h2>
        <p>Include JWT token in Authorization header:</p>
        <CodeBlock language="javascript">
{`fetch('/api/users', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
});`}
        </CodeBlock>

        <h2 id="request-examples">Request Examples</h2>
        <CodeBlock language="javascript">
{`// GET request
const response = await fetch('/api/users', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

// POST request
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default APIGuide;

