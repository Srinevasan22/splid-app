const express = require('express');
const router = express.Router();
const Sessions = require('../models/sessionsModel');

// Add session
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const session = new Sessions({ name });
        await session.save();
        res.status(201).json({ message: 'Session added successfully', session });
    } catch (error) {
        res.status(500).json({ error: 'Error adding session', details: error.message });
    }
});

module.exports = router;
