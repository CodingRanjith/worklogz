import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const APIProjects = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Projects API</h1>
        <p className="intro-subtitle">
          API endpoints for project management operations.
        </p>

        <h2 id="get-projects">Get Projects</h2>
        <CodeBlock language="javascript">
{`GET /api/projects
Authorization: Bearer {token}

Response:
[
  {
    "_id": "project_id",
    "name": "Project Name",
    "status": "in-progress",
    "department": "IT"
  }
]`}
        </CodeBlock>

        <h2 id="create-project">Create Project</h2>
        <CodeBlock language="javascript">
{`POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "department": "IT",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default APIProjects;

