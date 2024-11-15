// routes/expenses.js

const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// Route to add a new expense
router.post("/add", expenseController.addExpense);

// Route to get all expenses for a specific session
router.get("/session/:sessionId", expenseController.getExpenses);

// Route to calculate balance for each participant in a session
router.get("/session/:sessionId/balance", expenseController.calculateBalance);

module.exports = router;
