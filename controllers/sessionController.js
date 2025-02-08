const mongoose = require('mongoose');
const Session = require('../models/sessionmodel');
const { getDb } = require('../db');  // Import MongoDB connection function

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking request body:", req.body);
        console.log("🔍 Checking user authentication:", req.user);

        // Extract name and email
        const { name } = req.body;
        let email = req.body.email || req.user.email;

        // 🚨 Log email before proceeding
        console.log("✅ Email from req.body:", req.body.email);
        console.log("✅ Email from req.user:", req.user.email);
        console.log("✅ Final email before saving:", email);

        // 🚨 TEMP FIX: Hardcode email for debugging
        if (!email) {
            email = "debug-fix@example.com";
            console.log("⚠️ Email was missing! Using hardcoded email:", email);
        }

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        console.log("✅ Creating session with:", { name, email });

        const newSession = new Session({
            name: name,
            email: email,
            participants: [email],
            createdAt: new Date()
        });

        console.log("✅ New session object before saving:", JSON.stringify(newSession, null, 2));

        await newSession.save();

        res.status(201).json({ message: "Session created successfully", session: newSession });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};
