const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantcontroller");

// Route to add a participant to a session
router.post("/participants/:sessionId", async (req, res) => {
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

// Route to get all participants in a session
router.get("/participants/:sessionId", async (req, res) => {
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

// Route to delete a participant from a session
router.delete("/participants/:sessionId/:participantId", async (req, res) => {
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

// Route to update a participant
router.put("/participants/:participantId", async (req, res) => {
    try {
        const participantId = req.params.participantId;
        const updates = req.body;
        if (!participantId || !updates) {
            return res.status(400).json({ error: "Participant ID and updates are required" });
        }
        const updatedParticipant = await participantController.updateParticipant(participantId, updates);
        res.status(200).json({
            message: "Participant updated successfully",
            updatedParticipant,
        });
    } catch (error) {
        console.error("Error updating participant:", error);
        res.status(500).json({ error: "Error updating participant", details: error.message });
    }
});

// Route to get all participants across all sessions.
router.get("/participants", async (req, res) => {
    try {
        const allParticipants = await participantController.getAllParticipants();
        if (!allParticipants || allParticipants.length === 0) {
            return res.status(404).json({ error: "No participants found" });
        }
        res.status(200).json(allParticipants);
    } catch (error) {
        console.error("Error retrieving all participants:", error);
        res.status(500).json({ error: "Error retrieving all participants", details: error.message });
    }
});

module.exports = router;
