const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const controller = require('../controllers/applicationController');

router.get('/', auth, authorizeAccess, controller.getMyApplications);
router.post('/', auth, authorizeAccess, controller.createApplication);

module.exports = router;

