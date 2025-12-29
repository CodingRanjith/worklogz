const MasterAdmin = require('../models/MasterAdmin');
const bcrypt = require('bcryptjs');

/**
 * Setup default master admin from environment variables
 * Master admin is stored in separate collection (not User collection)
 * Development use only - does not have access to user management
 * @returns {Promise<void>}
 */
const setupDefaultAdmin = async () => {
  try {
    // Use environment variables for master admin credentials
    const masterAdminEmail = process.env.MASTER_ADMIN_EMAIL;
    const masterAdminPassword = process.env.MASTER_ADMIN_PASSWORD;
    const masterAdminName = process.env.MASTER_ADMIN_NAME || 'Master Admin';
    const masterAdminPhone = process.env.MASTER_ADMIN_PHONE || '0000000000';
    const masterAdminCompany = process.env.MASTER_ADMIN_COMPANY || 'Development';

    // Skip if environment variables are not set
    if (!masterAdminEmail || !masterAdminPassword) {
      console.log('Master Admin environment variables not set. Skipping master admin creation.');
      return;
    }

    // Check if master admin already exists in MasterAdmin collection
    const existingMasterAdmin = await MasterAdmin.findOne({ email: masterAdminEmail });
    if (!existingMasterAdmin) {
      const hashedPassword = await bcrypt.hash(masterAdminPassword, 10);
      await MasterAdmin.create({
        name: masterAdminName,
        email: masterAdminEmail,
        password: hashedPassword,
        phone: masterAdminPhone,
        company: masterAdminCompany,
        isActive: true
      });
      console.log(`Master Admin created in separate collection: ${masterAdminEmail} / ${masterAdminPassword}`);
    } else {
      console.log(`Master Admin already exists: ${masterAdminEmail}`);
    }
  } catch (error) {
    console.error('Error setting up master admin:', error.message);
  }
};

module.exports = {
  setupDefaultAdmin,
};

