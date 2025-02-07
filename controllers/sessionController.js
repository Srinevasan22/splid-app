const mongoose = require('mongoose'); // ✅ Import mongoose to validate ObjectId
const Session = require('../models/sessionmodel'); // Updated to lowercase

// Add a new session
exports.addSession = async (req, res) => {
    try {
        const { name } = req.body;  // Removed groupId, since it's no longer needed
        const email = req.user.email;  // ✅ Use email for session association

        // ✅ Ensure name is provided
        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // ✅ Check if session already exists for this user
        const existingSession = await Session.findOne({ name, email });
        if (existingSession) {
            return res.status(409).json({ message: "A session with this name already exists for this user." });
        }

        // ✅ Create a new session with name and email
        const newSession = new Session({ name, email });

        // Save the new session to the database
        await newSession.save();

        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};

// Get sessions for a specific user by email
exports.getUserSessions = async (req, res) => {
    try {
        const email = req.user.email;  // ✅ Extract email from authenticated user
        if (!email) {
            return res.status(400).json({ error: "User email is required" });
        }

        const sessions = await Session.find({ email }).sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error retrieving sessions:", error);
        res.status(500).json({ message: "Error retrieving sessions", error: error.message });
    }
};
