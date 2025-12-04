import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const RoutingGuide = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Routing Guide</h1>
        <p className="intro-subtitle">
          Learn how routing works in Worklogz using React Router.
        </p>

        <h2 id="overview">Routing Overview</h2>
        <p>
          Worklogz uses React Router for client-side routing. Routes are defined in the 
          main App component with protected routes for authenticated users.
        </p>

        <h2 id="route-definition">Route Definition</h2>
        <CodeBlock language="jsx">
{`import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
    </Routes>
  );
}`}
        </CodeBlock>

        <h2 id="protected-routes">Protected Routes</h2>
        <CodeBlock language="jsx">
{`import { ProtectedRoute } from './components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default RoutingGuide;

