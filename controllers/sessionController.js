const mongoose = require('mongoose'); // ✅ Import mongoose to validate ObjectId
const Session = require('../models/sessionmodel'); // Updated to lowercase

// Add a new session
exports.addSession = async (req, res) => {
    try {
        const { name } = req.body;

        console.log("🔍 Checking user authentication:", req.user); // ✅ Debugging

        if (!req.user || !req.user.email) {
            console.error("🚨 Email is missing in req.user!");
            return res.status(401).json({ message: "Unauthorized. User email is missing in authentication." });
        }

        const email = req.user.email;  // ✅ Extract email from authenticated user
        console.log("✅ Email extracted:", email); // ✅ Debugging

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // ✅ Check if a session with this name already exists for this email
        const existingSession = await Session.findOne({ name, email });
        if (existingSession) {
            return res.status(409).json({ message: "A session with this name already exists for this user." });
        }

        // ✅ Create a new session with the extracted email
        const newSession = new Session({ name, email, participants: [email] });

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

        const sessions = await Session.find({ participants: email }).sort({ createdAt: -1 }); // ✅ Fetch sessions where user is a participant
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error retrieving sessions:", error);
        res.status(500).json({ message: "Error retrieving sessions", error: error.message });
    }
};
