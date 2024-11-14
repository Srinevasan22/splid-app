const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

// Route to add a new participant
router.post('/', participantController.addParticipant);

// Route to get all participants in a session
router.get('/:sessionId', participantController.getParticipants);

// Route to delete a participant
router.delete('/:participantId', participantController.deleteParticipant);

module.exports = router;
