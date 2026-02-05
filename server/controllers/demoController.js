const transporter = require('../config/emailConfig');

const demoController = {
  requestDemo: async (req, res) => {
    try {
      const { name, email, phone, company, category, whiteLabel, whiteLabelType, worklogzModules, message, preferredDate, preferredTime } = req.body;

      // Validate required fields
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and phone are required fields'
        });
      }

      // Email options for admin notification
      const mailOptions = {
        from: process.env.NOTIFY_EMAIL || 'technologyrk001@gmail.com',
        to: 'techackode@gmail.com',
        subject: '🚀 New Demo Request - Worklogz',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; background: #f9f9ff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin: 0; font-size: 28px;">🎯 Demo Request</h1>
              <p style="color: #666; margin-top: 10px;">New demo request received for Worklogz</p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-bottom: 20px;">Contact Information</h2>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">👤 Name:</strong>
                <span style="color: #333;">${name}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">📧 Email:</strong>
                <span style="color: #333;"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">📱 Phone:</strong>
                <span style="color: #333;"><a href="tel:${phone}" style="color: #6366f1; text-decoration: none;">${phone}</a></span>
              </div>
              
              ${company ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">🏢 Company:</strong>
                <span style="color: #333;">${company}</span>
              </div>
              ` : ''}
              
              ${category ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">📋 Category:</strong>
                <span style="color: #333; text-transform: capitalize;">${category.replace(/-/g, ' ')}</span>
              </div>
              ` : ''}
              
              ${whiteLabel ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">🏷️ White Label:</strong>
                <span style="color: #10b981; font-weight: 600;">✓ Yes, Interested</span>
              </div>
              ` : ''}
              
              ${whiteLabelType ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">📦 White Label Type:</strong>
                <span style="color: #333;">${whiteLabelType === 'plan-based-subscription' ? 'Plan-based subscription' : whiteLabelType === 'fully-integrated-custom' ? 'Fully integrated / Custom' : whiteLabelType}</span>
              </div>
              ` : ''}
              
              ${worklogzModules && worklogzModules.length > 0 ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: block; margin-bottom: 8px;">🎯 Worklogz Modules:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${worklogzModules.map(module => `
                    <span style="background: #eef2ff; color: #6366f1; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">
                      ${module}
                    </span>
                  `).join('')}
                </div>
              </div>
              ` : ''}
              
              ${preferredDate ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">📅 Preferred Date:</strong>
                <span style="color: #333;">${preferredDate}</span>
              </div>
              ` : ''}
              
              ${preferredTime ? `
              <div style="margin-bottom: 15px;">
                <strong style="color: #6366f1; display: inline-block; width: 140px;">🕐 Preferred Time:</strong>
                <span style="color: #333;">${preferredTime}</span>
              </div>
              ` : ''}
              
              ${message ? `
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <strong style="color: #6366f1; display: block; margin-bottom: 10px;">💬 Message:</strong>
                <div style="color: #333; background: #f5f5f5; padding: 15px; border-radius: 5px; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 5px;">
              <p style="margin: 0; font-weight: 600; color: #1e40af; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">🔔</span>
                <span>Action Required: Follow up with this potential customer</span>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #4b5563;">
                Please contact them at <a href="mailto:${email}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${email}</a> or <a href="tel:${phone}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${phone}</a> to schedule the demo.
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 15px;">
              <p style="margin: 0;">📅 Request submitted on ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0 0 0; font-weight: 600;">Worklogz - Techackode</p>
            </div>
          </div>
        `
      };

      // Send confirmation email to the requester
      const confirmationMailOptions = {
        from: process.env.NOTIFY_EMAIL || 'technologyrk001@gmail.com',
        to: email,
        subject: 'Thank You for Your Demo Request - Worklogz',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; background: #f9f9ff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin: 0; font-size: 28px;">Thank You, ${name}! 🙏</h1>
              <p style="color: #666; margin-top: 10px;">We've received your demo request</p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #333; line-height: 1.6; font-size: 16px;">
                Hello <strong>${name}</strong>,
              </p>
              
              <p style="color: #333; line-height: 1.6;">
                Thank you for your interest in Worklogz! We've received your demo request and our team will get back to you shortly.
              </p>
              
              <div style="margin: 25px 0; padding: 20px; background: #eef2ff; border-radius: 5px;">
                <h3 style="color: #6366f1; margin-top: 0;">What's Next?</h3>
                <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
                  <li>Our sales team will review your request within 24 hours</li>
                  <li>We'll contact you at <strong>${email}</strong> or <strong>${phone}</strong></li>
                  <li>We'll schedule a convenient time for your personalized demo</li>
                  <li>You'll get to see all the features that matter to your business</li>
                </ul>
                ${process.env.CALENDAR_LINK ? `
                <p style="margin: 15px 0 0 0; color: #333;">
                  You can also <a href="${process.env.CALENDAR_LINK}" style="color: #6366f1; text-decoration: none; font-weight: 600;">schedule a meeting directly</a>.
                </p>
                ` : ''}
              </div>
              
              <p style="color: #333; line-height: 1.6;">
                If you have any immediate questions, feel free to reach out to us at 
                <a href="mailto:support@worklogz.com" style="color: #6366f1; text-decoration: none; font-weight: 600;">support@worklogz.com</a>
              </p>
              
              <p style="color: #333; line-height: 1.6; margin-top: 20px;">
                Best regards,<br>
                <strong style="color: #6366f1;">The Worklogz Team</strong>
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 15px;">
              <p style="margin: 0;">Worklogz - Comprehensive Workforce Management Solution</p>
              <p style="margin: 5px 0 0 0;">Powered by Techackode</p>
            </div>
          </div>
        `
      };

      // Send both emails
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(confirmationMailOptions);

      res.status(200).json({
        success: true,
        message: 'Demo request submitted successfully. We will contact you soon!'
      });

    } catch (error) {
      console.error('Demo request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit demo request. Please try again later.'
      });
    }
  }
};

module.exports = demoController;

