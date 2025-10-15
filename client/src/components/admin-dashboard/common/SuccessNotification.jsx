import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const SuccessNotification = ({ message, isVisible, onClose, duration = 5000 }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isShowing ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className="bg-white border border-green-200 rounded-lg shadow-2xl p-4 max-w-sm">
        <div className="flex items-start gap-3">
          {/* Animated Success Icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <FiCheckCircle className="text-green-600 text-lg animate-bounce" />
            </div>
          </div>
          
          {/* Message Content */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Success!
            </h4>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-lg" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all ease-linear"
            style={{
              animation: `shrink ${duration}ms linear`,
              width: isShowing ? '0%' : '100%'
            }}
          ></div>
        </div>
      </div>
      
      {/* Styles for the shrinking animation */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default SuccessNotification;