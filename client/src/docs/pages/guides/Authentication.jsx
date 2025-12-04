import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const AuthenticationGuide = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Authentication Guide</h1>
        <p className="intro-subtitle">
          Learn how authentication works in Worklogz, including JWT tokens, login flow, and security features.
        </p>

        <h2 id="overview">Authentication Overview</h2>
        <p>
          Worklogz uses JWT (JSON Web Tokens) for secure authentication. Users authenticate 
          with email and password, receiving a token for subsequent API requests.
        </p>

        <h2 id="login-flow">Login Flow</h2>
        <ol>
          <li>User submits email and password</li>
          <li>Backend validates credentials</li>
          <li>JWT token generated</li>
          <li>Token stored in localStorage</li>
          <li>Token included in API requests</li>
        </ol>

        <h2 id="token-management">Token Management</h2>
        <CodeBlock language="javascript">
{`// Storing token after login
localStorage.setItem('token', response.data.token);

// Including token in API requests
const token = localStorage.getItem('token');
axios.get('/api/users', {
  headers: { Authorization: \`Bearer \${token}\` }
});

// Removing token on logout
localStorage.removeItem('token');`}
        </CodeBlock>

        <h2 id="security">Security Features</h2>
        <ul>
          <li>Password hashing with bcrypt</li>
          <li>JWT token expiration</li>
          <li>Secure token storage</li>
          <li>Role-based access control</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default AuthenticationGuide;

