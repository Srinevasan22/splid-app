const ActivityLog = require('../models/activityLogmodel');
const Group = require('../models/groupmodel');

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

exports.updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGroup = await Group.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGroup = await Group.findByIdAndDelete(id);
        if (!deletedGroup) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};