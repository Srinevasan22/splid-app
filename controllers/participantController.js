const mongoose = require("mongoose");
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

    // Check if participantId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ message: "Invalid participant ID format" });
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

// Update a participant
exports.updateParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;
    const updates = req.body;

    // Check if participantId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ message: "Invalid participant ID format" });
    }

    const updatedParticipant = await Participant.findByIdAndUpdate(
      participantId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({
      message: "Participant updated successfully",
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error("Error updating participant:", error);
    res.status(500).json({ message: "Error updating participant", error: error.message });
  }
};

// Get all participants in the system
exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find();
    res.status(200).json(participants);
  } catch (error) {
    console.error("Error retrieving all participants:", error);
    res.status(500).json({ message: "Error retrieving all participants", error: error.message });
  }
};

// Get summary of expenses for a session
exports.getSessionSummary = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const participants = await Participant.find({ sessionId });
    const totalShare = participants.reduce((sum, participant) => sum + participant.share, 0);

    res.status(200).json({
      sessionId,
      totalShare,
      participantCount: participants.length,
    });
  } catch (error) {
    console.error("Error retrieving session summary:", error);
    res.status(500).json({ message: "Error retrieving session summary", error: error.message });
  }
};

// Clear all participants in a session
exports.clearSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const result = await Participant.deleteMany({ sessionId });

    res.status(200).json({
      message: "All participants cleared from the session",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing session:", error);
    res.status(500).json({ message: "Error clearing session", error: error.message });
  }
};

// Calculate each participant's share in a session
exports.calculateShare = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { totalExpenses } = req.body;

    if (!sessionId || !totalExpenses || typeof totalExpenses !== "number") {
      return res.status(400).json({ message: "Session ID and valid total expenses are required" });
    }

    const participants = await Participant.find({ sessionId });
    const totalShare = participants.reduce((sum, participant) => sum + participant.share, 0);

    const calculatedShares = participants.map(participant => ({
      name: participant.name,
      email: participant.email,
      share: participant.share,
      amountOwed: (participant.share / totalShare) * totalExpenses,
    }));

    res.status(200).json({
      sessionId,
      totalExpenses,
      calculatedShares,
    });
  } catch (error) {
    console.error("Error calculating shares:", error);
    res.status(500).json({ message: "Error calculating shares", error: error.message });
  }
};
