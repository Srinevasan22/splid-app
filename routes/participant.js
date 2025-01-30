const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantcontroller");

// Add a participant to a session
router.post("/:sessionId/participants", async (req, res) => {
    try {
        const { name, email, share } = req.body;
        const { sessionId } = req.params;
        if (!sessionId || !name || share === undefined) {
            return res.status(400).json({ error: "Session ID, name, and share are required" });
        }
        const participant = await participantController.addParticipant({ sessionId, name, email, share });
        res.status(201).json({ message: "Participant added successfully", participant });
    } catch (error) {
        console.error("Error adding participant:", error);
        res.status(500).json({ error: "Error adding participant", details: error.message });
    }
});

// Get participants in a session
router.get("/:sessionId/participants", async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }
        const participants = await participantController.getParticipants(sessionId);
        res.status(200).json(participants);
    } catch (error) {
        console.error("Error retrieving participants:", error);
        res.status(500).json({ error: "Error retrieving participants", details: error.message });
    }
});

// Delete a participant
router.delete("/:sessionId/participants/:participantId", async (req, res) => {
    try {
        const { sessionId, participantId } = req.params;
        if (!sessionId || !participantId) {
            return res.status(400).json({ error: "Session ID and Participant ID are required" });
        }
        await participantController.deleteParticipant(sessionId, participantId);
        res.status(200).json({ message: "Participant deleted successfully" });
    } catch (error) {
        console.error("Error deleting participant:", error);
        res.status(500).json({ error: "Error deleting participant", details: error.message });
    }
});

module.exports = router;
