const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantcontroller'); // Updated to match lowercase and singular naming

// Route to add a new participant
router.post('/add', async (req, res) => {
    try {
        const { sessionId, name } = req.body;
        if (!sessionId || !name) {
            return res.status(400).json({ error: 'Session ID and name are required' });
        }
        const participant = await participantController.addParticipant(req.body);
        res.status(201).json({ message: 'Participant added successfully', participant });
    } catch (error) {
        res.status(500).json({ error: 'Error adding participant', details: error.message });
    }
});

// Route to get all participants in a specific session
router.get('/session/:sessionId', async (req, res) => {
    try {
        const participants = await participantController.getParticipants(req.params.sessionId);
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving participants', details: error.message });
    }
});

// Route to delete a specific participant by ID
router.delete('/delete/:participantId', async (req, res) => {
    try {
        await participantController.deleteParticipant(req.params.participantId);
        res.status(200).json({ message: 'Participant deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting participant', details: error.message });
    }
});

// Route to update a specific participant by ID
router.put('/update/:participantId', async (req, res) => {
    try {
        const updatedParticipant = await participantController.updateParticipant(req.params.participantId, req.body);
        res.status(200).json({ message: 'Participant updated successfully', updatedParticipant });
    } catch (error) {
        res.status(500).json({ error: 'Error updating participant', details: error.message });
    }
});

// Route to get all participants across all sessions
router.get('/all', async (req, res) => {
    try {
        const allParticipants = await participantController.getAllParticipants();
        res.status(200).json(allParticipants);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving all participants', details: error.message });
    }
});

// Route to get a summary of expenses for a session
router.get('/summary/:sessionId', async (req, res) => {
    try {
        const summary = await participantController.getSessionSummary(req.params.sessionId);
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving session summary', details: error.message });
    }
});

// Route to clear all participants in a session
router.delete('/clear/:sessionId', async (req, res) => {
    try {
        await participantController.clearSession(req.params.sessionId);
        res.status(200).json({ message: 'Session cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error clearing session', details: error.message });
    }
});

// Route to calculate each participant's share in a session based on total expenses
router.post('/calculate-share/:sessionId', async (req, res) => {
    try {
        const share = await participantController.calculateShare(req.params.sessionId);
        res.status(200).json(share);
    } catch (error) {
        res.status(500).json({ error: 'Error calculating share', details: error.message });
    }
});

module.exports = router;
