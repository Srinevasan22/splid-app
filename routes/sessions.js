const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Route to add a new session
router.post('/add', sessionController.addSession);

// Route to get all sessions
router.get('/', sessionController.getSessions);

module.exports = router;
