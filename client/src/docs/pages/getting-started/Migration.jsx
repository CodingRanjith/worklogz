import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import FeatureCard from '../../components/FeatureCard';
import '../Introduction.css';

const Migration = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Migration Guide</h1>
        <p className="intro-subtitle">
          Migrate from previous versions of Worklogz or from other workforce management systems.
        </p>

        <h2 id="from-v1">Migrating from Version 1</h2>
        <p>If you're upgrading from Worklogz v1, follow these steps:</p>
        
        <h3>Step 1: Backup Your Data</h3>
        <CodeBlock language="bash">
{`# Export your MongoDB database
mongodump --db worklogz --out ./backup

# Or use MongoDB Compass to export collections`}
        </CodeBlock>

        <h3>Step 2: Update Dependencies</h3>
        <CodeBlock language="bash">
{`# Update package.json dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install`}
        </CodeBlock>

        <h3>Step 3: Database Migration</h3>
        <p>Run database migration scripts:</p>
        <CodeBlock language="bash">
{`# Run migration script
npm run migrate

# Verify migration
npm run verify-migration`}
        </CodeBlock>

        <h3>Step 4: Update Configuration</h3>
        <p>Update your configuration files to match the new structure.</p>

        <h2 id="from-other-systems">Migrating from Other Systems</h2>
        <p>Migrate data from other workforce management systems:</p>

        <h3>CSV Import</h3>
        <p>Use the CSV import feature to migrate user data:</p>
        <ol>
          <li>Export your data from the old system as CSV</li>
          <li>Format the CSV according to Worklogz requirements</li>
          <li>Use the Admin panel to import users</li>
          <li>Verify imported data</li>
        </ol>

        <h3>API Migration</h3>
        <p>Use the API to programmatically migrate data:</p>
        <CodeBlock language="javascript">
{`// Example migration script
const migrateUsers = async (oldSystemUsers) => {
  for (const user of oldSystemUsers) {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
        // Map other fields
      })
    });
  }
};`}
        </CodeBlock>

        <h2 id="data-mapping">Data Mapping</h2>
        <p>Map fields from your old system to Worklogz:</p>
        <table>
          <thead>
            <tr>
              <th>Old System Field</th>
              <th>Worklogz Field</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Employee ID</td>
              <td>employeeId</td>
            </tr>
            <tr>
              <td>Full Name</td>
              <td>name</td>
            </tr>
            <tr>
              <td>Email Address</td>
              <td>email</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>department</td>
            </tr>
            <tr>
              <td>Position</td>
              <td>position</td>
            </tr>
          </tbody>
        </table>

        <h2 id="verification">Post-Migration Verification</h2>
        <p>After migration, verify:</p>
        <ul>
          <li>All users are imported correctly</li>
          <li>Department structure is maintained</li>
          <li>Historical data is preserved</li>
          <li>Permissions and roles are correct</li>
          <li>Payroll data is accurate</li>
        </ul>

        <h2 id="rollback">Rollback Plan</h2>
        <p>If migration fails, you can rollback:</p>
        <ol>
          <li>Stop the application</li>
          <li>Restore database from backup</li>
          <li>Revert code changes</li>
          <li>Restart application</li>
        </ol>

        <div className="features-grid">
          <FeatureCard
            icon="💾"
            title="Data Backup"
            description="Always backup before migration"
          />
          <FeatureCard
            icon="✅"
            title="Verification"
            description="Verify data after migration"
          />
          <FeatureCard
            icon="🔄"
            title="Rollback Ready"
            description="Have a rollback plan ready"
          />
        </div>
      </div>
    </DocsLayout>
  );
};

export default Migration;

