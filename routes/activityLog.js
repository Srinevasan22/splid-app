const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/activityLogmodel');

// Controller functions
exports.logAction = async (userId, action, details = {}) => {
    const logEntry = new ActivityLog({ userId, action, details });
    await logEntry.save();
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Updated route paths without /splid prefix
router.get('/', exports.getLogs);

module.exports = router;
