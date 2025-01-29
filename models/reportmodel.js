const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group', required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  reportType: { type: String, enum: ["expense summary", "settlement report"], required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('report', reportSchema);
module.exports = Report;
