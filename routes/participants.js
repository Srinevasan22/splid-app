const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantController");

// Route to add a new participant
router.post("/add", participantController.addParticipant);

// Route to get all participants in a specific session
router.get("/session/:sessionId", participantController.getParticipants);

// Route to delete a specific participant by ID
router.delete("/delete/:participantId", participantController.deleteParticipant);

module.exports = router;
