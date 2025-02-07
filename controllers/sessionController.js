const mongoose = require('mongoose');
const Session = require('../models/sessionmodel');

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking user authentication:", req.user);
        const { name } = req.body;

        // Ensure user email is present
        if (!req.user || !req.user.email) {
            console.error("🚨 Email is missing in req.user!", req.user);
            return res.status(401).json({ message: "Unauthorized. User email is missing in authentication." });
        }

        // Log email to ensure it's correctly passed
        const email = req.user.email || "no-email@example.com";  // Ensure email is never undefined
        console.log("✅ Final Email to be saved:", email);

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // Check if session already exists
        const existingSession = await Session.findOne({ name, email });
        if (existingSession) {
            return res.status(409).json({ message: "A session with this name already exists for this user." });
        }

        // Create a new session with the email
        const newSession = new Session({
            name: name,
            email: email,  // Ensure this is passed to the model
            participants: [email],
        });

        // Log the session object before saving
        console.log("✅ New session object before saving:", newSession);

        // Validate the session object before saving
        newSession.validate((error) => {
            if (error) {
                console.error("❌ Validation failed:", error.errors);
                return res.status(400).json({ message: "Session validation failed", error: error.errors });
            } else {
                console.log("✅ Session is ready to be saved!");
            }
        });

        // Save the session to MongoDB
        await newSession.save();

        // Send success response
        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};
