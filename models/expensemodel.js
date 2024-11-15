const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'participant', // Updated to lowercase to match file structure
    required: true
  },
  splitAmong: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'participant', // Updated to lowercase to match file structure
    required: true
  }],
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Updated model name to lowercase and singular
const Expense = mongoose.model('expense', expenseSchema);

module.exports = Expense;
