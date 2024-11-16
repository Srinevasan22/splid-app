const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Session = require('../models/sessionmodel'); // Updated to match the new singular and lowercase naming

// Add session
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Check if a session with the same name already exists
        const existingSession = await Session.findOne({ name });
        if (existingSession) {
            return res.status(409).json({ error: 'A session with this name already exists' });
        }

        const session = new Session({ name }); // Updated to use the new model name
        await session.save();
        res.status(201).json({ message: 'Session added successfully', session });
    } catch (error) {
        console.error('Error adding session:', error);
        res.status(500).json({ error: 'Error adding session', details: error.message });
    }
});

// Get all sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 }); // Fetch sessions, newest first
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error retrieving sessions:', error);
        res.status(500).json({ error: 'Error retrieving sessions', details: error.message });
    }
});

// Get a session by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        // Find session by ID
        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ error: 'Error fetching session', details: error.message });
    }
});

// Delete a session by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        // Find and delete session by ID
        const session = await Session.findByIdAndDelete(id);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json({ message: 'Session deleted successfully', session });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Error deleting session', details: error.message });
    }
});

// Update a session by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Name is required for updating the session' });
        }

        // Find and update session by ID
        const updatedSession = await Session.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedSession) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json({ message: 'Session updated successfully', session: updatedSession });
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ error: 'Error updating session', details: error.message });
    }
});

module.exports = router;
