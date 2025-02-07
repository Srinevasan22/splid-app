const mongoose = require('mongoose');
const Session = require('../models/sessionmodel');

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking request body:", req.body);
        console.log("🔍 Checking user authentication:", req.user);

        // Ensure both name and email are extracted correctly
        const { name } = req.body;
        const email = req.body.email || req.user.email; // Prioritize req.body, fallback to req.user.email

        if (!email) {
            console.error("🚨 Email is missing in request body AND req.user!", req.body, req.user);
            return res.status(400).json({ message: "Email is required in request body." });
        }

        console.log("✅ Final Email to be saved:", email);

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // Log before saving to ensure email exists in the session object
        console.log("✅ Creating session with:", { name, email });

        const newSession = new Session({
            name: name,
            email: email, // Ensure email is explicitly passed
            participants: [email],
        });

        console.log("✅ New session object before saving:", newSession.toObject());

        await newSession.save();

        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};