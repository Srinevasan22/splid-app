const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  share: {
    type: Number,
    required: true
  },
  balance: { // ✅ NEW: Ensure balance exists
    type: Number,
    default: 0 
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'session',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Participant = mongoose.model('participant', participantSchema);
module.exports = Participant;
