/**
 * CRON JOB SETUP EXAMPLE
 * 
 * This file shows how to add automatic daily credit application to your server.
 * 
 * STEP 1: Install node-cron
 * Run: npm install node-cron
 * 
 * STEP 2: Add this code to your server/index.js file
 * Copy the code below and paste it near the end of index.js, before startServer()
 */

// ============= COPY BELOW THIS LINE =============

const cron = require('node-cron');
const { applyDailyCredits } = require('./controllers/dailySalaryController');

// Setup Cron Job for Daily Salary Credits
// Runs every day at midnight (00:00)
// Cron format: '* * * * * *' = second minute hour day month weekday
// Our format: '0 0 * * *' = 0 minutes, 0 hours (midnight), every day, every month, every weekday
cron.schedule('0 0 * * *', async () => {
  console.log('========================================');
  console.log('🤖 CRON JOB: Applying Daily Salary Credits');
  console.log('Time:', new Date().toLocaleString());
  console.log('========================================');
  
  try {
    const result = await applyDailyCredits();
    
    console.log('✅ SUCCESS: Daily credits applied!');
    console.log('📊 Statistics:');
    console.log('   - Total Users Updated:', result.totalUsersUpdated);
    console.log('   - Configs Applied:', result.details.length);
    
    result.details.forEach((detail, index) => {
      console.log(`\n   Config ${index + 1}:`);
      console.log(`   - Name: ${detail.configName}`);
      console.log(`   - Amount: ₹${detail.amount}`);
      console.log(`   - Users Updated: ${detail.usersUpdated}`);
    });
    
    console.log('\n========================================\n');
  } catch (error) {
    console.error('❌ ERROR: Failed to apply daily credits');
    console.error('Details:', error.message);
    console.error('Stack:', error.stack);
    console.log('========================================\n');
  }
}, {
  timezone: 'Asia/Kolkata' // Set your timezone here
  // Other options: 'America/New_York', 'Europe/London', 'Asia/Tokyo', etc.
});

console.log('✅ Daily Salary Credit Cron Job scheduled successfully!');
console.log('⏰ Will run daily at midnight (00:00)');

// ============= COPY ABOVE THIS LINE =============

/**
 * ALTERNATIVE SCHEDULES:
 * 
 * Run every hour:
 * cron.schedule('0 * * * *', async () => { ... });
 * 
 * Run every day at 9 AM:
 * cron.schedule('0 9 * * *', async () => { ... });
 * 
 * Run every Monday at midnight:
 * cron.schedule('0 0 * * 1', async () => { ... });
 * 
 * Run every 1st of the month at midnight:
 * cron.schedule('0 0 1 * *', async () => { ... });
 * 
 * Run every 5 minutes (for testing):
 * cron.schedule('*/5 * * * *', async () => { ... });
 */

/**
 * TESTING THE CRON JOB:
 * 
 * For testing, you can temporarily change the schedule to run every minute:
 * cron.schedule('* * * * *', async () => { ... });
 * 
 * Or use the manual API endpoint:
 * POST http://localhost:5000/api/daily-salary/apply-credits
 * Headers: { Authorization: Bearer YOUR_ADMIN_TOKEN }
 */

/**
 * TIMEZONE OPTIONS:
 * 
 * - 'Asia/Kolkata' - India
 * - 'America/New_York' - US Eastern
 * - 'America/Los_Angeles' - US Pacific
 * - 'Europe/London' - UK
 * - 'Europe/Paris' - Central Europe
 * - 'Asia/Tokyo' - Japan
 * - 'Australia/Sydney' - Australia
 * 
 * See full list at: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */

