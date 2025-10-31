# 💰 Daily Earnings Setup & Troubleshooting Guide

## ✅ What Has Been Implemented

### Backend (Server)
1. **Model**: `DailySalaryConfig.js` - Stores daily salary credit configurations
2. **Controller**: `dailySalaryController.js` - Handles all CRUD operations
3. **Routes**: `dailySalaryRoutes.js` - API endpoints for daily salary
4. **Updated User Model**: Added `dailyEarnings` and `lastDailyCreditDate` fields

### Frontend (Client)
1. **Admin Page**: `DailySalaryCredit.jsx` - Full CRUD interface for managing credits
2. **Employee Component**: `DailyEarningsCard.jsx` - Displays earnings on employee dashboard
3. **API Endpoints**: Added to `api.js`
4. **Routes**: Added to `App.js`
5. **Sidebar**: Added menu item for admin

---

## 🔍 How to Verify It's Working

### Step 1: Check if Server is Running
```bash
cd server
node index.js
```

**Expected Output:**
```
MongoDB connected
Server running on port 5000
```

### Step 2: Login as Admin
1. Go to `http://localhost:3000/login`
2. Login with admin credentials
3. Navigate to **"Daily Salary Credit"** from the sidebar

### Step 3: Create a Daily Credit Configuration
1. Click **"Create New Config"**
2. Fill in the form:
   - **Name**: "Daily Attendance Bonus"
   - **Amount**: 100 (or any amount)
   - **Applies To**: "All Employees" (for testing)
   - **Auto Apply**: ✅ Enabled
   - **Active**: ✅ Enabled
3. Click **"Create"**

### Step 4: Apply Credits Manually (For Testing)
1. On the Daily Salary Credit page
2. Click **"Apply Credits Now"** button
3. Confirm the action
4. You should see a success message with number of users updated

### Step 5: Check Employee Side
1. Logout from admin account
2. Login as an employee
3. Go to Attendance page (`/attendance`)
4. **Look for the GREEN CARD** that says **"Daily Earnings"**
5. It should show your accumulated credits (₹100.00 if you just applied)

---

## 🐛 Troubleshooting

### Problem 1: "Daily Earnings Card Not Showing"

**Possible Causes:**
1. You're viewing someone else's attendance (not your own)
2. API endpoint is failing
3. Token authentication issue

**Solutions:**

**Check Console Logs:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for "Daily Earnings Response:" log
4. Check if there are any errors

**Verify API Endpoint:**
```javascript
// In browser console, test the API:
fetch('http://localhost:5000/api/daily-salary/earnings/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "name": "User Name",
    "email": "user@example.com",
    "dailyEarnings": 100,
    "lastDailyCreditDate": "2025-10-31T00:00:00.000Z"
  }
}
```

---

### Problem 2: "Card Shows ₹0.00"

**This is Normal if:**
- No credits have been applied yet
- User is not eligible for any active configurations
- Credits haven't been processed today

**To Fix:**
1. Go to Admin → Daily Salary Credit
2. Click **"Apply Credits Now"**
3. Refresh employee page

---

### Problem 3: "Backend Error on Apply Credits"

**Check Server Logs:**
```bash
# In server terminal, you should see:
✅ Daily credits applied successfully
Users updated: 5
```

**If you see errors:**
1. Check MongoDB connection
2. Verify User model has `dailyEarnings` field
3. Check if DailySalaryConfig documents exist

---

### Problem 4: "404 Error - Route Not Found"

**Verify routes are registered:**

**In `server/index.js`:**
```javascript
app.use('/api/daily-salary', require('./routes/dailySalaryRoutes'));
```

**Restart the server:**
```bash
# Stop server (Ctrl+C)
node index.js
```

---

## 📊 Quick Test Checklist

- [ ] Server is running on port 5000
- [ ] MongoDB is connected
- [ ] Can access `/daily-salary-credit` page as admin
- [ ] Can create a new configuration
- [ ] "Apply Credits Now" button works
- [ ] Green earnings card shows on employee `/attendance` page
- [ ] Amount updates when credits are applied
- [ ] Last credit date is displayed

---

## 🎯 Testing Scenarios

### Scenario 1: New Employee (No Earnings Yet)
**Expected Result:**
- Card shows ₹0.00
- Last credit: "Not yet credited"
- Card is still visible

### Scenario 2: After First Credit Application
**Expected Result:**
- Card shows ₹100.00 (or configured amount)
- Last credit: Today's date
- Green gradient card with trophy emoji

### Scenario 3: Multiple Credits Over Days
**Expected Result:**
- Amount accumulates: ₹100, ₹200, ₹300...
- Last credit date updates each day
- Historical data is preserved

---

## 🔄 Automatic Daily Credits (Optional)

### Option 1: Using node-cron (Recommended)

**Install:**
```bash
cd server
npm install node-cron
```

**Add to `server/index.js`:**
```javascript
const cron = require('node-cron');
const { applyDailyCredits } = require('./controllers/dailySalaryController');

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily credit application...');
  try {
    await applyDailyCredits();
    console.log('Daily credits applied successfully');
  } catch (error) {
    console.error('Error applying daily credits:', error);
  }
});
```

### Option 2: Manual Cron Script

**Use the provided script:**
```bash
node server/scripts/dailyCreditCron.js
```

**Schedule with Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 12:00 AM
4. Action: Start a program
5. Program: `node`
6. Arguments: `C:\path\to\worklogz\server\scripts\dailyCreditCron.js`

---

## 💡 Common Questions

### Q: Where is the earnings data stored?
**A:** In the `users` collection, in the `dailyEarnings` field of each user document.

### Q: Can I reset a user's earnings?
**A:** Yes! In the admin dashboard (coming soon), or via API:
```javascript
POST /api/daily-salary/reset-earnings/:userId
```

### Q: Can different departments have different credit amounts?
**A:** Yes! When creating a configuration, choose "Specific Departments" and set the amount.

### Q: How do I see all users' earnings?
**A:** Navigate to the Daily Salary Credit page as admin and check the statistics.

### Q: Can I export earnings data?
**A:** Not yet implemented, but you can add it to the admin page with CSV export.

---

## 🚀 Next Steps

1. **Test the basic flow** (Create config → Apply → View on employee side)
2. **Set up automatic daily application** (Use cron job)
3. **Monitor the system** for a few days
4. **Adjust configurations** as needed
5. **Consider adding**:
   - Earnings history page
   - CSV export of earnings
   - Email notifications when credits are applied
   - Earnings reset at month-end
   - Payslip integration

---

## 📞 Still Having Issues?

1. **Check Browser Console** (F12 → Console tab)
2. **Check Server Logs** (Terminal where server is running)
3. **Verify Database** (Use MongoDB Compass to check data)
4. **Test API Directly** (Use Postman or browser fetch)

---

## 🎉 Success Indicators

When everything is working, you should see:

### Admin Side:
✅ Daily Salary Credit page loads
✅ Can create/edit/delete configurations
✅ Statistics show correct numbers
✅ "Apply Credits Now" works without errors

### Employee Side:
✅ Beautiful green gradient card on attendance page
✅ Shows current earnings amount
✅ Shows last credit date
✅ Updates in real-time when credits are applied

---

**Last Updated:** October 31, 2025  
**Status:** Fully Implemented ✅

