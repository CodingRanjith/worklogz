import React from 'react';
import DocsLayout from './DocsLayout';
import CodeBlock from '../components/CodeBlock';
import FeatureCard from '../components/FeatureCard';
import './Introduction.css';

const SelfHosted = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Self-Hosted Solution: Host on Your Own Server</h1>
        <p className="intro-subtitle">
          Steps, requirements, benefits, and security perks of hosting Worklogz on your own infrastructure.
        </p>

        <h2 id="overview">Overview</h2>
        <p>
          Self-hosting Worklogz gives you complete control over your data and infrastructure. 
          This option is ideal for organizations with specific compliance requirements, data 
          residency needs, or those who prefer managing their own infrastructure.
        </p>

        <h2 id="benefits">Benefits</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🔒"
            title="Data Sovereignty"
            description="Complete control over your data and where it's stored"
          />
          <FeatureCard
            icon="⚙️"
            title="Full Control"
            description="Customize and configure everything according to your needs"
          />
          <FeatureCard
            icon="🛡️"
            title="Enhanced Security"
            description="Implement your own security policies and controls"
          />
          <FeatureCard
            icon="💰"
            title="Cost Control"
            description="No recurring cloud subscription fees"
          />
        </div>

        <h2 id="requirements">System Requirements</h2>
        
        <h3>Server Specifications</h3>
        <ul>
          <li><strong>CPU:</strong> 4+ cores recommended</li>
          <li><strong>RAM:</strong> 8GB minimum (16GB recommended)</li>
          <li><strong>Storage:</strong> 100GB+ SSD storage</li>
          <li><strong>OS:</strong> Linux (Ubuntu 20.04+, CentOS 7+, or similar)</li>
          <li><strong>Network:</strong> Stable internet connection</li>
        </ul>

        <h3>Software Requirements</h3>
        <ul>
          <li>Node.js version 16.x or higher</li>
          <li>MongoDB version 4.4 or higher</li>
          <li>npm or yarn package manager</li>
          <li>Nginx or Apache web server</li>
          <li>SSL certificate (Let's Encrypt or commercial)</li>
        </ul>

        <h2 id="installation-steps">Installation Steps</h2>
        
        <h3>Step 1: Server Setup</h3>
        <CodeBlock language="bash">
{`# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install -y mongodb-org`}
        </CodeBlock>

        <h3>Step 2: Application Installation</h3>
        <CodeBlock language="bash">
{`# Clone repository
git clone https://github.com/your-org/worklogz.git
cd worklogz

# Install dependencies
cd server && npm install
cd ../client && npm install`}
        </CodeBlock>

        <h3>Step 3: Configuration</h3>
        <CodeBlock language="bash">
{`# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your configuration

# Configure MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod`}
        </CodeBlock>

        <h3>Step 4: Build and Start</h3>
        <CodeBlock language="bash">
{`# Build frontend
cd client && npm run build

# Start backend server
cd ../server && npm start

# Set up process manager (PM2)
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save`}
        </CodeBlock>

        <h2 id="security">Security Perks</h2>
        <h3>Security Advantages</h3>
        <ul>
          <li><strong>Network Isolation:</strong> Keep data on your private network</li>
          <li><strong>Custom Firewalls:</strong> Implement your own firewall rules</li>
          <li><strong>Access Control:</strong> Control who can access the system</li>
          <li><strong>Audit Logging:</strong> Complete control over audit logs</li>
          <li><strong>Encryption:</strong> Implement your encryption standards</li>
        </ul>

        <h3>Security Best Practices</h3>
        <ul>
          <li>Use HTTPS with valid SSL certificates</li>
          <li>Implement firewall rules to restrict access</li>
          <li>Regular security updates and patches</li>
          <li>Strong authentication mechanisms</li>
          <li>Regular backup procedures</li>
          <li>Monitor system logs for suspicious activity</li>
        </ul>

        <h2 id="maintenance">Maintenance</h2>
        <h3>Ongoing Maintenance Tasks</h3>
        <ul>
          <li>Regular system updates</li>
          <li>Database backups</li>
          <li>Application updates</li>
          <li>Security patches</li>
          <li>Performance monitoring</li>
          <li>Log management</li>
        </ul>

        <h2 id="backup">Backup Strategy</h2>
        <ul>
          <li>Automated daily database backups</li>
          <li>File storage backups</li>
          <li>Configuration backup</li>
          <li>Off-site backup storage</li>
          <li>Regular backup testing</li>
        </ul>

        <h2 id="support">Support Resources</h2>
        <p>
          When self-hosting, you have access to:
        </p>
        <ul>
          <li>Installation documentation</li>
          <li>Community support forums</li>
          <li>Technical documentation</li>
          <li>Optional professional support services</li>
        </ul>
      </div>
    </DocsLayout>
  );
};

export default SelfHosted;

