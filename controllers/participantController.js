const Participant = require("../models/participantModel"); // Assuming you have a Participant model

// Add a new participant
exports.addParticipant = async (req, res) => {
  try {
    const { name, email, share, sessionId } = req.body;

    // Check for required fields
    if (!name || share === undefined || !sessionId) {
      return res.status(400).json({
        message: "Missing required fields: 'name', 'share', and 'sessionId' are required"
      });
    }

    // Validate that share is a number
    if (typeof share !== "number") {
      return res.status(400).json({ message: "'share' must be a number" });
    }

    // Creating a new participant instance
    const newParticipant = new Participant({
      name,
      email,
      share,
      sessionId,
    });

    // Saving the participant to the database
    await newParticipant.save();
    res.status(201).json({
      message: "Participant added successfully",
      participant: newParticipant,
    });
  } catch (error) {
    console.error("Error adding participant:", error); // Log the full error for debugging
    res.status(500).json({ message: "Error adding participant", error: error.message });
  }
};

// Get all participants in a session
exports.getParticipants = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const participants = await Participant.find({ sessionId });
    res.status(200).json(participants);
  } catch (error) {
    console.error("Error retrieving participants:", error); // Log the full error for debugging
    res.status(500).json({ message: "Error retrieving participants", error: error.message });
  }
};

// Delete a participant
exports.deleteParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;
    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Deleting the participant
    const deletedParticipant = await Participant.findByIdAndDelete(participantId);
    if (!deletedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({ message: "Participant deleted successfully" });
  } catch (error) {
    console.error("Error deleting participant:", error); // Log the full error for debugging
    res.status(500).json({ message: "Error deleting participant", error: error.message });
  }
};
