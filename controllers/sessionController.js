const mongoose = require('mongoose'); // ✅ Import mongoose to validate ObjectId
const Session = require('../models/sessionmodel'); // Updated to lowercase

// Add a new session
exports.addSession = async (req, res) => {
    try {
        const { name, groupId } = req.body;  // Now we're expecting groupId in the request

        // ✅ Ensure groupId is provided and valid before checking ObjectId
        if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: "Invalid or missing groupId format" });
        }

        // ✅ Ensure name is provided
        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // ✅ Create a new session with name and groupId
        const newSession = new Session({ name, groupId });

        // Save the new session to the database
        await newSession.save();

        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};

// Get all sessions
exports.getSessions = async (req, res) => {
    try {
        // ✅ Populate groupId to ensure correct data fetching
        const sessions = await Session.find().populate("groupId").sort({ createdAt: -1 });

        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error retrieving sessions:", error);
        res.status(500).json({ message: "Error retrieving sessions", error: error.message });
    }
};
