import React from 'react';
import DocsLayout from '../DocsLayout';
import CodeBlock from '../../components/CodeBlock';
import '../Introduction.css';

const APIAttendance = () => {
  return (
    <DocsLayout>
      <div className="introduction-page">
        <h1>Attendance API</h1>
        <p className="intro-subtitle">
          API endpoints for attendance tracking and management.
        </p>

        <h2 id="check-in">Check In</h2>
        <CodeBlock language="javascript">
{`POST /api/attendance/checkin
Authorization: Bearer {token}
Content-Type: application/json

{
  "workMode": "office",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "photo": "base64_image_data"
}`}
        </CodeBlock>

        <h2 id="get-attendance">Get Attendance Records</h2>
        <CodeBlock language="javascript">
{`GET /api/attendance?userId=123&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}`}
        </CodeBlock>
      </div>
    </DocsLayout>
  );
};

export default APIAttendance;

