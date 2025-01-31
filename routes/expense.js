console.log("✅ expense.js is being executed...");
const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensure participantId is passed correctly
const Expense = require('../models/expensemodel'); // Updated to match lowercase and singular naming

console.log("✅ Setting up expense routes...");

// Add expense under a participant
router.post("/", async (req, res) => { // Remove "/:participantId/expenses" (already included from parent)
    console.log("✅ Registering expense routes...");
    try {
        const { sessionId, participantId } = req.params;
        const { description, amount } = req.body;

        if (!sessionId || !participantId) {
            return res.status(400).json({ error: "Session ID and Participant ID are required" });
        }
        if (!description || !amount) {
            return res.status(400).json({ error: "Description and amount are required" });
        }

        const expense = new Expense({ sessionId, participantId, description, amount });
        await expense.save();
        res.status(201).json({ message: "Expense added successfully", expense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ error: "Error adding expense", details: error.message });
    }
});

// Get all expenses for a specific participant
router.get("/", async (req, res) => { // Remove "/:participantId/expenses"
    try {
        const { sessionId, participantId } = req.params;

        if (!sessionId || !participantId) {
            return res.status(400).json({ error: "Session ID and Participant ID are required" });
        }

        const expenses = await Expense.find({ sessionId, participantId });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error retrieving expenses:", error);
        res.status(500).json({ error: "Error retrieving expenses", details: error.message });
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
