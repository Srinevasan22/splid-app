console.log("✅ expense.js is being executed...");
const express = require('express');
const router = express.Router({ mergeParams: true }); // Ensure sessionId & participantId are passed correctly
const Expense = require('../models/expensemodel'); // Ensure correct model usage
const expenseController = require('../controllers/expensecontroller');

console.log("✅ Setting up expense routes...");

// ✅ Add expense under a participant
router.post("/", async (req, res) => { 
    console.log("✅ Registering expense route...");
    try {
        const { sessionId, participantId } = req.params;
        const { description, amount, currency, paidBy, splitType, splitDetails } = req.body;

        // ✅ Log the received data
        console.log("➡️ Received request:");
        console.log("➡️ Params:", { sessionId, participantId });
        console.log("➡️ Body:", { description, amount, currency, paidBy, splitType, splitDetails });

        // ✅ Ensure all required fields are present
        if (!sessionId || !participantId || !description || !amount || !currency || !paidBy || !splitType || !splitDetails) {
            console.error("❌ Missing required fields.");
            return res.status(400).json({ 
                error: "Session ID, Participant ID, description, amount, currency, paidBy, splitType, and splitDetails are required.",
                receivedBody: req.body 
            });
        }

        // ✅ Validate ObjectId formats
        if (!mongoose.Types.ObjectId.isValid(sessionId) || !mongoose.Types.ObjectId.isValid(participantId) || !mongoose.Types.ObjectId.isValid(paidBy)) {
            console.error("❌ Invalid MongoDB ObjectId format.");
            return res.status(400).json({ error: "Invalid session ID, participant ID, or paidBy ID format." });
        }

        console.log("✅ Creating expense with validated data...");

        // ✅ Create new expense object
        const newExpense = new Expense({
            sessionId,
            paidBy,
            description,
            amount,
            currency,
            splitType,
            splitDetails
        });

        // ✅ Save to database
        await newExpense.save();

        console.log("✅ Expense added successfully:", newExpense);
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        console.error("❌ Error adding expense:", error);
        res.status(500).json({ error: "Error adding expense", details: error.message });
    }
});

// ✅ Get all expenses for a participant in a session
router.get("/", async (req, res) => { 
    try {
        const { sessionId, participantId } = req.params;

        console.log("➡️ Fetching expenses for:", { sessionId, participantId });

        if (!sessionId || !participantId) {
            return res.status(400).json({ error: "Session ID and Participant ID are required" });
        }

        const expenses = await Expense.find({ sessionId, paidBy: participantId });

        console.log("✅ Retrieved expenses:", expenses.length);
        res.status(200).json(expenses);
    } catch (error) {
        console.error("❌ Error retrieving expenses:", error);
        res.status(500).json({ error: "Error retrieving expenses", details: error.message });
    }
});

console.log("✅ Finalizing expense.js setup...");
console.log("✅ Expense routes registered.");

module.exports = router;
