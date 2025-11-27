const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/applicationController');

router.get('/', auth, controller.getMyApplications);
router.post('/', auth, controller.createApplication);

module.exports = router;

