const express = require('express');
const router = express.Router();
const companySettingsController = require('../controllers/companySettingsController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Get company settings (public or authenticated)
router.get('/', auth, companySettingsController.getCompanySettings);

// Update company settings (admin only)
router.put('/', auth, role('admin'), companySettingsController.updateCompanySettings);

// Delete company logo (admin only)
router.delete('/logo', auth, role('admin'), companySettingsController.deleteCompanyLogo);

module.exports = router;

