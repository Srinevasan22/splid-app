const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentMethod: { type: String, enum: ["cash", "bank transfer", "PayPal"], required: true },
  date: { type: Date, default: Date.now }
});

const Settlement = mongoose.model('settlement', settlementSchema);
module.exports = Settlement;
