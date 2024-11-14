const Participant = require("../models/participantModel"); // assuming you have a Participant model

// Add a new participant
exports.addParticipant = async (req, res) => {
  try {
    const { name, email, share, sessionId } = req.body;

    const newParticipant = new Participant({
      name,
      email,
      share,
      sessionId,
    });

    await newParticipant.save();
    res
      .status(201)
      .json({
        message: "Participant added successfully",
        participant: newParticipant,
      });
  } catch (error) {
    res.status(400).json({ message: "Error adding participant", error });
  }
};

// Get all participants in a session
exports.getParticipants = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const participants = await Participant.find({ sessionId });
    res.status(200).json(participants);
  } catch (error) {
    res.status(400).json({ message: "Error retrieving participants", error });
  }
};

// Delete a participant
exports.deleteParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;
    await Participant.findByIdAndDelete(participantId);
    res.status(200).json({ message: "Participant deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting participant", error });
  }
};
