import React from 'react';
import './DocsContent.css';

const DocsContent = ({ children }) => {
  return (
    <main className="docs-content">
      <div className="docs-content-wrapper">
        {children}
      </div>
    </main>
  );
};

export default DocsContent;

