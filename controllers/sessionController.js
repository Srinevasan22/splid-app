const Session = require('../models/sessionModel');

// Add a new session
exports.addSession = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        const newSession = new Session({ name });
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
        const sessions = await Session.find().sort({ createdAt: -1 }); // Fetch sessions, newest first
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error retrieving sessions:", error);
        res.status(500).json({ message: "Error retrieving sessions", error: error.message });
    }
};
