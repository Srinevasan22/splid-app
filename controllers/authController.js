const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.sendMagicLink = async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: "Email and name are required" });
        }

        let user = await User.findOne({ email });

        // If user does not exist, create a new one
        if (!user) {
            user = new User({ 
                email, 
                name, 
                userToken: `user_${Math.random().toString(36).substr(2, 9)}` 
            });
            await user.save();
        }

        // Generate a temporary login token
        const token = jwt.sign({ userToken: user.userToken }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Send login link via email (Using nodemailer SMTP)
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Change if using another provider
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email password or app password
            }
        });

        const loginUrl = `https://yourapp.com/login?token=${token}`;

        await transporter.sendMail({
            to: email,
            subject: "Your Magic Login Link",
            text: `Click here to log in: ${loginUrl}`,
            html: `<p>Click <a href="${loginUrl}">here</a> to log in.</p>`
        });

        res.status(200).json({ message: "Magic link sent to your email." });
    } catch (error) {
        console.error("Error sending magic link:", error);
        res.status(500).json({ message: "Error sending magic link", error: error.message });
    }
};
