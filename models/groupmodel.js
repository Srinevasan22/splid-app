const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('group', groupSchema);
module.exports = Group;
