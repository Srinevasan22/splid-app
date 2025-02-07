const mongoose = require('mongoose');
const Session = require('../models/sessionmodel');

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking request body:", req.body);

        const { name, email } = req.body;  // Get email from req.body instead of req.user

        if (!email) {
            console.error("🚨 Email is missing in request body!", req.body);
            return res.status(400).json({ message: "Email is required in request body." });
        }

        console.log("✅ Final Email to be saved:", email);

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        const existingSession = await Session.findOne({ name, email });
        if (existingSession) {
            return res.status(409).json({ message: "A session with this name already exists for this user." });
        }

        const newSession = new Session({
            name: name,
            email: email,  // Email is now explicitly passed from req.body
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