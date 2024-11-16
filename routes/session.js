const express = require('express');
const router = express.Router();
const Session = require('../models/sessionmodel'); // Updated to match the new singular and lowercase naming

// Add session
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const session = new Session({ name }); // Updated to use the new model name
        await session.save();
        res.status(201).json({ message: 'Session added successfully', session });
    } catch (error) {
        res.status(500).json({ error: 'Error adding session', details: error.message });
    }
});

// Get all sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 }); // Fetch sessions, newest first
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving sessions', details: error.message });
    }
});

module.exports = router;
