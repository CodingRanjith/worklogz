import React, { useState } from 'react';
import { FiMenu, FiSearch, FiGithub, FiMoon, FiSun } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './DocsHeader.css';

const DocsHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="docs-header-icon"
          aria-label="GitHub"
        >
          <FiGithub />
        </a>
        <button
          className="docs-header-icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <div className="docs-header-dropdown">
          <span>Auto</span>
          <span className="docs-dropdown-arrow">▼</span>
        </div>
      </div>
    </header>
  );
};

export default DocsHeader;

