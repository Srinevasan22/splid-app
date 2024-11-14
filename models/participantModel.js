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

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
