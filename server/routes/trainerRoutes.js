const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAccess = require('../middleware/authorizeAccess');
const trainerController = require('../controllers/trainerController');

// GET all trainers
router.get('/', auth, authorizeAccess, trainerController.getAllTrainers);

// GET single trainer by ID
router.get('/:id', auth, authorizeAccess, trainerController.getTrainerById);

// CREATE new trainer
router.post('/', auth, authorizeAccess, trainerController.createTrainer);

// UPDATE trainer
router.put('/:id', auth, authorizeAccess, trainerController.updateTrainer);

// DELETE trainer
router.delete('/:id', auth, authorizeAccess, trainerController.deleteTrainer);

module.exports = router;

