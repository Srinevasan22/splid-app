const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/send-magic-link', authController.sendMagicLink);

// Route to decode JWT for debugging
router.get('/decode-token', (req, res) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(400).json({ error: "Missing token in Authorization header" });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        res.status(200).json({ decoded });
    } catch (error) {
        res.status(400).json({ error: "Invalid token", details: error.message });
    }
});

module.exports = router;
