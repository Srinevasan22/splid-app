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

exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await Group.findByIdAndDelete(id);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.exportReport = async (req, res) => {
    try {
        res.status(200).json({ message: "Report exported successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Updated route with /splid prefix
router.get('/splid/logs', exports.getLogs);

module.exports = router;
