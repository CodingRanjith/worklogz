import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DocsSidebar from '../components/DocsSidebar';
import DocsHeader from '../components/DocsHeader';
import DocsContent from '../components/DocsContent';
import DocsTableOfContents from '../components/DocsTableOfContents';
import '../styles/docs.css';

const DocsLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Force light mode only - ensure it's always set on mount
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="docs-container">
      <DocsHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="docs-main-wrapper">
        <DocsSidebar 
          open={sidebarOpen} 
          currentPath={location.pathname} 
        />
        <DocsContent>
          {children}
        </DocsContent>
        <DocsTableOfContents />
      </div>
    </div>
  );
};

export default DocsLayout;

