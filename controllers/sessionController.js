const mongoose = require('mongoose');
const Session = require('../models/sessionmodel');
const { getDb } = require('../db');  // Import MongoDB connection function

exports.addSession = async (req, res) => {
    try {
        console.log("🔍 Checking request body:", req.body);
        console.log("🔍 Checking user authentication:", req.user);

        const { name } = req.body;
        let email = req.body.email || req.user.email;

        if (!email) {
            console.error("🚨 Email is missing in request body AND req.user!", req.body, req.user);
            return res.status(400).json({ message: "Email is required in request body." });
        }

        console.log("✅ Final Email to be saved:", email);

        if (!name) {
            return res.status(400).json({ message: "Session name is required" });
        }

        // ✅ Directly insert into MongoDB using native driver
        const db = getDb();  // Get MongoDB connection
        const newSession = {
            name: name,
            email: email,  // Ensure email is being passed to MongoDB
            participants: [email],
            createdAt: new Date()
        };

        console.log("✅ Directly inserting into MongoDB:", newSession);
        const result = await db.collection('sessions').insertOne(newSession);

        res.status(201).json({ message: "Session created successfully", session: result.ops[0] });
    } catch (error) {
        console.error("❌ Error creating session:", error);
        res.status(500).json({ message: "Error creating session", error: error.message });
    }
};
