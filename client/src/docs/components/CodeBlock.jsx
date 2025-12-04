import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import './CodeBlock.css';

const CodeBlock = ({ language = 'javascript', children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-language">{language}</span>
        <button className="code-block-copy" onClick={handleCopy}>
          {copied ? <FiCheck /> : <FiCopy />}
        </button>
      </div>
      <pre className="code-block">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

