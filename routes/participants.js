const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantController");

// Route to add a new participant
router.post("/add", participantController.addParticipant);

// Route to get all participants in a specific session
router.get("/session/:sessionId", participantController.getParticipants);

// Route to delete a specific participant by ID
router.delete("/delete/:participantId", participantController.deleteParticipant);

// Route to update a specific participant by ID
router.put("/update/:participantId", participantController.updateParticipant);

// Route to get all participants across all sessions
router.get("/all", participantController.getAllParticipants);

// Route to get a summary of expenses for a session
router.get("/summary/:sessionId", participantController.getSessionSummary);

// Route to clear all participants in a session
router.delete("/clear/:sessionId", participantController.clearSession);

// Route to calculate each participant's share in a session based on total expenses
router.post("/calculate-share/:sessionId", participantController.calculateShare);

module.exports = router;
