import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" />;
      case 'info':
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`${getBgColor()} border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-xl">
          {getIcon()}
        </div>
        <div className="flex-1">
          {notification.title && (
            <h4 className="font-semibold text-gray-800 mb-1">
              {notification.title}
            </h4>
          )}
          <p className="text-gray-700 text-sm">{notification.message}</p>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, title, duration) => {
    return addNotification({ type: 'success', message, title, duration });
  }, [addNotification]);

  const showError = useCallback((message, title, duration) => {
    return addNotification({ type: 'error', message, title, duration });
  }, [addNotification]);

  const showWarning = useCallback((message, title, duration) => {
    return addNotification({ type: 'warning', message, title, duration });
  }, [addNotification]);

  const showInfo = useCallback((message, title, duration) => {
    return addNotification({ type: 'info', message, title, duration });
  }, [addNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-96 max-w-sm">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;