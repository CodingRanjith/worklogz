/**
 * Daily Credit Cron Job
 * 
 * This script automatically applies daily salary credits to eligible users.
 * It should be scheduled to run once per day (e.g., at midnight).
 * 
 * Setup Options:
 * 
 * 1. Using node-cron (recommended for development/single server):
 *    - Install: npm install node-cron
 *    - Add to your server index.js:
 *      const cron = require('node-cron');
 *      const { applyDailyCredits } = require('./controllers/dailySalaryController');
 *      
 *      // Run every day at midnight (00:00)
 *      cron.schedule('0 0 * * *', async () => {
 *        console.log('Running daily credit application...');
 *        try {
 *          await applyDailyCredits();
 *          console.log('Daily credits applied successfully');
 *        } catch (error) {
 *          console.error('Error applying daily credits:', error);
 *        }
 *      });
 * 
 * 2. Using System Cron (Linux/Unix):
 *    - Run: crontab -e
 *    - Add: 0 0 * * * cd /path/to/project && node server/scripts/dailyCreditCron.js
 * 
 * 3. Using Windows Task Scheduler:
 *    - Create a new task that runs daily
 *    - Action: node C:\path\to\project\server\scripts\dailyCreditCron.js
 * 
 * 4. Using Heroku Scheduler (for Heroku deployments):
 *    - Add Heroku Scheduler addon
 *    - Create a daily job: node server/scripts/dailyCreditCron.js
 * 
 * 5. Using Render Cron Jobs (for Render deployments):
 *    - Add a Cron Job service
 *    - Schedule: 0 0 * * *
 *    - Command: node server/scripts/dailyCreditCron.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// Connect to database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for cron job');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Run the cron job
async function runCronJob() {
  console.log('=== Daily Credit Cron Job Started ===');
  console.log('Time:', new Date().toISOString());

  try {
    await connectDB();
    
    // Import the controller function
    const { applyDailyCredits } = require('../controllers/dailySalaryController');
    
    // Apply daily credits
    const result = await applyDailyCredits();
    
    console.log('✅ Daily credits applied successfully!');
    console.log('Users updated:', result.totalUsersUpdated);
    console.log('Details:', JSON.stringify(result.details, null, 2));
    
  } catch (error) {
    console.error('❌ Error in cron job:', error);
  } finally {
    await mongoose.connection.close();
    console.log('=== Daily Credit Cron Job Completed ===\n');
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  runCronJob();
}

module.exports = { runCronJob };

