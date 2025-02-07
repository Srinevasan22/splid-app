const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Session = require('../models/sessionmodel'); // Updated to match the new singular and lowercase naming
const authMiddleware = require('../middleware/authMiddleware'); // Ensure authentication middleware is used

// Add session (Updated: Removed groupId, Added createdBy and participants)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            console.warn('Name is required but not provided in the request');
            return res.status(400).json({ error: 'Name is required' });
        }

        const session = new Session({ name, createdBy: req.user._id, participants: [req.user._id] });
        await session.save();
        console.log(`Session created successfully: ${session._id}`);
        res.status(201).json({ message: 'Session added successfully', session });
    } catch (error) {
        console.error('Error adding session:', error);
        res.status(500).json({ error: 'Error adding session', details: error.message });
    }
});

// Invite user to session via link
router.get('/join/:sessionId', authMiddleware, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        if (!session.participants.includes(req.user._id)) {
            session.participants.push(req.user._id);
            await session.save();
        }
        res.status(200).json({ message: 'User added to session', session });
    } catch (error) {
        console.error('Error joining session:', error);
        res.status(500).json({ error: 'Error joining session', details: error.message });
    }
});

// Get all sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().populate("participants").sort({ createdAt: -1 });
        console.log(`Retrieved ${sessions.length} sessions`);
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error retrieving sessions:', error);
        res.status(500).json({ error: 'Error retrieving sessions', details: error.message });
    }
});

// Get a session by ID
router.get('/:id', async (req, res) => {  // No need for '/splid' here
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn(`Invalid session ID format received: ${id}`);
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        const session = await Session.findById(id);
        if (!session) {
            console.warn(`Session not found for ID: ${id}`);
            return res.status(404).json({ error: 'Session not found' });
        }

        console.log(`Session retrieved: ${id}`);
        res.status(200).json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ error: 'Error fetching session', details: error.message });
    }
});

// Get sessions filtered by name
router.get('/search', async (req, res) => {  // No need for '/splid' here
    try {
        const { name } = req.query;

        if (!name) {
            console.warn('Name query parameter is required but not provided');
            return res.status(400).json({ error: 'Name query parameter is required' });
        }

        const sessions = await Session.find({ name: { $regex: name, $options: 'i' } });
        console.log(`Retrieved ${sessions.length} sessions matching the query "${name}"`);
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error searching sessions:', error);
        res.status(500).json({ error: 'Error searching sessions', details: error.message });
    }
});

// Delete a session by ID
router.delete('/:id', async (req, res) => {  // No need for '/splid' here
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn(`Invalid session ID format received for deletion: ${id}`);
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        const session = await Session.findByIdAndDelete(id);
        if (!session) {
            console.warn(`Session not found for deletion, ID: ${id}`);
            return res.status(404).json({ error: 'Session not found' });
        }

        console.log(`Session deleted: ${id}`);
        res.status(200).json({ message: 'Session deleted successfully', session });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Error deleting session', details: error.message });
    }
});

// Update a session by ID
router.put('/:id', async (req, res) => {  // No need for '/splid' here
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn(`Invalid session ID format received for update: ${id}`);
            return res.status(400).json({ error: 'Invalid session ID format' });
        }

        if (!name) {
            console.warn('Name is required for updating the session but not provided');
            return res.status(400).json({ error: 'Name is required for updating the session' });
        }

        const updatedSession = await Session.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedSession) {
            console.warn(`Session not found for update, ID: ${id}`);
            return res.status(404).json({ error: 'Session not found' });
        }

        console.log(`Session updated: ${id}`);
        res.status(200).json({ message: 'Session updated successfully', session: updatedSession });
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ error: 'Error updating session', details: error.message });
    }
});

// Bulk delete sessions
router.delete('/', async (req, res) => {  // No need for '/splid' here
    try {
        const result = await Session.deleteMany({});
        console.log(`All sessions deleted, count: ${result.deletedCount}`);
        res.status(200).json({ message: 'All sessions deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error deleting all sessions:', error);
        res.status(500).json({ error: 'Error deleting all sessions', details: error.message });
    }
});

module.exports = router;
