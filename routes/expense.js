const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensure sessionId is passed correctly
const Expense = require('../models/expensemodel'); // Updated to match lowercase and singular naming

console.log("✅ Setting up expense routes...");

// Add expense
router.post('/', async (req, res) => {  // Updated route
    try {
        const { sessionId } = req.params;
        const { description, amount } = req.body;
        if (!sessionId || !description || !amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const expense = new Expense({ sessionId, description, amount });
        await expense.save();
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        res.status(500).json({ error: 'Error adding expense', details: error.message });
    }
});

// Get expenses by session
router.get('/', async (req, res) => {  // Updated route
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }
        const expenses = await Expense.find({ sessionId });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving expenses', details: error.message });
    }
});

console.log("✅ Finalizing expense.js setup...");
console.log("✅ Registered expense routes:");
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`✅ Route: ${r.route.path} [${Object.keys(r.route.methods).join(",").toUpperCase()}]`);
    }
});
console.log("✅ expense.js setup complete.");

module.exports = router;
