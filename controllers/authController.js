const mongoose = require('mongoose');  // Ensure this is imported at the top
const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // ✅ Ensure environment variables are loaded

exports.sendMagicLink = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: "Email and name are required" });
        }

        console.log("🔍 Mongoose Connection Ready State:", mongoose.connection.readyState);

        // ✅ Run MongoDB debug logs inside an async IIFE
        (async () => {
            console.log("🔍 Checking database name:", mongoose.connection.name);
            console.log("🔍 Checking collection names:", await mongoose.connection.db.listCollections().toArray());
            console.log("🔍 Searching for user with email:", email);
        })();

        let user = await User.findOne({ email }).lean(); // ✅ Use .lean() to avoid hydration issues
        console.log("🔍 Found User:", user);

        // If user does not exist, create a new one
        if (!user) {
            user = new User({ 
                email, 
                name, 
                userToken: `user_${Math.random().toString(36).substr(2, 9)}` 
            });
            await user.save();
            console.log("✅ New User Created:", user);
        }

        // Generate a temporary login token
        const secretKey = process.env.JWT_SECRET || "default_secret_key"; // ✅ Fallback Secret Key
        const token = jwt.sign({ userToken: user.userToken, email: user.email }, secretKey, { expiresIn: '240m' });

        console.log("✅ Generated Token:", token);

        // Configure nodemailer with SMTP settings
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com", // Hostinger's SMTP server
            port: 465,                 // SSL/TLS Port
            secure: true,              // SSL enabled
            auth: {
                user: process.env.EMAIL_USER, // Hostinger email address
                pass: process.env.EMAIL_PASS  // Hostinger email password
            }
        });

        const loginUrl = `https://srinevasan.com/login?token=${token}`;

        console.log("📧 Sending Magic Link to:", email);

        await transporter.sendMail({
            to: email,
            subject: "Your Magic Login Link",
            text: `Click here to log in: ${loginUrl}`,
            html: `<p>Click <a href="${loginUrl}">here</a> to log in.</p>`
        });

        console.log("✅ Magic Link Sent!");

        res.status(200).json({ message: "Magic link sent to your email." });
    } catch (error) {
        console.error("❌ Error sending magic link:", error);
        res.status(500).json({ message: "Error sending magic link", error: error.message });
    }
};
