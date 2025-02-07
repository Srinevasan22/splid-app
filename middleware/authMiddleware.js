const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        console.log("🔍 Decoded JWT Payload:", decoded);  // ✅ Debugging: See if email is included

        if (!decoded.email) {
            console.error("🚨 Missing email in decoded token!");
            return res.status(400).json({ message: "Authentication failed. Email is missing from token." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
