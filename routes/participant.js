console.log("✅ participant.js is being executed...");
const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantcontroller");

console.log("✅ Setting up participant routes...");
// Explicitly define the correct path
router.post("/:sessionId/participants", async (req, res) => {
    console.log("✅ Registering participant routes...");
    try {
        await participantController.addParticipant(req, res);
    } catch (error) {
        console.error("Error adding participant:", error);
        res.status(500).json({ error: "Error adding participant", details: error.message });
    }
});

// Get all participants in a session
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

console.log("✅ Finalizing participant.js setup...");
console.log("✅ Registered participant routes:");
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`✅ Route: ${r.route.path} [${Object.keys(r.route.methods).join(",").toUpperCase()}]`);
    }
});
console.log("✅ participant.js setup complete.");


module.exports = router;
