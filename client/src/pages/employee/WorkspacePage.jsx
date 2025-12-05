import React from 'react';
import { useNavigate } from 'react-router-dom';
import MyWorkspace from '../../components/attendance/MyWorkspace';

const WorkspacePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/attendance');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <MyWorkspace onBack={handleBack} />
      </div>
    </div>
  );
};

export default WorkspacePage;

