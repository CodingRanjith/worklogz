import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const StateGuide = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>State Management Guide</h1>
        <p className="intro-subtitle">
          Learn how state management works in Worklogz using React Context API.
        </p>

        <h2 id="overview">State Management Overview</h2>
        <p>
          Worklogz uses React Context API for global state management. Context providers 
          manage authentication, notifications, and other shared state.
        </p>

        <h2 id="context-providers">Context Providers</h2>
        <CodeBlock language="jsx">
{`import { AuthContext } from './context/AuthContext';

function App() {
  return (
    <AuthContext.Provider value={authValue}>
      {/* Your app components */}
    </AuthContext.Provider>
  );
}`}
        </CodeBlock>

        <h2 id="using-context">Using Context</h2>
        <CodeBlock language="jsx">
{`import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useContext(AuthContext);
  
  return <div>Welcome, {user?.name}</div>;
}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default StateGuide;

