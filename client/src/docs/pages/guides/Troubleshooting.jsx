import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const Troubleshooting = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Troubleshooting Guide</h1>
        <p className="intro-subtitle">
          Common issues and solutions for Worklogz implementation and usage.
        </p>

        <h2 id="common-issues">Common Issues</h2>

        <h3 id="authentication-errors">Authentication Errors</h3>
        <p><strong>Issue:</strong> Token expired or invalid</p>
        <p><strong>Solution:</strong> Clear localStorage and login again</p>
        <CodeBlock language="javascript">
{`localStorage.removeItem('token');
window.location.href = '/login';`}
        </CodeBlock>

        <h3 id="api-errors">API Connection Errors</h3>
        <p><strong>Issue:</strong> Cannot connect to API</p>
        <p><strong>Solution:</strong> Check API URL and CORS settings</p>

        <h3 id="build-errors">Build Errors</h3>
        <p><strong>Issue:</strong> Build fails with module errors</p>
        <p><strong>Solution:</strong> Clear node_modules and reinstall</p>
        <CodeBlock language="bash">
{`rm -rf node_modules package-lock.json
npm install`}
        </CodeBlock>

        <h2 id="getting-help">Getting Help</h2>
        <ul>
          <li>Check the documentation</li>
          <li>Review error messages</li>
          <li>Check browser console</li>
          <li>Contact support</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Troubleshooting;

