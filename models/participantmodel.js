const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  share: {
    type: Number,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  }
});

// Updated model name to lowercase and singular
const Participant = mongoose.model('participant', participantSchema);

module.exports = Participant; // Export updated to match lowercase and singular file naming
