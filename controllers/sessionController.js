const mongoose = require('mongoose');
const Session = require('../models/sessionmodel');
const { getDb } = require('../db');  // Import MongoDB connection function

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking request body:", req.body);

        const { name, email } = req.body;

        console.log("✅ Extracted name:", name);
        console.log("✅ Extracted email:", email);

        if (!email) {
            console.error("🚨 Email is missing in request body!", req.body);
            return res.status(400).json({ message: "Email is required in request body." });
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

