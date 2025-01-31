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
  currency: {  // NEW FIELD
    type: String,
    required: true,
    default: "USD"
  },
  splitType: {  // NEW FIELD
    type: String,
    enum: ["equal", "percentage", "shares"],
    required: true
  },
  splitDetails: [{  // NEW FIELD
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'participant' },
    share: Number
  }],
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'participant',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model('expense', expenseSchema);
module.exports = Expense;