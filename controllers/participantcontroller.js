const mongoose = require("mongoose");
const Participant = require("../models/participantmodel"); // Updated to lowercase singular

// Add a new participant
exports.addParticipant = async (req, res) => {
    try {
        console.log("Received POST request for adding participant:", req.body);

        const { name, email, share } = req.body;
        const { sessionId } = req.params;

        if (!sessionId || !name || share === undefined) {
            console.error("Validation failed: Missing required fields.");
            return res.status(400).json({ error: "Session ID, name, and share are required" });
        }

        const newParticipant = new Participant({ sessionId, name, email, share });
        await newParticipant.save();

        console.log("Participant added successfully:", newParticipant);
        return res.status(201).json({ message: "Participant added successfully", participant: newParticipant });

    } catch (error) {
        console.error("Error adding participant:", error);
        return res.status(500).json({ error: "Error adding participant", details: error.message });
    }
};


// Get all participants in a session
exports.getParticipants = async (sessionId) => {
  try {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const participants = await Participant.find({ sessionId });

    // Return an empty array if no participants exist
    return participants.length ? participants : [];
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
