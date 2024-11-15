const express = require('express');
const router = express.Router();
const Expenses = require('../models/expenses');

// Add expense
router.post('/add', async (req, res) => {
    try {
        const { sessionId, description, amount } = req.body;
        if (!sessionId || !description || !amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const expense = new Expenses({ sessionId, description, amount });
        await expense.save();
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        res.status(500).json({ error: 'Error adding expense', details: error.message });
    }
});

// Get expenses by session
router.get('/:sessionId', async (req, res) => {
    try {
        const expenses = await Expenses.find({ sessionId: req.params.sessionId });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving expenses', details: error.message });
    }
});

module.exports = router;
