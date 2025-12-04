import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const APIAuth = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Authentication API</h1>
        <p className="intro-subtitle">
          API endpoints for user authentication and authorization.
        </p>

        <h2 id="register">Register User</h2>
        <CodeBlock language="javascript">
{`POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}`}
        </CodeBlock>

        <h2 id="login">Login</h2>
        <CodeBlock language="javascript">
{`POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ... }
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default APIAuth;

