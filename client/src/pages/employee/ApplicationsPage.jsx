import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationsHub from '../../components/attendance/ApplicationsHub';

const ApplicationsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/attendance');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <ApplicationsHub onBack={handleBack} />
      </div>
    </div>
  );
};

export default ApplicationsPage;

