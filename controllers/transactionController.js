const Transaction = require('../models/transactionmodel');

exports.recordTransaction = async (req, res) => {
    try {
        const { fromUserId, toUserId, amount, currency, status } = req.body;
        const transaction = new Transaction({ fromUserId, toUserId, amount, currency, status });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};