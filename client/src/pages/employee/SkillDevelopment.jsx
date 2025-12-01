import React from 'react';
import { useNavigate } from 'react-router-dom';
import SkillDevelopmentChat from '../../components/assistant/SkillDevelopmentChat';
import { FiArrowLeft } from 'react-icons/fi';

const SkillDevelopment = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Skill Development Assistant
          </h1>
          <p className="text-gray-600">
            Get personalized guidance for your professional growth and skill development
          </p>
        </div>
        
        <SkillDevelopmentChat variant="panel" onBack={handleBack} />
      </div>
    </div>
  );
};

export default SkillDevelopment;

