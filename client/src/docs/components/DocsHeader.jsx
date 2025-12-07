import React, { useState, useEffect } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './DocsHeader.css';

const DocsHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Force light mode only
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <header className="docs-header">
      <div className="docs-header-left">
        <button 
          className="docs-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <FiMenu />
        </button>
        <Link to="/docs" className="docs-logo">
          <div className="docs-logo-icon">W</div>
          <span className="docs-logo-text">Worklogz</span>
        </Link>
      </div>
      
      <div className="docs-header-center">
        <div className="docs-search-wrapper">
          <FiSearch className="docs-search-icon" />
          <input
            type="text"
            placeholder="Search documentation..."
            className="docs-search-input"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          <kbd className="docs-search-shortcut">Ctrl K</kbd>
        </div>
      </div>

      <div className="docs-header-right">
      </div>
    </header>
  );
};

export default DocsHeader;

