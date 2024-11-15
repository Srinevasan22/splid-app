const Expense = require('../models/expenseModel');
const Participant = require('../models/participantModel');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, splitAmong, sessionId } = req.body;

    if (!description || !amount || !paidBy || !splitAmong || !sessionId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newExpense = new Expense({
      description,
      amount,
      paidBy,
      splitAmong,
      sessionId
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};

// Get all expenses for a session
exports.getExpenses = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const expenses = await Expense.find({ sessionId }).populate('paidBy splitAmong');
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ message: "Error retrieving expenses", error: error.message });
  }
};

// Calculate the balance for each participant in a session
exports.calculateBalance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const participants = await Participant.find({ sessionId });
    const expenses = await Expense.find({ sessionId });

    // Initialize balances
    const balances = {};
    participants.forEach(participant => {
      balances[participant._id] = { name: participant.name, balance: 0 };
    });

    // Calculate balances
    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitAmong.length;

      // Update balance for the person who paid
      if (balances[expense.paidBy]) {
        balances[expense.paidBy].balance += expense.amount;
      }

      // Subtract from each person who was included in the split
      expense.splitAmong.forEach(participantId => {
        if (balances[participantId]) {
          balances[participantId].balance -= amountPerPerson;
        }
      });
    });

    res.status(200).json(balances);
  } catch (error) {
    console.error("Error calculating balances:", error);
    res.status(500).json({ message: "Error calculating balances", error: error.message });
  }
};
