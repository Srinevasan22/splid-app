const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'session', required: true }, // Updated to session-based
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentMethod: { type: String, enum: ["cash", "bank transfer", "PayPal"], required: true },
  date: { type: Date, default: Date.now }
});

const Settlement = mongoose.model('settlement', settlementSchema);
module.exports = Settlement;