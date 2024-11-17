const mongoose = require("mongoose");
const Participant = require("../models/participantmodel"); // Updated to lowercase singular

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
exports.getParticipants = async (sessionId) => {
  try {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const participants = await Participant.find({ sessionId });
    return participants;
  } catch (error) {
    console.error("Error retrieving participants:", error);
    throw new Error(error.message);
  }
};

// Get participants by session and send response
exports.getParticipantsBySession = async (req, res) => {
  try {
    const participants = await exports.getParticipants(req.params.sessionId);
    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving participants", error: error.message });
  }
};

// Delete a participant
exports.deleteParticipant = async (participantId) => {
  if (!participantId || !mongoose.Types.ObjectId.isValid(participantId)) {
    throw new Error("Invalid participant ID");
  }

  const deletedParticipant = await Participant.findByIdAndDelete(participantId);
  if (!deletedParticipant) {
    throw new Error("Participant not found");
  }

  return deletedParticipant;
};

// Update a participant
exports.updateParticipant = async (participantId, updates) => {
  if (!participantId || !mongoose.Types.ObjectId.isValid(participantId)) {
    throw new Error("Invalid participant ID");
  }

  const updatedParticipant = await Participant.findByIdAndUpdate(participantId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedParticipant) {
    throw new Error("Participant not found");
  }

  return updatedParticipant;
};

// Get all participants in the system
exports.getAllParticipants = async () => {
  const participants = await Participant.find();
  return participants;
};

// Get summary of expenses for a session
exports.getSessionSummary = async (sessionId) => {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  const participants = await Participant.find({ sessionId });
  const totalShare = participants.reduce((sum, participant) => sum + participant.share, 0);

  return {
    sessionId,
    totalShare,
    participantCount: participants.length,
  };
};

// Clear all participants in a session
exports.clearSession = async (sessionId) => {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  const result = await Participant.deleteMany({ sessionId });
  return result.deletedCount;
};

// Calculate each participant's share in a session
exports.calculateShare = async (sessionId, totalExpenses) => {
  if (!sessionId || typeof totalExpenses !== "number") {
    throw new Error("Session ID and valid total expenses are required");
  }

  const participants = await Participant.find({ sessionId });
  const totalShare = participants.reduce((sum, participant) => sum + participant.share, 0);

  return participants.map((participant) => ({
    name: participant.name,
    email: participant.email,
    share: participant.share,
    amountOwed: (participant.share / totalShare) * totalExpenses,
  }));
};
