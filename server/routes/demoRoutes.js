const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

router.post('/request', demoController.requestDemo);

module.exports = router;

