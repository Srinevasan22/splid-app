const ActivityLog = require('../models/activityLogmodel');
const Notification = require('../models/notificationmodel');

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
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
