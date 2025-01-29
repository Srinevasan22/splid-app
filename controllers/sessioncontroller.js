const Session = require('../models/sessionmodel'); // Updated to lowercase

// Add a new session
exports.addSession = async (req, res) => {
    try {
        const { name, groupId } = req.body;  // Now we're expecting groupId in the request

        // Check if the required fields are provided
        if (!name || !groupId) {
            return res.status(400).json({ message: "Session name and groupId are required" });
        }

        // Ensure groupId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: "Invalid groupId format" });
        }

        // Create a new session with the name and groupId
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
        const sessions = await Session.find().sort({ createdAt: -1 }); // Fetch sessions, newest first
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error retrieving sessions:", error);
        res.status(500).json({ message: "Error retrieving sessions", error: error.message });
    }
};
