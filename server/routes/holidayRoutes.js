const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const holidayController = require('../controllers/holidayController');

router.get('/', auth, authorizeAccess, holidayController.getAllHolidays);
router.post('/', auth, authorizeAccess, holidayController.createHoliday);
router.get('/filter', auth, authorizeAccess, holidayController.getHolidays);
router.delete('/delete/:id', auth, authorizeAccess, holidayController.deleteHoliday);
router.put('/update/:id', auth, authorizeAccess, holidayController.updateHoliday);
module.exports = router;