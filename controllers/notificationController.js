const Notification = require('../models/notification');

exports.sendNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;
        const notification = new Notification({ userId, message, type });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};