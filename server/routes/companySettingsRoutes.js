const express = require('express');
const router = express.Router();
const companySettingsController = require('../controllers/companySettingsController');
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');

// Get company settings (public or authenticated)
router.get('/', auth, authorizeAccess, companySettingsController.getCompanySettings);

// Update company settings (admin only)
router.put('/', auth, authorizeAccess, companySettingsController.updateCompanySettings);

// Delete company logo (admin only)
router.delete('/logo', auth, authorizeAccess, companySettingsController.deleteCompanyLogo);

module.exports = router;

