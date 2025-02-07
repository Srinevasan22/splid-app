const mongoose = require('mongoose');
const Session = require('../models/sessionmodel');

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking user authentication:", req.user); // ✅ Log full `req.user`
        console.log("✅ Extracted Email:", req.user ? req.user.email : "❌ EMAIL UNDEFINED");

        const { name } = req.body;

        if (!req.user || !req.user.email) {
            console.error("🚨 Email is missing in req.user!", req.user);
            return res.status(401).json({ message: "Unauthorized. User email is missing in authentication." });
        }

        const email = req.user.email;
        console.log("✅ Final Email to be saved:", email); // ✅ Debugging before saving

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // ✅ Check if a session with this name already exists for this email
        const existingSession = await Session.findOne({ name, email });
        if (existingSession) {
            return res.status(409).json({ message: "A session with this name already exists for this user." });
        }

        // ✅ Debugging: Ensure email is correctly added to the new session
        const newSession = new Session({
            name: name,
            email: email, // 🔍 Ensure this field is being set
            participants: [email],
        });

        console.log("✅ New session object before saving:", newSession); // Debugging
        await newSession.save();

        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};
