const express = require('express');
const router = express.Router();

// Placeholder route for getting all participants
router.get('/', (req, res) => {
  res.send('Get all participants');
});

// Placeholder route for adding a participant
router.post('/', (req, res) => {
  res.send('Add a participant');
});

module.exports = router;
