// config/emailConfig.js
const nodemailer = require('nodemailer');

// Email Configuration
// Make sure to set these environment variables in your .env file:
// NOTIFY_EMAIL=technologyrk001@gmail.com
// NOTIFY_PASSWORD=whoamihacker
// 
// For Gmail, you may need to use an "App Password" instead of your regular password
// if 2FA is enabled. Generate one at: https://myaccount.google.com/apppasswords

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred SMTP service
  auth: {
    user: process.env.NOTIFY_EMAIL || 'technologyrk001@gmail.com',
    pass: process.env.NOTIFY_PASSWORD || 'whoamihacker',
  },
});

module.exports = transporter;
