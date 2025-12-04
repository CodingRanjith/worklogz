import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const Installation = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Installation</h1>
        <p className="intro-subtitle">
          Detailed installation guide for Worklogz. Follow these steps to set up the platform on your system.
        </p>

        <h2 id="system-requirements">System Requirements</h2>
        <ul>
          <li><strong>Node.js:</strong> Version 16.x or higher</li>
          <li><strong>npm:</strong> Version 7.x or higher (or yarn 1.22+)</li>
          <li><strong>MongoDB:</strong> Version 4.4 or higher</li>
          <li><strong>Operating System:</strong> Windows, macOS, or Linux</li>
          <li><strong>RAM:</strong> Minimum 4GB (8GB recommended)</li>
          <li><strong>Storage:</strong> At least 2GB free space</li>
        </ul>

        <h2 id="frontend-installation">Frontend Installation</h2>
        <p>Install the client application:</p>
        <CodeBlock language="bash">
{`# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start`}
        </CodeBlock>

        <h2 id="backend-installation">Backend Installation</h2>
        <p>Install the server application:</p>
        <CodeBlock language="bash">
{`# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev`}
        </CodeBlock>

        <h2 id="database-setup">Database Setup</h2>
        <p>Set up MongoDB:</p>
        <ol>
          <li>Install MongoDB on your system or use MongoDB Atlas (cloud)</li>
          <li>Create a new database named <code>worklogz</code></li>
          <li>Note your connection string</li>
          <li>Update the <code>.env</code> file with your MongoDB connection string</li>
        </ol>

        <CodeBlock language="bash">
{`# MongoDB connection string format
MONGODB_URI=mongodb://localhost:27017/worklogz
# Or for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/worklogz`}
        </CodeBlock>

        <h2 id="environment-variables">Environment Variables</h2>
        <p>Configure your environment variables:</p>
        <CodeBlock language="bash">
{`# Backend .env file
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Frontend .env file
REACT_APP_API_URL=http://localhost:5000/api`}
        </CodeBlock>

        <h2 id="verification">Verification</h2>
        <p>Verify your installation:</p>
        <ol>
          <li>Start both frontend and backend servers</li>
          <li>Open <code>http://localhost:3000</code> in your browser</li>
          <li>You should see the login page</li>
          <li>Check browser console for any errors</li>
          <li>Check backend logs for successful database connection</li>
        </ol>

        <h2 id="troubleshooting">Troubleshooting</h2>
        <h3>Common Issues</h3>
        <ul>
          <li><strong>Port already in use:</strong> Change the port in your .env file</li>
          <li><strong>MongoDB connection error:</strong> Verify your connection string and ensure MongoDB is running</li>
          <li><strong>Module not found:</strong> Run <code>npm install</code> again</li>
          <li><strong>CORS errors:</strong> Ensure backend CORS is configured correctly</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default Installation;

