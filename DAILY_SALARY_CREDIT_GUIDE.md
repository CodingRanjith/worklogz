# Daily Salary Credit System - Complete Guide

## 🎯 Overview

The Daily Salary Credit system allows administrators to configure automatic daily salary credits for employees. These credits are accumulated in each employee's account and can be viewed on their dashboard.

## ✨ Features

### For Admins
- ✅ **Create unlimited salary credit configurations**
- ✅ **CRUD operations** (Create, Read, Update, Delete)
- ✅ **Flexible targeting**: Apply to all employees, specific departments, or specific users
- ✅ **Date-based scheduling**: Set start and end dates for credit periods
- ✅ **Auto-apply toggle**: Enable/disable automatic daily application
- ✅ **Status management**: Activate or deactivate configurations
- ✅ **Manual application**: Apply credits immediately without waiting
- ✅ **Real-time statistics**: View total configs, active configs, users with earnings, and total earnings
- ✅ **Smart duplicate prevention**: Credits are applied only once per day per user

### For Employees
- ✅ **View accumulated daily earnings** on their dashboard
- ✅ **See last credit date** for transparency
- ✅ **Beautiful card UI** with gradient design
- ✅ **Real-time updates** when credits are applied

## 📁 Files Created/Modified

### Backend Files
1. **`server/models/DailySalaryConfig.js`** - Database model for salary configurations
2. **`server/controllers/dailySalaryController.js`** - Business logic and CRUD operations
3. **`server/routes/dailySalaryRoutes.js`** - API endpoints
4. **`server/scripts/dailyCreditCron.js`** - Automated cron job script
5. **`server/models/User.js`** - Updated with `dailyEarnings` and `lastDailyCreditDate` fields
6. **`server/index.js`** - Added daily salary routes

### Frontend Files
1. **`client/src/pages/admin/DailySalaryCredit.jsx`** - Admin management page
2. **`client/src/components/attendance/DailyEarningsCard.jsx`** - Employee earnings display
3. **`client/src/utils/api.js`** - Added API endpoints
4. **`client/src/App.js`** - Added route for daily salary page
5. **`client/src/components/admin-dashboard/layout/Sidebar.jsx`** - Added menu item
6. **`client/src/pages/employee/AttendancePage.jsx`** - Integrated earnings card

## 🚀 Getting Started

### 1. Start Your Server
```bash
cd server
npm start
```

### 2. Start Your Client
```bash
cd client
npm start
```

### 3. Access Admin Dashboard
1. Login as admin
2. Navigate to **"Daily Salary Credit"** from the sidebar
3. You'll see the management dashboard

## 📖 Usage Guide

### Creating a Daily Credit Configuration

1. **Click "Create New Config"**
2. **Fill in the form:**
   - **Name**: Give it a descriptive name (e.g., "Daily Attendance Bonus")
   - **Amount**: Enter the daily credit amount in rupees (e.g., 100)
   - **Description**: Optional explanation
   - **Applies To**: Choose who gets this credit:
     - **All Employees**: Everyone in the system
     - **Specific Departments**: Select departments from checkboxes
     - **Specific Users**: Select individual users from the list
   - **Start Date**: When to begin applying credits
   - **End Date**: Optional end date (leave blank for no end)
   - **Auto Apply**: Enable for automatic daily application
   - **Active**: Enable to activate immediately

3. **Click "Create"**

### Editing a Configuration

1. Click the **Edit (pencil) icon** next to any configuration
2. Modify the fields as needed
3. Click **"Update"**

### Deleting a Configuration

1. Click the **Delete (trash) icon** next to any configuration
2. Confirm the deletion

### Toggling Status

- Click the **Toggle icon** to quickly enable/disable a configuration
- Active configs show a green "Active" badge
- Inactive configs show a red "Inactive" badge

### Applying Credits Manually

1. Click the **"Apply Credits Now"** button at the top
2. Confirm the action
3. A success message will show how many users were updated

### Viewing Statistics

The top of the page shows:
- **Total Configs**: Number of configurations created
- **Active Configs**: Number of currently active configurations
- **Users with Earnings**: How many employees have accumulated credits
- **Total Earnings**: Sum of all accumulated credits across all users

## 🤖 Automatic Daily Application

### Option 1: Using node-cron (Recommended for Development)

1. **Install node-cron:**
```bash
cd server
npm install node-cron
```

2. **Add to `server/index.js`:**
```javascript
const cron = require('node-cron');
const { applyDailyCredits } = require('./controllers/dailySalaryController');

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily credit application...');
  try {
    const result = await applyDailyCredits();
    console.log('Daily credits applied successfully:', result);
  } catch (error) {
    console.error('Error applying daily credits:', error);
  }
});
```

3. **Restart your server**

### Option 2: Manual Cron Job (Production)

**For Linux/Unix:**
```bash
crontab -e
```

Add this line:
```
0 0 * * * cd /path/to/worklogz/server && node scripts/dailyCreditCron.js
```

**For Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 12:00 AM
4. Set action: Start a program
5. Program: `node`
6. Arguments: `C:\path\to\worklogz\server\scripts\dailyCreditCron.js`

### Option 3: Heroku Scheduler

1. Add Heroku Scheduler addon:
```bash
heroku addons:create scheduler:standard
```

2. Open scheduler dashboard:
```bash
heroku addons:open scheduler
```

3. Add a new job:
   - Frequency: Daily
   - Command: `node server/scripts/dailyCreditCron.js`

### Option 4: Render Cron Jobs

1. In Render Dashboard, create a new **Cron Job**
2. Set schedule: `0 0 * * *` (daily at midnight)
3. Set command: `node server/scripts/dailyCreditCron.js`

## 🎨 How It Works

### Backend Logic

1. **Configuration Creation**: Admins create salary credit configs with targeting rules
2. **Automatic Application**: Each day at midnight (if cron is set up):
   - System finds all active configs with `autoApply: true`
   - For each config, it identifies eligible users based on `appliesTo` rules
   - Credits are added to user's `dailyEarnings` field
   - `lastDailyCreditDate` is updated to prevent duplicate credits
   - Config's `lastAppliedDate` is updated

3. **Duplicate Prevention**: 
   - Each user can receive credits only once per day per config
   - System checks `lastDailyCreditDate` before applying

### Frontend Display

1. **Admin Dashboard**: Full CRUD interface with statistics
2. **Employee Dashboard**: Earnings card showing:
   - Total accumulated credits
   - Last credit date
   - Beautiful gradient design with icons

## 🔒 Security

- All admin endpoints require authentication and admin role
- Employee endpoints are protected by authentication
- Employees can only view their own earnings
- Admins can view and manage all configurations

## 📊 API Endpoints

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/daily-salary/config` | Create new config |
| GET | `/api/daily-salary/config` | Get all configs |
| GET | `/api/daily-salary/config/:id` | Get single config |
| PUT | `/api/daily-salary/config/:id` | Update config |
| DELETE | `/api/daily-salary/config/:id` | Delete config |
| PATCH | `/api/daily-salary/config/:id/toggle` | Toggle active status |
| POST | `/api/daily-salary/apply-credits` | Manually apply credits |
| GET | `/api/daily-salary/stats` | Get statistics |
| POST | `/api/daily-salary/reset-earnings/:userId` | Reset user earnings |

### Employee Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/daily-salary/earnings/me` | Get my earnings |
| GET | `/api/daily-salary/earnings/:userId` | Get user earnings |

## 🎯 Use Cases

### Example 1: Daily Attendance Bonus
- **Name**: "Daily Attendance Bonus"
- **Amount**: ₹100
- **Applies To**: All Employees
- **Description**: "Bonus for attending work daily"

### Example 2: Department-Specific Bonus
- **Name**: "Engineering Performance Bonus"
- **Amount**: ₹150
- **Applies To**: Specific Departments → Engineering
- **Description**: "Special bonus for engineering team"

### Example 3: Temporary Promotion
- **Name**: "Festival Season Bonus"
- **Amount**: ₹200
- **Applies To**: All Employees
- **Start Date**: 2025-11-01
- **End Date**: 2025-11-30
- **Description**: "Special bonus for festival season"

### Example 4: Individual Recognition
- **Name**: "Star Performer Bonus"
- **Amount**: ₹300
- **Applies To**: Specific Users → (Select specific employees)
- **Description**: "Recognition for outstanding performance"

## 🔧 Troubleshooting

### Credits Not Being Applied Automatically?
1. Check if cron job is set up correctly
2. Verify config is **Active** and **Auto Apply** is enabled
3. Check start/end dates are valid
4. Look at server logs for errors

### Can't See Earnings on Employee Dashboard?
1. Ensure you're logged in as an employee (not viewing as admin)
2. Check if any credits have been applied to your account
3. Verify the DailyEarningsCard component is imported correctly

### Manual Apply Not Working?
1. Check server logs for errors
2. Ensure you're logged in as admin
3. Verify database connection is active

## 💡 Tips & Best Practices

1. **Start Simple**: Begin with one config for all employees
2. **Test First**: Use manual apply to test before enabling auto-apply
3. **Monitor Stats**: Regularly check the statistics dashboard
4. **Set End Dates**: For promotional bonuses, always set end dates
5. **Use Descriptions**: Add clear descriptions to help track purposes
6. **Regular Backups**: Backup your database regularly
7. **Log Monitoring**: Keep an eye on cron job logs

## 🎉 Success!

You now have a complete Daily Salary Credit system! Your employees can see their accumulated earnings, and you can manage everything from the admin dashboard.

---

**Need Help?** Check the server logs or contact your system administrator.

**Want to Customize?** All components are modular and can be easily modified to fit your needs.

