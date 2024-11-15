const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');
const Participant = require('../models/participantModel');
const PDFDocument = require('pdfkit'); // Import PDF generation library

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

    const balances = {};
    participants.forEach(participant => {
      balances[participant._id] = { name: participant.name, balance: 0 };
    });

    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitAmong.length;

      if (balances[expense.paidBy]) {
        balances[expense.paidBy].balance += expense.amount;
      }

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

// Settle up between two participants
exports.settleUp = async (req, res) => {
  try {
    const { sessionId, payerId, receiverId, amount } = req.body;

    if (!sessionId || !payerId || !receiverId || !amount) {
      return res.status(400).json({ message: "Missing required fields: 'sessionId', 'payerId', 'receiverId', and 'amount' are required." });
    }

    const payer = await Participant.findById(payerId);
    const receiver = await Participant.findById(receiverId);

    if (!payer || !receiver || payer.sessionId !== sessionId || receiver.sessionId !== sessionId) {
      return res.status(400).json({ message: "Invalid payer or receiver ID or they do not belong to this session." });
    }

    payer.balance -= amount;
    receiver.balance += amount;

    await payer.save();
    await receiver.save();

    res.status(200).json({ message: "Settlement successful", balances: { [payerId]: payer.balance, [receiverId]: receiver.balance } });
  } catch (error) {
    console.error("Error settling up:", error);
    res.status(500).json({ message: "Error settling up", error: error.message });
  }
};

// Generate a session report
exports.generateSessionReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const expenses = await Expense.find({ sessionId });
    const participants = await Participant.find({ sessionId });

    const reportData = {
      totalExpenses: expenses.reduce((acc, expense) => acc + expense.amount, 0),
      participants: {},
      expenses: expenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
        paidBy: expense.paidBy,
        splitAmong: expense.splitAmong,
      })),
    };

    participants.forEach(participant => {
      reportData.participants[participant._id] = { name: participant.name, balance: 0 };
    });

    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitAmong.length;

      if (reportData.participants[expense.paidBy]) {
        reportData.participants[expense.paidBy].balance += expense.amount;
      }

      expense.splitAmong.forEach(participantId => {
        if (reportData.participants[participantId]) {
          reportData.participants[participantId].balance -= amountPerPerson;
        }
      });
    });

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};
