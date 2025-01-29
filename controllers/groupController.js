const Group = require('../models/groupmodel');

exports.createGroup = async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;
        const group = new Group({ name, description, createdBy });
        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};