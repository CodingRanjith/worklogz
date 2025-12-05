import React from 'react';
import { useNavigate } from 'react-router-dom';
import TechAIChat from '../../components/assistant/TechAIChat';

const AICopilotPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/attendance');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <TechAIChat variant="inline" onBack={handleBack} />
      </div>
    </div>
  );
};

export default AICopilotPage;

