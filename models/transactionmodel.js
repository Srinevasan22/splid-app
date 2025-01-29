const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('transaction', transactionSchema);
module.exports = Transaction;
