const timeSheetController = require('../controllers/timeSheetController');

/**
 * Setup task cleanup job
 * Runs cleanup for deleted tasks every 24 hours
 */
const setupTaskCleanup = () => {
  const cleanupInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Run cleanup immediately on startup, then every 24 hours
  if (timeSheetController.cleanupDeletedTasks) {
    timeSheetController.cleanupDeletedTasks();
    setInterval(() => {
      timeSheetController.cleanupDeletedTasks();
    }, cleanupInterval);
    console.log('Task cleanup job scheduled (runs every 24 hours)');
  } else {
    console.warn('cleanupDeletedTasks method not found in timeSheetController');
  }
};

module.exports = {
  setupTaskCleanup,
};

