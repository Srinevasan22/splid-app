console.log("✅ participant.js is being executed...");
const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure sessionId is passed correctly
const participantController = require("../controllers/participantcontroller");

console.log("✅ Setting up participant routes...");

// Explicitly define the correct path
router.post("/", async (req, res) => { // Remove "/:sessionId/participants" (already included from parent)
    console.log("✅ Registering participant routes...");
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }
        await participantController.addParticipant(req, res);
    } catch (error) {
        console.error("Error adding participant:", error);
        res.status(500).json({ error: "Error adding participant", details: error.message });
    }
});

// Get all participants in a session.
router.get("/", async (req, res) => { 
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

// Get a specific participant by ID within a session
router.get("/:participantId", async (req, res) => { 
    try {
        const { participantId } = req.params;
        const sessionId = req.baseUrl.split('/')[2]; // Extract sessionId from the URL

        if (!sessionId || !participantId) {
            return res.status(400).json({ error: "Session ID and Participant ID are required" });
        }

        const participant = await participantController.getParticipantById(sessionId, participantId);
        if (!participant) {
            return res.status(404).json({ error: "Participant not found" });
        }

        res.status(200).json(participant);
    } catch (error) {
        console.error("Error retrieving participant:", error);
        res.status(500).json({ error: "Error retrieving participant", details: error.message });
    }
});



console.log("✅ Finalizing participant.js setup...");
console.log("✅ Registered participant routes:");
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`✅ Route: ${r.route.path} [${Object.keys(r.route.methods).join(",").toUpperCase()}]`);
    }
});
console.log("✅ participant.js setup complete.");

module.exports = router;
