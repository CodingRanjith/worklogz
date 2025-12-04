import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const APICRM = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>CRM API</h1>
        <p className="intro-subtitle">
          API endpoints for CRM pipeline management.
        </p>

        <h2 id="course-crm">Course CRM</h2>
        <CodeBlock language="javascript">
{`GET /api/crm/course/leads
POST /api/crm/course/leads
PUT /api/crm/course/leads/:id`}
        </CodeBlock>

        <h2 id="internship-crm">Internship CRM</h2>
        <CodeBlock language="javascript">
{`GET /api/crm/internship/leads
POST /api/crm/internship/leads
PUT /api/crm/internship/leads/:id`}
        </CodeBlock>

        <h2 id="it-projects-crm">IT Projects CRM</h2>
        <CodeBlock language="javascript">
{`GET /api/crm/it-projects/leads
POST /api/crm/it-projects/leads
PUT /api/crm/it-projects/leads/:id`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default APICRM;

