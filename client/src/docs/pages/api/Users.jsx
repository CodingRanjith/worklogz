import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const APIUsers = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Users API</h1>
        <p className="intro-subtitle">
          API endpoints for user management operations.
        </p>

        <h2 id="get-users">Get All Users</h2>
        <CodeBlock language="javascript">
{`GET /api/users
Authorization: Bearer {token}

Response:
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee"
  }
]`}
        </CodeBlock>

        <h2 id="create-user">Create User</h2>
        <CodeBlock language="javascript">
{`POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "employee",
  "department": "IT"
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default APIUsers;

