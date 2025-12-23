const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Setup default admin user if it doesn't exist
 * @returns {Promise<void>}
 */
const setupDefaultAdmin = async () => {
  try {
    const masterAdminEmail = process.env.MASTER_ADMIN_EMAIL || 'ranjith.c96me@gmail.com';
    const masterAdminPassword = process.env.MASTER_ADMIN_PASSWORD || '12345678';
    const masterAdminName = process.env.MASTER_ADMIN_NAME || 'Master Admin';
    const masterAdminPhone = process.env.MASTER_ADMIN_PHONE || '6374129515';
    const masterAdminCompany = process.env.MASTER_ADMIN_COMPANY || 'Techackode';

    // Create master admin (goes to admin layout)
    const existingMasterAdmin = await User.findOne({ email: masterAdminEmail });
    if (!existingMasterAdmin) {
      const hashedPassword = await bcrypt.hash(masterAdminPassword, 10);
      await User.create({
        name: masterAdminName,
        email: masterAdminEmail,
        password: hashedPassword,
        role: 'master-admin',
        phone: masterAdminPhone,
        position: 'Master Admin',
        company: masterAdminCompany,
      });
      console.log(`Master Admin created: ${masterAdminEmail} / ${masterAdminPassword}`);
    } else {
      // Update existing admin to master-admin if it's currently 'admin'
      if (existingMasterAdmin.role === 'admin') {
        existingMasterAdmin.role = 'master-admin';
        existingMasterAdmin.position = 'Master Admin';
        await existingMasterAdmin.save();
        console.log(`Existing admin updated to Master Admin: ${masterAdminEmail}`);
      } else {
        console.log('Master Admin user already exists');
      }
    }

    // Optional: Create a normal admin user (goes to employee layout but has admin access)
    const normalAdminEmail = process.env.ADMIN_EMAIL || 'admin@techackode.com';
    const normalAdminPassword = process.env.ADMIN_PASSWORD || '12345678';
    const normalAdminName = process.env.ADMIN_NAME || 'Admin';
    const normalAdminPhone = process.env.ADMIN_PHONE || '6374129516';
    const normalAdminCompany = process.env.ADMIN_COMPANY || 'Techackode';

    const existingNormalAdmin = await User.findOne({ email: normalAdminEmail });
    if (!existingNormalAdmin && normalAdminEmail !== masterAdminEmail) {
      const hashedPassword = await bcrypt.hash(normalAdminPassword, 10);
      await User.create({
        name: normalAdminName,
        email: normalAdminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: normalAdminPhone,
        position: 'Admin',
        company: normalAdminCompany,
      });
      console.log(`Normal Admin created: ${normalAdminEmail} / ${normalAdminPassword}`);
    } else if (existingNormalAdmin && existingNormalAdmin.email === normalAdminEmail) {
      console.log('Normal Admin user already exists');
    }
  } catch (error) {
    console.error('Error setting up default admin:', error.message);
  }
};

module.exports = {
  setupDefaultAdmin,
};

