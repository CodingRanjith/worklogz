import React, { useState, useEffect } from 'react';
import './DocsTableOfContents.css';

const DocsTableOfContents = () => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const content = document.querySelector('.docs-content-wrapper');
    if (!content) return;

    const headingElements = content.querySelectorAll('h2, h3');
    const headingList = Array.from(headingElements).map((heading) => ({
      id: heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-'),
      text: heading.textContent,
      level: heading.tagName.toLowerCase()
    }));

    // Add IDs to headings if they don't have them
    headingElements.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = headingList[index].id;
      }
    });

    setHeadings(headingList);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => {
      headingElements.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="docs-toc">
      <div className="docs-toc-content">
        <h3 className="docs-toc-title">On this page</h3>
        <nav className="docs-toc-nav">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`docs-toc-link docs-toc-link-${heading.level} ${
                activeId === heading.id ? 'active' : ''
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default DocsTableOfContents;

