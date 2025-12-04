import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const ThemingGuide = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Theming Guide</h1>
        <p className="intro-subtitle">
          Customize Worklogz appearance with themes, colors, and styling options.
        </p>

        <h2 id="overview">Theming Overview</h2>
        <p>
          Worklogz supports custom theming through Material-UI's theme system. You can customize 
          colors, typography, spacing, and component styles.
        </p>

        <h2 id="theme-configuration">Theme Configuration</h2>
        <CodeBlock language="javascript">
{`import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});`}
        </CodeBlock>

        <h2 id="custom-colors">Custom Colors</h2>
        <p>Customize your color scheme:</p>
        <ul>
          <li>Primary color</li>
          <li>Secondary color</li>
          <li>Background colors</li>
          <li>Text colors</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default ThemingGuide;

