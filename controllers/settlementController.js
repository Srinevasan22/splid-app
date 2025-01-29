const Settlement = require('../models/settlementmodel');

exports.recordSettlement = async (req, res) => {
    try {
        const { fromUserId, toUserId, amount, currency, paymentMethod } = req.body;
        const settlement = new Settlement({ fromUserId, toUserId, amount, currency, paymentMethod });
        await settlement.save();
        res.status(201).json(settlement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};